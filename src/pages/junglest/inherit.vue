<script lang="ts" setup>
import type Calculator from "@/calculator"
import ItemIcon from "@@/components/ItemIcon/index.vue"
import { usePagination } from "@@/composables/usePagination"
import { Close, Edit, Plus, Search, Setting } from "@element-plus/icons-vue"
import { ClickOutside as vClickOutside, ElMessageBox, type FormInstance, type Sort } from "element-plus"
import { cloneDeep, debounce } from "lodash-es"

import { getDataApi } from "@/common/apis/jungle/junglerit"
import { useMemory } from "@/common/composables/useMemory"
import { usePriceStatus } from "@/common/composables/usePriceStatus"
import * as Format from "@/common/utils/format"
import { useGameStore } from "@/pinia/stores/game"
import { usePlayerStore } from "@/pinia/stores/player"
import { usePriceStore } from "@/pinia/stores/price"
import ActionConfig from "../dashboard/components/ActionConfig.vue"
import ActionDetail from "../dashboard/components/ActionDetail.vue"
import ActionPrice from "../dashboard/components/ActionPrice.vue"
import GameInfo from "../dashboard/components/GameInfo.vue"
import ManualPriceCard from "../dashboard/components/ManualPriceCard.vue"
import PriceStatusSelect from "../dashboard/components/PriceStatusSelect.vue"

// #region
const { paginationData: paginationDataLD, handleCurrentChange: handleCurrentChangeLD, handleSizeChange: handleSizeChangeLD } = usePagination({}, "junglerit-leaderboard-pagination")
const leaderboardData = ref<Calculator[]>([])
const ldSearchFormRef = ref<FormInstance | null>(null)

const ldSearchData = useMemory("junglerit-leaderboard-search-data", {
  name: "",
  project: "",
  profitRate: "",
  maxLevel: 20,
  minLevel: 1,
  banEquipment: false,
  exactLevelValues: [5, 7, 10, 12, 15],
  exactLevelActive: [false, false, false, false, false]
})

