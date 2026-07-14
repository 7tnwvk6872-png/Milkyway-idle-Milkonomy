<script lang="ts" setup>
import type Calculator from "@/calculator"
import { getLeaderboardDataApi } from "@@/apis/leaderboard"
import { normalizeProject, supportsTierFilter, TIER_CHAINS } from "@@/apis/leaderboard/tierChains"
import ItemIcon from "@@/components/ItemIcon/index.vue"
import { usePagination } from "@@/composables/usePagination"
import { Delete, Edit, Search, Star, StarFilled, Warning } from "@element-plus/icons-vue"
import { ElMessageBox, type FormInstance, type Sort } from "element-plus"
import { cloneDeep, debounce } from "lodash-es"

import { addFavoriteApi, deleteFavoriteApi, getFavoriteDataApi } from "@/common/apis/favorite"
import { getPriceOf } from "@/common/apis/game"
import { getActionConfigOf } from "@/common/apis/player"
import { useMemory } from "@/common/composables/useMemory"
import { usePriceStatus } from "@/common/composables/usePriceStatus"
import * as Format from "@/common/utils/format"
import { useFavoriteStore } from "@/pinia/stores/favorite"
import { useGameStore } from "@/pinia/stores/game"
import { usePlayerStore } from "@/pinia/stores/player"
import { usePriceStore } from "@/pinia/stores/price"
import ActionConfig from "./components/ActionConfig.vue"
import ActionDetail from "./components/ActionDetail.vue"

import ActionPrice from "./components/ActionPrice.vue"
import GameInfo from "./components/GameInfo.vue"
import ManualPriceCard from "./components/ManualPriceCard.vue"
import PriceStatusSelect from "./components/PriceStatusSelect.vue"

// #region 查
const favoriteStore = useFavoriteStore()
const { paginationData: paginationDataLD, handleCurrentChange: handleCurrentChangeLD, handleSizeChange: handleSizeChangeLD } = usePagination({}, "dashboard-leaderboard-pagination")

const leaderboardData = ref<Calculator[]>([])

// 预设对比
const isComparing = ref(false)
const compareDataB = ref<Record<string, Calculator>>({})
const compareNameA = ref('')
const compareNameB = ref('')
const compareIdxA = ref(0)
let _comparePhase = 0

function handleCompare(presetBIndex: number) {
  const ps = usePlayerStore()
  compareIdxA.value = ps.presetIndex
  compareNameA.value = ps.presets[ps.presetIndex].name || '预设A'
  compareNameB.value = ps.presets[presetBIndex].name || '预设B'
  _comparePhase = 1
  ps.switchTo(presetBIndex)
}

function exitCompare() {
  isComparing.value = false
  compareDataB.value = {}
  // 如果正在恢复中，强制切回 A
  if (_comparePhase === 2) {
    usePlayerStore().switchTo(compareIdxA.value)
    _comparePhase = 0
  }
}

const displayLeaderboardData = computed(() => {
  if (!isComparing.value) return leaderboardData.value
  return leaderboardData.value.map(row => {
    const b = compareDataB.value[row.key]
    if (!b) return row
    return { ...row, _dataB: b }
  })
})

// 监听 leaderboardData 捕获 B 的计算结果
watch(leaderboardData, (newVal) => {
  if (_comparePhase === 1) {
    const map: Record<string, Calculator> = {}
    for (const item of newVal) map[item.key] = item
    compareDataB.value = map
    _comparePhase = 2
    usePlayerStore().switchTo(compareIdxA.value)
  } else if (_comparePhase === 2) {
    isComparing.value = true
    _comparePhase = 0
  }
})

const ldSearchFormRef = ref<FormInstance | null>(null)

const ldSearchData = useMemory("dashboard-leaderboard-search-data", {
  name: "",
  project: "",
  profitRate: 10,
  maxItemLevel: undefined,
  minVolume1h: undefined,
  maxVolume1h: undefined,
  banEquipment: true,
  banCharm: false,
  tierChainKey: "",
  startTierLevel: "",
  endTierLevel: ""
})

const includeTax = useMemory("dashboard-include-tax", true)
const crossStepBalance = useMemory("dashboard-cross-step-balance", false)

const loadingLD = ref(false)

