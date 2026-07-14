import { DecomposeCalculator } from "@/calculator/alchemy"
import { EnhanceCalculator } from "@/calculator/enhance"
import { getStorageCalculatorItem } from "@/calculator/utils"
import { WorkflowCalculator } from "@/calculator/workflow"
import locales, { getTrans } from "@/locales"
import { useGameStoreOutside } from "@/pinia/stores/game"
import { getGameDataApi } from "../game"

import { getUsedPriceOf } from "../price"
import { handlePage, handlePush, handleSearch, handleSort } from "../utils"

const { t } = locales.global
/** 查 */
export async function getEnhanposerDataApi(params: any) {
  let profitList: WorkflowCalculator[] = []
  if (useGameStoreOutside().getEnhanposerCache()) {
    profitList = useGameStoreOutside().getEnhanposerCache()
  } else {
    await new Promise(resolve => setTimeout(resolve, 300))
    const startTime = Date.now()
    try {
      profitList = profitList.concat(calcEnhanceProfit())
    } catch (e: any) {
      console.error(e)
    }
    useGameStoreOutside().setEnhanposerCache(profitList)
    ElMessage.success(t("计算完成，耗时{0}秒", [(Date.now() - startTime) / 1000]))
  }

  console.log("params", params)
  profitList = profitList.filter(item => params.maxLevel ? (item.calculator as DecomposeCalculator).enhanceLevel <= params.maxLevel : true)
  profitList = profitList.filter(item => params.minLevel ? (item.calculator as DecomposeCalculator).enhanceLevel >= params.minLevel : true)

  return handlePage(handleSort(handleSearch(profitList, params), params), params)
}

function calcEnhanceProfit() {
  const gameData = getGameDataApi()
  // 所有物品列表
  const list = Object.values(gameData.itemDetailMap)
  const profitList: WorkflowCalculator[] = []
  list.filter(item => item.enhancementCosts).forEach((item) => {
    if (getUsedPriceOf(item.hrid, 0, "ask") === -1) {
      return
    }
    for (let enhanceLevel = 1; enhanceLevel <= 20; enhanceLevel++) {
      if (getUsedPriceOf(item.hrid, 0, "ask") === -1) {
        continue
      }

      let bestProfit = -Infinity
      let bestCal: WorkflowCalculator | undefined
      for (let protectLevel = (enhanceLevel > 2 ? 2 : enhanceLevel); protectLevel <= enhanceLevel; protectLevel++) {
        const enhancer = new EnhanceCalculator({ enhanceLevel, protectLevel, hrid: item.hrid })
        for (let catalystRank = 0; catalystRank <= 2; catalystRank++) {
          if (!useGameStoreOutside().checkSecret() && item.itemLevel > 1) {
            continue
          }

          const decomposer = new DecomposeCalculator({ enhanceLevel, hrid: item.hrid, catalystRank })
          if (!decomposer.available) {
            continue
          }

          // 预筛选，把不可能盈利的去掉
          if (!enhancer.profitable) {
            continue
          }

          // protectLevel = enhanceLevel 时表示不用垫子
          const c = new WorkflowCalculator([
            getStorageCalculatorItem(enhancer),
            getStorageCalculatorItem(decomposer)
          ], `${getTrans("强化分解")}+${enhanceLevel}`)

          c.run()

          if (c.result.profitPH > bestProfit) {
            bestProfit = c.result.profitPH
            bestCal = c
          }
        }
      }
      bestCal && handlePush(profitList, bestCal)
    }
  })
  return profitList
}