const loadingLD = ref(false)
const getLeaderboardData = debounce(() => {
  loadingLD.value = true
  getDataApi({
    currentPage: paginationDataLD.currentPage,
    size: paginationDataLD.pageSize,
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

function handleEnhanceLevelChange(source: "min" | "max") {
  const d = ldSearchData.value
  const min = d.minLevel
  const max = d.maxLevel
  if (min != null && max != null && min > max) {
    if (source === "min") {
      d.maxLevel = min
    } else {
      d.minLevel = max
    }
  }
  handleSearchLD()
}

const exactEditMode = ref(false)

if (
  !Array.isArray(ldSearchData.value.exactLevelValues)
  || ldSearchData.value.exactLevelValues.length < 2
  || ldSearchData.value.exactLevelValues.every((v: any) => v === null || v === undefined)
) {
  ldSearchData.value.exactLevelValues = [5, 7, 10, 12, 15]
  ldSearchData.value.exactLevelActive = [false, false, false, false, false]
}

function toggleExactEdit() {
  exactEditMode.value = !exactEditMode.value
}

function exitExactEdit() {
  if (exactEditMode.value) {
    exactEditMode.value = false
    const d = ldSearchData.value
    const pairs = d.exactLevelValues.map((v: any, i: number) => ({ v, a: d.exactLevelActive[i] }))
    pairs.sort((x: any, y: any) => (Number(x.v) || 0) - (Number(y.v) || 0))
    d.exactLevelValues = pairs.map((p: any) => p.v)
    d.exactLevelActive = pairs.map((p: any) => p.a)
    handleSearchLD()
  }
}

function toggleExactLevel(idx: number) {
  if (exactEditMode.value) return
  const d = ldSearchData.value
  const v = d.exactLevelValues[idx]
  if (v === null || v === undefined || v === ("" as any)) return
  d.exactLevelActive[idx] = !d.exactLevelActive[idx]
  handleSearchLD()
}

function addExactLevel() {
  ldSearchData.value.exactLevelValues.push(1)
  ldSearchData.value.exactLevelActive.push(false)
}

function removeExactLevel(idx: number) {
  ldSearchData.value.exactLevelValues.splice(idx, 1)
  ldSearchData.value.exactLevelActive.splice(idx, 1)
  handleSearchLD()
}

const sortLD: Ref<Sort | undefined> = ref()
function handleSortLD(sort: Sort) {
  sortLD.value = sort
  getLeaderboardData()
}
function handleChangeEscape() {
  paginationDataLD.currentPage = 1
  useGameStore().clearJungleCache("junglerit")
  getLeaderboardData()
}

// 监听分页参数的变化
watch([
  () => paginationDataLD.currentPage,
  () => paginationDataLD.pageSize,
  () => useGameStore().marketData,
  () => usePlayerStore().config,
  () => useGameStore().buyStatus,
  () => useGameStore().sellStatus
], getLeaderboardData, { immediate: true })

// #endregion

// #region deepWatch

watch(() => usePriceStore(), () => {
  getLeaderboardData()
}, { deep: true })
// #endregion

const currentRow = ref<Calculator>()
const detailVisible = ref<boolean>(false)
async function showDetail(row: Calculator) {
  currentRow.value = cloneDeep(row)
  detailVisible.value = true
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

const onPriceStatusChange = usePriceStatus("junglerit-price-status")
</script>

<template>
  <div class="app-container">
    <div class="game-info">
      <GameInfo />

      <div>
        <ActionConfig :actions="['enhancing']" :equipments="['hands', 'neck', 'earrings', 'ring', 'pouch']" />
      </div>

      <PriceStatusSelect @change="onPriceStatusChange" />
      <div>
        {{ t('打野爽！') }}
      </div>
    </div>
    <el-row :gutter="20" class="row">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card>
          <template #header>
            <el-form class="rank-card" ref="ldSearchFormRef" :inline="true" :model="ldSearchData">
              <div class="title">
                {{ t('利润排行') }}
              </div>
              <el-form-item prop="name" :label="t('物品')">
                <el-input style="width:100px" v-model="ldSearchData.name" :placeholder="t('请输入')" clearable @input="handleSearchLD" />
              </el-form-item>

              <el-form-item :label="t('目标等级从')">
                <el-input-number style="width:80px" :min="1" :max="ldSearchData.maxLevel || 20" v-model="ldSearchData.minLevel" placeholder="1" clearable @change="handleEnhanceLevelChange('min')" controls-position="right" />&nbsp;{{ t('到') }}&nbsp;
                <el-input-number style="width:80px" :min="ldSearchData.minLevel || 1" :max="20" v-model="ldSearchData.maxLevel" placeholder="20" clearable @change="handleEnhanceLevelChange('max')" controls-position="right" />
              </el-form-item>

              <el-form-item :label="t('精确等级')">
                <span class="exact-level-box" v-click-outside="exitExactEdit">
                  <template v-if="!exactEditMode">
                    <el-button
                      v-for="(v, idx) in ldSearchData.exactLevelValues"
                      :key="idx"
                      size="small"
                      class="exact-level-btn"
                      :class="{ 'is-active': ldSearchData.exactLevelActive[idx] }"
                      @click="toggleExactLevel(idx)"
                    >{{ v }}</el-button>
                  </template>
                  <template v-else>
                    <span
                      v-for="(v, idx) in ldSearchData.exactLevelValues"
                      :key="idx"
                      class="exact-level-edit-wrap"
                    >
                      <el-input-number
                        class="exact-level-edit"
                        style="width:52px;"
                        :min="1" :max="20"
                        v-model="ldSearchData.exactLevelValues[idx]"
                        :controls="false"
                      />
                      <span class="exact-del-badge" @click="removeExactLevel(idx)">
                        <el-icon><Close /></el-icon>
                      </span>
                    </span>
                    <el-button size="small" :icon="Plus" plain class="exact-add-btn" @click="addExactLevel" />
                  </template>
                  <el-icon class="exact-gear" @click="toggleExactEdit"><Setting /></el-icon>
                </span>
              </el-form-item>

              <el-form-item :label="`${t('风险')} ≤`">
                <el-input-number style="width:80px" v-model="ldSearchData.maxRisk" clearable @change="handleSearchLD" :controls="false" />
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="ldSearchData.noEscape" @change="handleChangeEscape">
                  {{ t('不逃逸') }}
                </el-checkbox>
              </el-form-item>
            </el-form>
          </template>
          <template #default>
            <el-table :data="leaderboardData" v-loading="loadingLD" @sort-change="handleSortLD">
              <el-table-column width="54">
                <template #default="{ row }">
                  <ItemIcon :hrid="row.hrid" />
                </template>
              </el-table-column>
              <el-table-column prop="result.name" :label="t('物品')">
                <template #default="{ row }">
                  {{ row.result.name }}
                  {{ row.originLevel ? `+${row.originLevel}` : '' }}
                </template>
              </el-table-column>
              <el-table-column min-width="70">
                <template #default="{ row }">
                  <div style="display:flex;">
                    <ItemIcon v-if="row.calculator.protectLevel < row.calculator.enhanceLevel" :hrid="row.calculator.protectionItem.hrid" />
                  </div>
                  <div v-if="row.calculator.protectLevel < row.calculator.enhanceLevel">
                    {{ t('从{0}保护', [row.calculator.protectLevel]) }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="project" :label="t('动作')" />
              <el-table-column prop="calculator.realEscapeLevel" :label="t('逃逸等级')" min-width="50" />
              <!-- <el-table-column :label="t('利润 / 天')" align="center" min-width="120">
                <template #default="{ row }">
                  <span :class="row.hasManualPrice ? 'manual' : ''">
                    {{ row.result.profitPDFormat }}&nbsp;
                  </span>
                  <el-link type="primary" :icon="Edit" @click="setPrice(row)">
                    {{ t('自定义') }}
                  </el-link>
                </template>
              </el-table-column> -->

              <el-table-column prop="result.profitPHFormat" :label="t('利润 / h')" align="center" min-width="120">
                <template #default="{ row }">
                  <span :class="row.hasManualPrice ? 'manual' : ''">
                    {{ row.result.profitPHFormat }}&nbsp;
                  </span>
                  <el-link type="primary" :icon="Edit" @click="setPrice(row)">
                    {{ t('自定义') }}
                  </el-link>
                </template>
              </el-table-column>

              <el-table-column align="center" min-width="120">
                <template #header>
                  <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
                    <div>{{ t('损耗 / h') }}</div>
                    <el-tooltip placement="top" effect="light">
                      <template #content>
                        {{ t('材料损耗+逃逸损耗') }}
                      </template>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #default="{ row }">
                  <span>
                    {{ row.result.cost4EnhancePHFormat }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column align="center" min-width="120">
                <template #header>
                  <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
                    <div>{{ t('风险系数') }}</div>
                    <el-tooltip placement="top" effect="light">
                      <template #content>
                        {{ t('损耗 / 利润') }}
                      </template>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>

                <template #default="{ row }">
                  <!-- 7以上是红色，5以下是绿色 -->
                  <span
                    :class="{
                      error: row.result.risk > 7,
                      success: row.result.risk < 5,
                    }"
                  >
                    {{ row.result.profitPH > 0 ? row.result.riskFormat : '' }}
                  </span>
                </template>
              </el-table-column>

              <el-table-column align="center" min-width="120">
                <template #header>
                  <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
                    <div>{{ t('利润 / 件') }}</div>
                    <el-tooltip placement="top" effect="light">
                      <template #content>
                        {{ t('每件初始装备产生的利润。') }}
                      </template>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <template #default="{ row }">
                  <span :class="row.hasManualPrice ? 'manual' : ''">
                    {{ Format.money(row.result.profitPH / row.ingredientListWithPrice[0].countPH) }}&nbsp;
                  </span>
                </template>
              </el-table-column>

              <el-table-column prop="result.profitRate" :label="t('利润率')" align="center" sortable="custom" :sort-orders="['descending', null]">
                <template #default="{ row }">
                  {{ row.result.profitRateFormat }}
                </template>
              </el-table-column>

              <el-table-column :label="t('售价')" align="center">
                <template #default="{ row }">
                  <span>
                    {{ Format.price(row.calculator.productListWithPrice[0].price) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column min-width="120" :label="t('经验 / h')" align="center">
                <template #default="{ row }">
                  <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
                    <div>{{ row.result.expPHFormat }}</div>
                    <el-tooltip v-if="row.expList?.length > 1" placement="top" effect="light">
                      <template #content>
                        <div v-for="(item, i) in row.expList" :key="i" style="display: flex; gap:10px">
                          <div>
                            {{ t(item.action) }}
                          </div>
                          <div>
                            {{ item.expPHFormat }}
                          </div>
                        </div>
                      </template>
                      <el-icon>
                        <Warning />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="t('详情')" align="center">
                <template #default="{ row }">
                  <el-link type="primary" :icon="Search" @click="showDetail(row)">
                    {{ t('查看') }}
                  </el-link>
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

      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <ManualPriceCard memory-key="junglerit" />
      </el-col>
    </el-row>
    <ActionDetail v-model="detailVisible" :data="currentRow" />

    <ActionPrice v-model="priceVisible" :data="currentPriceRow" />
  </div>
</template>

<style lang="scss" scoped>
.error {
  color: #f56c6c;
}
.success {
  color: #67c23a;
}
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
.exact-level-box {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  background-color: var(--el-fill-color-blank);
}
.exact-level-btn {
  min-width: 36px;
  margin-left: 4px !important;
  padding-left: 6px;
  padding-right: 6px;
}
.exact-level-btn.is-active {
  background-color: #409eff;
  border-color: #409eff;
  color: #fff;
}
.exact-level-btn.is-active:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
.exact-level-edit-wrap {
  position: relative;
  display: inline-flex;
  margin-right: 8px;
}
.exact-del-badge {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #f56c6c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
}
.exact-del-badge .el-icon {
  font-size: 11px;
}
.exact-del-badge:hover {
  background-color: #f78989;
}
.exact-add-btn {
  margin-left: 2px !important;
}
.exact-gear {
  cursor: pointer;
  margin-left: 8px;
  color: #909399;
}
.exact-gear:hover {
  color: #409eff;
}
</style>
