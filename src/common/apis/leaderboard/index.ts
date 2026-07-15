import type * as Leaderboard from "./type"

import type Calculator from "@/calculator"
import type { Action } from "~/game"
import { CoinifyCalculator, DecomposeCalculator, TransmuteCalculator } from "@/calculator/alchemy"
import { GatherCalculator } from "@/calculator/gather"
import { ManufactureCalculator } from "@/calculator/manufacture"
import { getStorageCalculatorItem } from "@/calculator/utils"
import { WorkflowCalculator } from "@/calculator/workflow"
import locales, { getTrans } from "@/locales"
import { type StorageCalculatorItem, useFavoriteStoreOutside } from "@/pinia/stores/favorite"
import { useGameStoreOutside } from "@/pinia/stores/game"
import { getGameDataApi } from "../game"
import { isShopTier, parseTierLevel, TIER_CHAINS } from "./tierChains"
import { handlePage, handlePush, handleSearch, handleSort, handleVolume1hSearch } from "../utils"

const { t } = locales.global
/** 查 */
export async function getLeaderboardDataApi(params: Leaderboard.RequestData) {
  const includeTax = params.includeTax !== false
  const sellTaxFactor = includeTax ? 0.98 : 1
  const crossStepBalance = params.crossStepBalance === true

  let profitList: Calculator[] = []
  const cacheKey = `${useGameStoreOutside().marketData!.timestamp}-${includeTax ? "tax" : "noTax"}-${crossStepBalance ? "csb" : "noCsb"}`
  const cached = useGameStoreOutside().getLeaderboardCache(cacheKey)
  if (cached && cached.length > 0) {
    profitList = cached
  } else {
    await new Promise(resolve => setTimeout(resolve, 100))
    const startTime = Date.now()
    let hasError = false
    try {
      profitList = calcProfit(sellTaxFactor)
      profitList = profitList.concat(calcAllFlowProfit(sellTaxFactor, crossStepBalance))
    } catch (e: any) {
      hasError = true
      console.error(e)
    }

    if (profitList.length > 0) {
      useGameStoreOutside().setLeaderBoardCache(profitList, cacheKey)
    } else {
      useGameStoreOutside().clearLeaderBoardCache(cacheKey)
    }

    if (hasError || profitList.length === 0) {
      ElMessage.error(t("计算失败或结果为空，请打开控制台查看错误"))
    } else {
      ElMessage.success(t("计算完成，耗时{0}秒", [(Date.now() - startTime) / 1000]))
    }
  }
  profitList.forEach(item => item.favorite = useFavoriteStoreOutside().hasFavorite(item))
  profitList = profitList.filter(item => item.actionLevel >= (params.actionLevel || 0))
  const hasMaxItemLevel = params.maxItemLevel !== undefined && params.maxItemLevel !== null
  if (hasMaxItemLevel) {
    const maxItemLevel = Number(params.maxItemLevel)
    profitList = profitList.filter((item) => {
      const itemLevel = item.item?.itemLevel
      return typeof itemLevel === "number" && itemLevel <= maxItemLevel
    })
  }
  profitList = handleVolume1hSearch(profitList, params)

  // 逐级制作 / 起始材质筛选（仅对 workflow 多步制作生效）
  const startTier = params.startTierLevel
  const endTier = params.endTierLevel
  const hasStartTier = startTier !== undefined && startTier !== null && startTier !== ""
  const hasEndTier = endTier !== undefined && endTier !== null && endTier !== ""
  if (hasStartTier || hasEndTier) {
    profitList = profitList.filter((item: any) => {
      // 只有 workflow（多步制作）才有 calculatorList，非 workflow 不参与档位筛选
      const calcList = item.calculatorList
      if (!Array.isArray(calcList) || calcList.length < 1) return false
      // 起点材质：calculatorList[0] 的产物 itemLevel（不受 configs 引用污染）
      const firstCal = Array.isArray(calcList[0]) ? calcList[0][0] : calcList[0]
      const startLevel = firstCal?.item?.itemLevel
      // 终点材质：workflow 最终产物 itemLevel
      const endLevel = item.item?.itemLevel
      if (hasStartTier && startLevel !== parseTierLevel(startTier)) return false
      if (hasEndTier && endLevel !== parseTierLevel(endTier)) return false
      return true
    })
  }

  // 商店购买模式：起始材质的基础物品使用商店固定价格
  if (isShopTier(startTier)) {
    const tierLevel = parseTierLevel(startTier)
    const chains = TIER_CHAINS
    let shopCost: number | undefined
    for (const chainList of Object.values(chains)) {
      for (const chain of chainList) {
        const tier = chain.tiers.find((t: any) => t.itemLevel === tierLevel && t.shopCost)
        if (tier) { shopCost = tier.shopCost; break }
      }
      if (shopCost !== undefined) break
    }
    if (shopCost !== undefined) {
      profitList = profitList.map((item: any) => {
        const ingrList = item.ingredientListWithPrice
        if (!Array.isArray(ingrList) || ingrList.length === 0) return item
        
        // 用商店价替换第一个原料的价格
        const oldPrice = ingrList[0].price || 0
        const priceDelta = shopCost - oldPrice
        if (priceDelta === 0) return item
        
        // 更新原料价格
        const newIngrList = ingrList.map((ing: any, i: number) => {
          if (i === 0) return { ...ing, price: shopCost }
          return ing
        })
        
        // 用价格差值重新计算利润相关字段
        // 假设 countPH 是每小时消耗量，利润变化 = -delta * countPH
        const countPH = ingrList[0].countPH || 1
        const profitDelta = -priceDelta * countPH
        
        const result = { ...item.result }
        result.profitPH = (result.profitPH || 0) + profitDelta
        result.profitPD = (result.profitPD || 0) + profitDelta * 24
        
        return {
          ...item,
          ingredientListWithPrice: newIngrList,
          result,
          hasManualPrice: true
        }
      })
    }
  }

  return handlePage(handleSort(handleSearch(profitList, params), params), params)
}