const getLeaderboardData = debounce(() => {
  loadingLD.value = true
  getLeaderboardDataApi({
    currentPage: paginationDataLD.currentPage,
    size: paginationDataLD.pageSize,
    includeTax: includeTax.value,
    crossStepBalance: crossStepBalance.value,
    ...ldSearchData.value,
    sort: sortLD.value
  }).then((data) => {
    paginationDataLD.total = data.total
    leaderboardData.value = data.list
  }).catch((e) => {
    console.error(e)
    leaderboardData.value = []
  }).finally(() => {
    loadingLD.value = false
  })
}, 300)

function handleSearchLD() {
  paginationDataLD.currentPage === 1 ? getLeaderboardData() : (paginationDataLD.currentPage = 1)
}

const sortLD: Ref<Sort | undefined> = ref()
function handleSortLD(sort: Sort) {
  sortLD.value = sort
  getLeaderboardData()
}

// 监听分页参数的变化
watch([
  () => paginationDataLD.currentPage,
  () => paginationDataLD.pageSize,
  () => includeTax.value,
  () => crossStepBalance.value,
  () => useGameStore().marketData,
  () => usePlayerStore().config,
  () => useGameStore().buyStatus,
  () => useGameStore().sellStatus
], getLeaderboardData, { immediate: true })

const { paginationData: paginationDataMN, handleCurrentChange: handleCurrentChangeFR, handleSizeChange: handleSizeChangeFR } = usePagination({}, "dashboard-favorite-pagination")
const favoriteData = ref<Calculator[]>([])
const frSearchFormRef = ref<FormInstance | null>(null)
const frSearchData = useMemory("dashboard-favorite-search-data", {
  name: "",
  project: "",
  minVolume1h: undefined,
  maxVolume1h: undefined,
  banCharm: false
})

const loadingFR = ref(false)
function getFavoriteData() {
  loadingFR.value = true
  getFavoriteDataApi({
    currentPage: paginationDataMN.currentPage,
    size: paginationDataMN.pageSize,
    includeTax: includeTax.value,
    crossStepBalance: crossStepBalance.value,
    ...frSearchData.value
  }).then((data) => {
    paginationDataMN.total = data.total
    favoriteData.value = data.list
  }).catch(() => {
    favoriteData.value = []
  }).finally(() => {
    loadingFR.value = false
  })
}

function handleSearchMN() {
  paginationDataMN.currentPage === 1 ? getFavoriteData() : (paginationDataMN.currentPage = 1)
}

function handleIncludeTaxChange() {
  handleSearchLD()
  handleSearchMN()
}
// 监听分页参数的变化
watch([
  () => paginationDataMN.currentPage,
  () => paginationDataMN.pageSize,
  () => includeTax.value,
  () => crossStepBalance.value,
  () => useGameStore().marketData,
  () => usePlayerStore().config,
  () => useGameStore().buyStatus,
  () => useGameStore().sellStatus
], getFavoriteData, { immediate: true })

// #endregion

// #region deepWatch
watch(() => favoriteStore.list, () => {
  getLeaderboardData()
  getFavoriteData()
}, { deep: true })

watch(() => usePriceStore(), () => {
  getLeaderboardData()
  getFavoriteData()
}, { deep: true })
// #endregion

