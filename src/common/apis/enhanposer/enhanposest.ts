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
export async function getEnhanposestDataApi(params: any) {
  let profitList: WorkflowCalculator[] = []
  if (useGameStoreOutside().getJungleCache("enhanposest")) {
    profitList = useGameStoreOutside().getJungleCache("enhanposest")
  } else {
    await new Promise(resolve => setTimeout(resolve, 300))
    const startTime = Date.now()
    try {
      profitList = profitList.concat(calcEnhanceProfit())
    } catch (e: any) {
      console.error(e)
    }
    useGameStoreOutside().setJungleCache(profitList, "enhanposest")
    ElMessage.success(t("计算完成，耗时{0}秒", [(Date.now() - startTime) / 1000]))
  }

  profitList = profitList.filter(item => params.maxLevel ? (item.calculator as DecomposeCalculator).enhanceLevel <= params.maxLevel : true)
  profitList = profitList.filter(item => params.minLevel ? (item.calculator as DecomposeCalculator).enhanceLevel >= params.minLevel : true)

  return handlePage(handleSort(handleSearch(profitList, params), params), params)
}

function calcEnhanceProfit() {
  const gameData = getGameDataApi()
  // 所有物品列表
  const list = Object.values(gameData.itemDetailMap)
  const profitList: WorkflowCalculator[] = []
  const escapeLevels = [-1, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  const originLevels = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  const targetLevels = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  // const targetLevels = [15]

  // const escapeLevels = Array.from({ length: 20 }, (_, i) => i)
  // const originLevels = Array.from({ length: 20 }, (_, i) => i)
  // const targetLevels = Array.from({ length: 20 }, (_, i) => i)

  list.filter(item => item.enhancementCosts).forEach((item) => {
    for (const enhanceLevel of targetLevels.reverse()) {
      let bestProfit = -Infinity
      let bestCal: WorkflowCalculator | undefined

      for (const originLevel of originLevels) {
        if (getUsedPriceOf(item.hrid, originLevel, "ask") === -1) {
          continue
        }
        for (const escapeLevel of escapeLevels) {
          if (originLevel >= enhanceLevel || escapeLevel >= originLevel) {
            continue
          }
          for (let protectLevel = (enhanceLevel > 2 ? 2 : enhanceLevel); protectLevel <= enhanceLevel; protectLevel++) {
            const enhancer = new EnhanceCalculator({ enhanceLevel, escapeLevel, originLevel, protectLevel, hrid: item.hrid })
            // 预筛选，把不可能盈利的去掉
            if (!enhancer.available || !enhancer.profitable) {
              continue
            }

            for (let catalystRank = 0; catalystRank <= 2; catalystRank++) {
              // protectLevel = enhanceLevel 时表示不用垫子
              const c = new WorkflowCalculator([
                getStorageCalculatorItem(enhancer),
                getStorageCalculatorItem(new DecomposeCalculator({ enhanceLevel, hrid: item.hrid, catalystRank }))
              ], `+${originLevel} ${getTrans("→")} +${enhanceLevel}`)

              c.run()

              if (c.result.profitPH > bestProfit) {
                bestProfit = c.result.profitPH
                bestCal = c
              }
            }
          }
        }
      }

      bestCal && handlePush(profitList, bestCal)
    }
  })
  return profitList
}