function calcProfit(sellTaxFactor: number) {
  const gameData = getGameDataApi()
  // 所有物品列表
  const list = Object.values(gameData.itemDetailMap)
  const profitList: Calculator[] = []
  list.forEach((item) => {
    const cList = []
    for (let catalystRank = 0; catalystRank <= 2; catalystRank++) {
      const transmute = new TransmuteCalculator({
        hrid: item.hrid,
        catalystRank
      })
      transmute.setSellTaxFactor(sellTaxFactor)
      cList.push(transmute)

      const decompose = new DecomposeCalculator({
        hrid: item.hrid,
        catalystRank
      })
      decompose.setSellTaxFactor(sellTaxFactor)
      cList.push(decompose)

      const coinify = new CoinifyCalculator({
        hrid: item.hrid,
        catalystRank
      })
      coinify.setSellTaxFactor(sellTaxFactor)
      cList.push(coinify)
    }
    cList.forEach(c => handlePush(profitList, c))
    const projects: [string, Action][] = [
      [getTrans("锻造"), "cheesesmithing"],
      [getTrans("制造"), "crafting"],
      [getTrans("裁缝"), "tailoring"],
      [getTrans("烹饪"), "cooking"],
      [getTrans("冲泡"), "brewing"]
    ]
    for (const [project, action] of projects) {
      const c = new ManufactureCalculator({ hrid: item.hrid, project, action })
      c.setSellTaxFactor(sellTaxFactor)
      handlePush(profitList, c)
    }

    const gatherings: [string, Action][] = [
      [getTrans("挤奶"), "milking"],
      [getTrans("采摘"), "foraging"],
      [getTrans("伐木"), "woodcutting"]
    ]
    for (const [project, action] of gatherings) {
      const c = new GatherCalculator({ hrid: item.hrid, project, action })
      c.setSellTaxFactor(sellTaxFactor)
      handlePush(profitList, c)
    }
  })
  return profitList
}

function calcAllFlowProfit(sellTaxFactor: number, crossStepBalance: boolean) {
  const gameData = getGameDataApi()
  // 所有物品列表
  const list = Object.values(gameData.itemDetailMap)
  const profitList: Calculator[] = []
  list.forEach((item) => {
    const projects: [string, Action][] = [
      [getTrans("锻造"), "cheesesmithing"],
      [getTrans("制造"), "crafting"],
      [getTrans("裁缝"), "tailoring"],
      [getTrans("烹饪"), "cooking"],
      [getTrans("冲泡"), "brewing"]
    ]
    for (const [project, action] of projects) {
      const configs: StorageCalculatorItem[] = []
      let c = new ManufactureCalculator({ hrid: item.hrid, project, action })
      let actionItem = c.actionItem
      if (!actionItem?.upgradeItemHrid) {
        continue
      }

      while (actionItem && actionItem.upgradeItemHrid) {
        configs.unshift(getStorageCalculatorItem(c))

        if (configs.length > 1) {
          let projectName = t("{0}步{1}", [configs.length, project])
          const otherProject = configs.find(conf => conf.project !== project)
          otherProject && (projectName += t("({0})", [otherProject?.project]))
          handlePush(profitList, new WorkflowCalculator(configs, projectName, sellTaxFactor, crossStepBalance))
        }

        // D4更新后，会出现多步动作中出现不同Action组合的情况
        for (const [project, action] of projects) {
          c = new ManufactureCalculator({ hrid: actionItem.upgradeItemHrid, project, action })
          if (c.actionItem) {
            break
          }
        }

        actionItem = c.actionItem
      }
      configs.unshift(getStorageCalculatorItem(c))

      let projectName = t("{0}步{1}", [configs.length, project])
      const otherProject = configs.find(conf => conf.project !== project)
      otherProject && (projectName += t("({0})", [otherProject?.project]))
      handlePush(profitList, new WorkflowCalculator(configs, projectName, sellTaxFactor, crossStepBalance))
    }
  })
  return profitList
}