const currentRow = ref<Calculator>()
const detailVisible = ref<boolean>(false)
async function showDetail(row: Calculator) {
  currentRow.value = cloneDeep(row)
  detailVisible.value = true
}
function addFavorite(row: Calculator) {
  const r = row || currentRow.value!
  try {
    addFavoriteApi(r)
    detailVisible.value = false
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}

function deleteFavorite(row: Calculator) {
  try {
    deleteFavoriteApi(row)
  } catch (e: any) {
    ElMessage.error(e.message)
  }
}
const priceVisible = ref<boolean>(false)
const currentPriceRow = ref<Calculator>()
function setPrice(row: Calculator) {
  const activated = usePriceStore().activated
  if (!activated) {
    ElMessageBox.confirm(t("是否确定开启自定义价格？"), t("需先开启自定义价格"), {
      confirmButtonText: t("确定"),
      cancelButtonText: t("取消"),
      closeOnClickModal: true
    }).then(() => {
      usePriceStore().setActivated(true)
    })
    return
  }
  currentPriceRow.value = cloneDeep(row)
  priceVisible.value = true
}

const { t } = useI18n()

// 逐级制作 / 起始材质
const showTierFilter = computed(() => supportsTierFilter(ldSearchData.value.project))
const tierChains = computed(() => TIER_CHAINS[normalizeProject(ldSearchData.value.project)] || [])
const currentChain = computed(() => {
  const chains = tierChains.value
  if (chains.length === 0) return null
  const found = chains.find(c => c.key === ldSearchData.value.tierChainKey)
  return found || chains[0]
})
const tierOptions = computed(() => currentChain.value?.tiers || [])

function handleProjectChange() {
  ldSearchData.value.tierChainKey = ""
  ldSearchData.value.startTierLevel = ""
  ldSearchData.value.endTierLevel = ""
  handleSearchLD()
}
function handleTierChainChange() {
  ldSearchData.value.startTierLevel = ""
  ldSearchData.value.endTierLevel = ""
  handleSearchLD()
}

function formatVolume1h(row: any) {
  const hrid = row?.hrid
  const level = row?.calculator?.enhanceLevel ?? row?.enhanceLevel ?? 0
  const vol = getPriceOf(hrid, level).vol ?? -1
  return vol < 0 ? "-" : Format.number(vol)
}

const onPriceStatusChange = usePriceStatus("dashboard-price-status")
// 离开页面时重置
</script>

<template>
  <div class="app-container">
    <div class="game-info">
      <GameInfo />
      <div>
        <ActionConfig @compare="handleCompare" />
      </div>

      <PriceStatusSelect
        @change="onPriceStatusChange"
      />

      <el-checkbox v-model="includeTax" @change="handleIncludeTaxChange">
        {{ t('计算税率') }}
      </el-checkbox>

      <el-tooltip placement="top" effect="light">
        <template #content>
          {{ t('#多步产量修正提示') }}
        </template>
        <el-checkbox v-model="crossStepBalance" @change="handleIncludeTaxChange">
          {{ t('多步产量修正') }}
        </el-checkbox>
      </el-tooltip>
    </div>
    <el-row :gutter="20" class="row">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="16">
        <el-card>
          <template #header>
            <el-form class="rank-card" ref="ldSearchFormRef" :inline="true" :model="ldSearchData">
              <div class="title">
                {{ t('利润排行') }}
              </div>
              <el-form-item prop="name" :label="t('物品')">
                <el-input style="width:100px" v-model="ldSearchData.name" :placeholder="t('请输入')" clearable @input="handleSearchLD" />
              </el-form-item>
              <el-form-item prop="phone" :label="t('动作')">
                <el-select v-model="ldSearchData.project" :placeholder="t('请选择')" style="width:100px" clearable @change="handleProjectChange">
                  <el-option :label="t('挤奶')" :value="'挤奶'" />
                  <el-option :label="t('采摘')" :value="'采摘'" />
                  <el-option :label="t('伐木')" :value="'伐木'" />
                  <el-option :label="t('锻造')" :value="'锻造'" />
                  <el-option :label="t('制造')" :value="'制造'" />
                  <el-option :label="t('裁缝')" :value="'裁缝'" />
                  <el-option :label="t('烹饪')" :value="'烹饪'" />
                  <el-option :label="t('冲泡')" :value="'冲泡'" />
                  <el-option :label="t('点金')" :value="'点金'" />
                  <el-option :label="t('分解')" :value="'分解'" />
                  <el-option :label="t('转化')" :value="'转化'" />
                </el-select>
              </el-form-item>

              <!-- 逐级制作 / 起始材质（仅锻造/制造/裁缝） -->
              <template v-if="showTierFilter">
                <el-form-item v-if="tierChains.length > 1" :label="t('材质链')">
                  <el-radio-group v-model="ldSearchData.tierChainKey" size="small" @change="handleTierChainChange">
                    <el-radio-button v-for="c in tierChains" :key="c.key" :label="c.key" class="tier-chain-btn">{{ t(c.label) }}</el-radio-button>
                  </el-radio-group>
                </el-form-item>

                <el-form-item :label="t('起始材质')">
                  <el-select v-model="ldSearchData.startTierLevel" :placeholder="t('不限')" style="width:90px" clearable @change="handleSearchLD">
                    <el-option v-for="tier in tierOptions" :key="tier.itemLevel" :label="t(tier.label)" :value="tier.itemLevel" />
                  </el-select>
                </el-form-item>

                <el-form-item :label="t('制作到')">
                  <el-select v-model="ldSearchData.endTierLevel" :placeholder="t('不限')" style="width:90px" clearable @change="handleSearchLD">
                    <el-option v-for="tier in tierOptions" :key="tier.itemLevel" :label="t(tier.label)" :value="tier.itemLevel" />
                  </el-select>
                </el-form-item>
              </template>

              <el-form-item prop="name" :label="`${t('利润率')} >`">
                <el-input style="width:60px" v-model="ldSearchData.profitRate" :placeholder="t('请输入')" clearable @input="handleSearchLD" />&nbsp;%
              </el-form-item>
              <!-- 要求等级 >= -->
              <el-form-item :label="`${t('要求等级')} ≥`">
                <el-input-number
                  v-model="ldSearchData.actionLevel"
                  :min="0"
                  :max="200"
                  :controls="false"
                  @change="handleSearchLD"
                  style="width: 60px;"
                />
              </el-form-item>

              <el-form-item :label="`${t('物品等级')} ≤`">
                <el-input-number
                  v-model="ldSearchData.maxItemLevel"
                  :controls="false"
                  @change="handleSearchLD"
                  style="width: 80px;"
                />
              </el-form-item>

              <el-form-item :label="`${t('成交量(1h)')} ≥`">
                <el-input-number
                  v-model="ldSearchData.minVolume1h"
                  :min="0"
                  :controls="false"
                  @change="handleSearchLD"
                  style="width: 90px;"
                />
              </el-form-item>

              <el-form-item :label="`${t('成交量(1h)')} ≤`">
                <el-input-number
                  v-model="ldSearchData.maxVolume1h"
                  :min="0"
                  :controls="false"
                  @change="handleSearchLD"
                  style="width: 90px;"
                />
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="ldSearchData.banEquipment" @change="handleSearchLD">
                  {{ t('排除装备') }}
                </el-checkbox>
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="ldSearchData.banCharm" @change="handleSearchLD">
                  {{ t('排除护符') }}
                </el-checkbox>
              </el-form-item>
            </el-form>
          </template>
          <template #default>
            <!-- 预设对比栏 -->
          <div v-if="isComparing" style="display:flex;align-items:center;gap:12px;margin-bottom:12px;padding:10px 16px;background:var(--el-fill-color-light);border-radius:6px">
            <el-tag type="success" size="large">{{ compareNameA }}</el-tag>
            <span style="font-size:16px;font-weight:bold;color:var(--el-text-color-secondary)">vs</span>
            <el-tag type="primary" size="large">{{ compareNameB }}</el-tag>
            <el-button type="danger" size="small" plain @click="exitCompare" style="margin-left:auto">{{ t('退出对比') }}</el-button>
          </div>
            <el-table :data="displayLeaderboardData" v-loading="loadingLD" @sort-change="handleSortLD">
              <el-table-column width="54" fixed="left">
                <template #default="{ row }">
                  <ItemIcon :hrid="row.hrid" />
                </template>
              </el-table-column>
              <el-table-column prop="result.name" :label="t('物品')" />
              <el-table-column width="54">
                <template #default="{ row }">
                  <ItemIcon v-if="row.catalyst" :hrid="`/items/${row.catalyst}`" />
                </template>
              </el-table-column>
              <el-table-column prop="project" :label="t('动作')" />
              <el-table-column prop="actionLevel" :label="t('要求等级')" align="center">
                <template #default="{ row }">
                  <div :class="row.actionLevel > getActionConfigOf(row.action).playerLevel ? 'red' : ''">
                    {{ row.actionLevel }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="t('利润 / 天')" align="center" min-width="120">
                <template #default="{ row }">
                  <span :class="row.hasManualPrice ? 'manual' : ''">
                    {{ row.result.profitPDFormat }}&nbsp;
                  </span>
                  <template v-if="isComparing && row._dataB">
                    / <span style="color:#409eff">{{ row._dataB.result.profitPDFormat }}</span>
                  </template>
                  <el-link type="primary" :icon="Edit" @click="setPrice(row)">
                    {{ t('自定义') }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column :label="t('利润 / h')" align="center" min-width="120"><template #default="{ row }"><span v-if="isComparing && row._dataB">{{ row.result.profitPHFormat }} / <span style="color:#409eff">{{ row._dataB.result.profitPHFormat }}</span></span><span v-else>{{ row.result.profitPHFormat }}</span></template>
              </el-table-column>
              <el-table-column prop="result.profitRate" :label="t('利润率')" min-width="120" align="center" sortable="custom" :sort-orders="['descending', null]">
                <template #default="{ row }">
                  <span v-if="isComparing && row._dataB" :style="{color: row.result.profitRate > row._dataB.result.profitRate ? '#16ab1b' : '#f56c6c'}">{{ row.result.profitRateFormat }}</span>
                  <span v-else>{{ row.result.profitRateFormat }}</span>
                  <template v-if="isComparing && row._dataB">
                    / <span style="color:#409eff">{{ row._dataB.result.profitRateFormat }}</span>
                  </template>
                </template>
              </el-table-column>

              <el-table-column align="center" min-width="120">
                <template #header>
                  <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
                    <div>{{ t('利润 / 次') }}</div>
                    <el-tooltip placement="top" effect="light">
                      <template #content>
                        {{ t('单次动作产生的利润。') }}
                        <br>
                        {{ t('#多步动作利润提示') }}
                        <br>
                        {{ t('#多步动作利润举例') }}
                      </template>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #default="{ row }">
                  <span :class="row.hasManualPrice ? 'manual' : ''">
                    {{ row.result.profitPPFormat }}&nbsp;
                  </span>
                </template>
              </el-table-column>
              <el-table-column min-width="120" :label="t('经验 / h')" align="center">
                <template #default="{ row }">
                  <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
                    <div>
                      <span v-if="isComparing && row._dataB">{{ row.result.expPHFormat }} / <span style="color:#409eff">{{ row._dataB.result.expPHFormat }}</span></span>
                      <span v-else>{{ row.result.expPHFormat }}</span>
                    </div>
                    <el-tooltip v-if="row.expList?.length > 1" placement="top" effect="light">
                      <template #content>
                        <div v-for="(item, i) in row.expList" :key="i" style="display: flex; gap:10px">
                          <div>{{ t(item.action) }}</div>
                          <div>{{ item.expPHFormat }}</div>
                        </div>
                      </template>
                      <el-icon><Warning /></el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="t('成交量(1h)')" align="center" min-width="120">
                <template #default="{ row }">
                  <span v-if="isComparing && row._dataB">{{ formatVolume1h(row) }} / <span style="color:#409eff">{{ formatVolume1h(row._dataB) }}</span></span>
                  <span v-else>{{ formatVolume1h(row) }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="t('详情')" align="center">
                <template #default="{ row }">
                  <el-link type="primary" :icon="Search" @click="showDetail(row)">
                    {{ t('查看') }}
                  </el-link>
                </template>
              </el-table-column>

              <el-table-column prop="favorite" :label="t('收藏')" align="center" sortable="custom" :sort-orders="['descending', null]">
                <template #default="{ row }">
                  <el-link v-if="!favoriteStore.hasFavorite(row)" :underline="false" type="warning" :icon="Star" @click="addFavorite(row)" style="font-size:24px" />
                  <el-link v-else :underline="false" :icon="StarFilled" type="warning" @click="deleteFavorite(row)" style="font-size:28px" />
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template #footer>
            <div class="pager-wrapper">
              <el-pagination
                background
                :layout="paginationDataLD.layout"
                :page-sizes="paginationDataLD.pageSizes"
                :total="paginationDataLD.total"
                :page-size="paginationDataLD.pageSize"
                :current-page="paginationDataLD.currentPage"
                @size-change="handleSizeChangeLD"
                @current-change="handleCurrentChangeLD"
              />
            </div>
          </template>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
        <ManualPriceCard memory-key="dashboard" />
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="16">
        <el-card>
          <template #header>
            <el-form class="rank-card" ref="frSearchFormRef" :inline="true" :model="frSearchData">
              <div class="title">
                {{ t('收藏夹') }}
              </div>
              <el-form-item prop="name" :label="t('物品')">
                <el-input style="width:100px" v-model="frSearchData.name" :placeholder="t('请输入')" clearable @input="handleSearchMN" />
              </el-form-item>
              <el-form-item prop="phone" :label="t('动作')">
                <el-select v-model="frSearchData.project" :placeholder="t('请选择')" style="width:100px" clearable @change="handleSearchMN">
                  <el-option :label="t('挤奶')" :value="'挤奶'" />
                  <el-option :label="t('采摘')" :value="'采摘'" />
                  <el-option :label="t('伐木')" :value="'伐木'" />
                  <el-option :label="t('锻造')" :value="'锻造'" />
                  <el-option :label="t('制造')" :value="'制造'" />
                  <el-option :label="t('裁缝')" :value="'裁缝'" />
                  <el-option :label="t('烹饪')" :value="'烹饪'" />
                  <el-option :label="t('冲泡')" :value="'冲泡'" />
                  <el-option :label="t('点金')" :value="'点金'" />
                  <el-option :label="t('分解')" :value="'分解'" />
                  <el-option :label="t('转化')" :value="'转化'" />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="frSearchData.banCharm" @change="handleSearchMN">
                  {{ t('排除护符') }}
                </el-checkbox>
              </el-form-item>

              <el-form-item :label="`${t('成交量(1h)')} ≥`">
                <el-input-number
                  v-model="frSearchData.minVolume1h"
                  :min="0"
                  :controls="false"
                  @change="handleSearchMN"
                  style="width: 90px;"
                />
              </el-form-item>

              <el-form-item :label="`${t('成交量(1h)')} ≤`">
                <el-input-number
                  v-model="frSearchData.maxVolume1h"
                  :min="0"
                  :controls="false"
                  @change="handleSearchMN"
                  style="width: 90px;"
                />
              </el-form-item>
            </el-form>
          </template>
          <template #default>
            <el-table :data="favoriteData" v-loading="loadingFR">
              <el-table-column width="54" fixed="left">
                <template #default="{ row }">
                  <ItemIcon :hrid="row.hrid" />
                </template>
              </el-table-column>
              <el-table-column prop="result.name" :label="t('物品')" />
              <el-table-column width="54">
                <template #default="{ row }">
                  <ItemIcon v-if="row.catalyst" :hrid="`/items/${row.catalyst}`" />
                </template>
              </el-table-column>
              <el-table-column prop="project" :label="t('动作')" />
              <el-table-column :label="t('利润 / 天')">
                <template #default="{ row }">
                  <span :class="row.hasManualPrice ? 'manual' : ''">
                    {{ row.result.profitPDFormat }}&nbsp;
                  </span>
                  <el-link v-if="usePriceStore().activated" type="primary" :icon="Edit" @click="setPrice(row)">
                    {{ t('自定义') }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="result.profitPHFormat" :label="t('利润 / h')" align="center" min-width="120" />
              <el-table-column prop="result.expPHFormat" :label="t('经验 / h')" align="center" min-width="120" />
              <el-table-column prop="result.profitRateFormat" :label="t('利润率')" align="center" min-width="120" />
              <el-table-column align="center" min-width="120">
                <template #header>
                  <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
                    <div>{{ t('利润 / 次') }}</div>
                    <el-tooltip placement="top" effect="light">
                      <template #content>
                        {{ t('单次动作产生的利润。') }}
                        <br>
                        {{ t('#多步动作利润提示') }}
                        <br>
                        {{ t('#多步动作利润举例') }}
                      </template>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #default="{ row }">
                  <span :class="row.hasManualPrice ? 'manual' : ''">
                    {{ row.result.profitPPFormat }}&nbsp;
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="t('成交量(1h)')" align="center" min-width="120">
                <template #default="{ row }">
                  {{ formatVolume1h(row) }}
                </template>
              </el-table-column>
              <el-table-column :label="t('详情')">
                <template #default="{ row }">
                  <el-link type="primary" :icon="Search" @click="showDetail(row)">
                    {{ t('查看') }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column :label="t('操作')">
                <template #default="{ row }">
                  <el-link type="danger" :icon=" Delete" @click="deleteFavorite(row)">
                    {{ t('删除') }}
                  </el-link>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template #footer>
            <div class="pager-wrapper">
              <el-pagination
                background
                :layout="paginationDataMN.layout"
                :page-sizes="paginationDataMN.pageSizes"
                :total="paginationDataMN.total"
                :page-size="paginationDataMN.pageSize"
                :current-page="paginationDataMN.currentPage"
                @size-change="handleSizeChangeFR"
                @current-change="handleCurrentChangeFR"
              />
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
    <ActionDetail v-model="detailVisible" :data="currentRow" />

    <ActionPrice v-model="priceVisible" :data="currentPriceRow" />
  </div>
</template>

<style lang="scss" scoped>
.rank-card {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  .title {
    width: 160px;
    margin-bottom: 12px;
  }
}
.pager-wrapper {
  display: flex;
  justify-content: center;
}

.row {
  .el-col {
    margin-bottom: 20px;
  }
}
// 蓝色
.manual {
  color: #409eff;
}

.red {
  color: #f56c6c;
}
.green {
  color: #67c23a;
}
.tier-chain-btn :deep(.el-radio-button__inner) {
  width: 56px;
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
</style>
