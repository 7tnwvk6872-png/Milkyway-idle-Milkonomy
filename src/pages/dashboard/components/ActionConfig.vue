<script setup lang="ts">
import type { AchievementBuffItem, ActionConfig, ActionConfigItem, CommunityBuffItem, PlayerEquipmentItem } from "@/pinia/stores/player"
import type { AchievementTier, Action, CommunityBuff, Equipment, ItemDetail } from "~/game"
import ItemIcon from "@@/components/ItemIcon/index.vue"
import { Plus } from "@element-plus/icons-vue"
import { ElMessageBox } from "element-plus"
import { getAchievementTierDetailOf, getCommunityBuffDetailOf, getPersonalBuffDetailOf } from "@/common/apis/game"
import { getEquipmentListOf, getSealList, getSpecialEquipmentListOf, getTeaListOf, getToolListOf, setActionConfigApi } from "@/common/apis/player"
import { useTheme } from "@/common/composables/useTheme"
import { DEFAULT_ACHIEVEMENT_BUFF_LIST, DEFAULT_COMMUNITY_BUFF_LIST, DEFAULT_SEPCIAL_EQUIPMENT_LIST } from "@/common/config"
import { getTrans } from "@/locales"
import { ACHIEVEMENT_TIER_LIST, ACTION_LIST } from "@/pinia/stores/game"
import { defaultActionConfig, usePlayerStore } from "@/pinia/stores/player"

const emit = defineEmits<{
  toggleCompare: []
}>()
defineProps<{
  actions?: Action[]
  equipments?: Equipment[]
  communityBuffs?: CommunityBuff[]
  achievementBuffs?: AchievementTier[]
}>()

// 背部（披风/斗篷）可选项白名单：按技能限制可装备范围
const BACK_EQUIPMENT_HRID_WHITELIST: Record<Action, string[]> = {
  milking: ["/items/gatherer_cape", "/items/gatherer_cape_refined"],
  foraging: ["/items/gatherer_cape", "/items/gatherer_cape_refined"],
  woodcutting: ["/items/gatherer_cape", "/items/gatherer_cape_refined"],

  cheesesmithing: ["/items/artificer_cape", "/items/artificer_cape_refined"],
  crafting: ["/items/artificer_cape", "/items/artificer_cape_refined"],
  tailoring: ["/items/artificer_cape", "/items/artificer_cape_refined"],

  brewing: ["/items/culinary_cape", "/items/culinary_cape_refined"],
  cooking: ["/items/culinary_cape", "/items/culinary_cape_refined"],

  enhancing: ["/items/chance_cape", "/items/chance_cape_refined"],
  alchemy: ["/items/chance_cape", "/items/chance_cape_refined"]
}

function getBackEquipmentListOf(action: Action) {
  const allowed = new Set(BACK_EQUIPMENT_HRID_WHITELIST[action] ?? [])
  return getEquipmentListOf(action, "back")
    .filter(item => allowed.has(item.hrid))
    .sort((a, b) => a.itemLevel - b.itemLevel)
}

const playerStore = usePlayerStore()
const visible = ref(false)
const actionList = ref<ActionConfigItem[]>([])
const specialList = ref<PlayerEquipmentItem[]>([])
const communityBuffList = ref<CommunityBuffItem[]>([])
const achievementBuffList = ref<AchievementBuffItem[]>([])
const sealList = ref<ReturnType<typeof getSealList>>([])
const seals = ref<string[]>([])
const name = ref("")
const color = ref("")
const currentIndex = ref(0)
function onDialog(config: ActionConfig, index: number) {
  const defaultConfig = defaultActionConfig("", "")
  actionList.value = structuredClone(ACTION_LIST.map((action) => {
    const map = config.actionConfigMap.get(action) ?? defaultConfig.actionConfigMap.get(action)!
    // 如果当前配置没有某些字段，则使用默认配置的字段值
    const defaultMap = defaultConfig.actionConfigMap.get(action)!
    for (const key in defaultMap) {
      const defaultValue = defaultMap[key as keyof ActionConfigItem]
      if (defaultValue !== undefined && map[key as keyof ActionConfigItem] === undefined) {
        map[key as keyof ActionConfigItem] = defaultValue as never
      }
    }
    return {
      ...toRaw(map)
    }
  }))

  specialList.value = structuredClone(DEFAULT_SEPCIAL_EQUIPMENT_LIST.map((item) => {
    return {
      ...toRaw(config.specialEquimentMap.get(item.type) ?? defaultConfig.specialEquimentMap.get(item.type)!)
    }
  }))

  communityBuffList.value = structuredClone(DEFAULT_COMMUNITY_BUFF_LIST.map((buff) => {
    return {
      ...toRaw(config.communityBuffMap.get(buff.type) ?? defaultConfig.communityBuffMap.get(buff.type)!)
    }
  }))

  achievementBuffList.value = structuredClone(DEFAULT_ACHIEVEMENT_BUFF_LIST.map((buff) => {
    return {
      ...toRaw(config.achievementBuffMap.get(buff.type) ?? defaultConfig.achievementBuffMap.get(buff.type)!)
    }
  }))

  sealList.value = getSealList()
  seals.value = Array.isArray(config.seals)
    ? [...config.seals]
    : typeof (config as ActionConfig & { seal?: string }).seal === "string"
      ? [(config as ActionConfig & { seal?: string }).seal!]
      : []
  name.value = config.name!
  color.value = config.color!
  visible.value = true
  currentIndex.value = index
}

function onSelect(config: ActionConfig, index: number) {
  // 点击非当前预设：直接切换
  if (index === playerStore.presetIndex) {
    onDialog(config, index)
  } else {
    playerStore.switchTo(index)
  }
}

function onAdd() {
  const index = playerStore.presets.length
  onDialog(defaultActionConfig(t("{0}新预设", [index]), "#90ee90"), index)
}

function constructActionConfig() {
  const config = {
    actionConfigMap: new Map<Action, ActionConfigItem>(),
    specialEquimentMap: new Map<Equipment, PlayerEquipmentItem>(),
    communityBuffMap: new Map<CommunityBuff, CommunityBuffItem>(),
    achievementBuffMap: new Map<AchievementTier, AchievementBuffItem>(),
    seals: [...seals.value],
    name: name.value,
    color: color.value
  }

  for (const item of actionList.value) {
    config.actionConfigMap.set(item.action, toRaw(item))
  }

  for (const item of specialList.value) {
    config.specialEquimentMap.set(item.type, toRaw(item))
  }

  for (const item of communityBuffList.value) {
    config.communityBuffMap.set(item.type, toRaw(item))
  }

  for (const item of achievementBuffList.value) {
    config.achievementBuffMap.set(item.type, toRaw(item))
  }

  return config
}

// 标记：关闭弹窗时是否跳过“点外部自动保存”逻辑
const skipAutoSave = ref(false)

function doSave(): boolean {
  try {
    const config = constructActionConfig()
    setActionConfigApi(config, currentIndex.value)
    return true
  } catch (e: any) {
    ElMessage.error(e.message)
    return false
  }
}

function onConfirm() {
  if (doSave()) {
    skipAutoSave.value = true
    visible.value = false
  }
}

// 点击弹窗外部遮罩 / ESC 关闭时：自动保存
function onDialogClose() {
  if (skipAutoSave.value) {
    // 由保存/删除按钮触发的关闭，不重复保存
    skipAutoSave.value = false
    return
  }
  // 点外部关闭 = 保存
  doSave()
}

// 弹窗内删除当前预设
function onDeleteInDialog() {
  // 新增中的预设（尚未保存，不在列表里）直接关闭
  if (currentIndex.value >= playerStore.presets.length) {
    skipAutoSave.value = true
    visible.value = false
    return
  }
  if (playerStore.presets.length <= 1) {
    ElMessage.warning(t("至少保留一个预设"))
    return
  }
  ElMessageBox.confirm(t("确定删除该预设吗？"), "", {
    confirmButtonText: t("确定"),
    cancelButtonText: t("取消"),
    type: "warning"
  }).then(() => {
    playerStore.removePreset(currentIndex.value)
    skipAutoSave.value = true
    visible.value = false
  }).catch(() => {
    // 取消删除
  })
}

const menuVisible = ref(false)
const top = ref(0)
const left = ref(0)
const menuPreset = ref<ActionConfig>()
const menuIndex = ref(0)

function openMenu(preset: ActionConfig, index: number, e: MouseEvent) {
  const menuMinWidth = 100
  // 当前页面宽度
  const offsetWidth = document.body.offsetWidth
  // 面板的最大左边距
  const maxLeft = offsetWidth - menuMinWidth
  // 面板距离鼠标指针的距离
  const left15 = e.clientX + 10
  left.value = left15 > maxLeft ? maxLeft : left15
  top.value = e.clientY
  // 显示面板
  menuVisible.value = true
  menuIndex.value = index
  // 更新当前正在右键操作的标签页
  menuPreset.value = preset
}

/** 关闭右键菜单面板 */
function closeMenu() {
  menuVisible.value = false
}

watch(menuVisible, (value) => {
  value ? document.body.addEventListener("click", closeMenu) : document.body.removeEventListener("click", closeMenu)
})

function onCopy() {
  onDialog(menuPreset.value!, playerStore.presets.length)
}

function onRemove() {
  ElMessageBox.confirm(t("确定删除该预设吗？"), "", {
    confirmButtonText: t("确定"),
    cancelButtonText: t("取消"),
    type: "warning"
  }).then(() => {
    playerStore.removePreset(menuIndex.value)
  }).catch(() => {
    // 取消删除
  })
}

const { t } = useI18n()
const { activeThemeName } = useTheme()

// 弹窗手动复制导入
function onImport() {
  ElMessageBox.prompt(t("请粘贴导出的预设配置"), t("导入"), {
    confirmButtonText: t("确定"),
    cancelButtonText: t("取消"),
    inputPattern: /^\s*\{.*\}\s*$/,
    inputErrorMessage: t("请输入正确的JSON格式")
  }).then(({ value }) => {
    try {
      const obj = JSON.parse(value)
      if (!obj.name || !obj.color || !obj.actionConfigMap || !obj.specialEquimentMap) {
        throw new Error(t("无效的预设配置"))
      }
      const normalizeSeal = (input: unknown): string | undefined => {
        if (typeof input !== "string") {
          return undefined
        }
        const value = input.trim()
        if (!value) {
          return undefined
        }
        if (value.startsWith("/items/seal_of_")) {
          return value
        }
        const hit = getSealList().find(item =>
          item.hrid === value
          || item.hrid.split("/").pop() === value
          || item.name === value
          || getTrans(item.name) === value
        )
        return hit?.hrid
      }
      const normalizeSeals = (input: unknown): string[] => {
        const source = Array.isArray(input) ? input : typeof input === "string" ? [input] : []
        const result = source
          .map(normalizeSeal)
          .filter((item): item is string => Boolean(item))
        return [...new Set(result)]
      }
      const normalizeAchievementTier = (input: unknown): AchievementTier | undefined => {
        if (typeof input !== "string") {
          return undefined
        }
        const value = input.trim()
        if (!value) {
          return undefined
        }
        const key = value.startsWith("/achievement_tiers/")
          ? value.split("/").pop()
          : value
        if (key && (ACHIEVEMENT_TIER_LIST as readonly string[]).includes(key)) {
          return key as AchievementTier
        }
        for (const tier of ACHIEVEMENT_TIER_LIST) {
          const detail = getAchievementTierDetailOf(`/achievement_tiers/${tier}`)
          if (!detail) {
            continue
          }
          if (detail.name === value || getTrans(detail.name) === value) {
            return tier
          }
        }
        return undefined
      }
      const normalizeAchievementBuffMap = (input: unknown) => {
        const entries = Object.entries((input || {}) as Record<string, AchievementBuffItem>)
        const result = new Map<AchievementTier, AchievementBuffItem>()
        for (const [rawKey, rawValue] of entries) {
          const tier = normalizeAchievementTier(rawKey)
          if (!tier) {
            continue
          }
          result.set(tier, {
            type: tier,
            enabled: Boolean(rawValue?.enabled)
          })
        }
        return result
      }
      const config: ActionConfig = {
        name: obj.name,
        color: obj.color,
        seals: normalizeSeals(obj.seals || obj.seal),
        actionConfigMap: new Map<Action, ActionConfigItem>(Object.entries(obj.actionConfigMap) as [Action, ActionConfigItem][]),
        specialEquimentMap: new Map<Equipment, PlayerEquipmentItem>(Object.entries(obj.specialEquimentMap) as [Equipment, PlayerEquipmentItem][]),
        communityBuffMap: new Map<CommunityBuff, CommunityBuffItem>(Object.entries(obj.communityBuffMap) as [CommunityBuff, CommunityBuffItem][]),
        achievementBuffMap: normalizeAchievementBuffMap(obj.achievementBuffMap)
      }
      onDialog(config, playerStore.presets.length)
    } catch (e) {
      console.error(e)
      ElMessage.error(t("无效的预设配置"))
    }
  }).catch(() => {
    // 取消导入
  })
}

// 复制到剪贴板
function onExport() {
  const config = constructActionConfig()
  const json = JSON.stringify({
    name: config.name,
    color: config.color,
    seals: config.seals,
    actionConfigMap: Object.fromEntries(config.actionConfigMap.entries()),
    specialEquimentMap: Object.fromEntries(config.specialEquimentMap.entries()),
    communityBuffMap: Object.fromEntries(config.communityBuffMap.entries()),
    achievementBuffMap: Object.fromEntries(config.achievementBuffMap.entries())
  })
  navigator.clipboard.writeText(json).then(() => {
    ElMessage.success(t("已复制到剪贴板"))
  }).catch(() => {
    ElMessage.error(t("复制失败，请检查浏览器权限设置"))
  })
}

function isSealEnabled(hrid: string) {
  return seals.value.includes(hrid)
}

function onSealToggle(hrid: string, enabled: boolean) {
  const index = seals.value.indexOf(hrid)
  if (enabled && index === -1) {
    seals.value.push(hrid)
  }
  if (!enabled && index !== -1) {
    seals.value.splice(index, 1)
  }
}

const BUFF_TYPE_TEXT_MAP: Record<string, string> = {
  "/buff_types/action_speed": "行动速度",
  "/buff_types/efficiency": "效率",
  "/buff_types/gathering": "采集",
  "/buff_types/processing": "加工",
  "/buff_types/gourmet": "美食",
  "/buff_types/wisdom": "经验",
  "/buff_types/rare_find": "稀有发现",
  "/buff_types/enhancing_success": "强化成功率"
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : ""
  const text = (value * 100).toFixed(2).replace(/\.?0+$/, "")
  return `${sign}${text}%`
}

function getBuffLabel(typeHrid?: string) {
  if (!typeHrid) {
    return ""
  }
  return BUFF_TYPE_TEXT_MAP[typeHrid] || typeHrid.split("/").pop() || typeHrid
}

function getSealEffect(item: ItemDetail) {
  const personalBuff = item.scrollDetail?.personalBuffTypeHrid
    ? getPersonalBuffDetailOf(item.scrollDetail.personalBuffTypeHrid)?.buff
    : item.consumableDetail?.buffs?.[0]
  if (!personalBuff) {
    return ""
  }
  const ratio = (personalBuff.flatBoost || 0) + (personalBuff.ratioBoost || 0)
  if (!Number.isFinite(ratio)) {
    return ""
  }
  const label = getBuffLabel(personalBuff.typeHrid)
  return label ? `${label} ${formatPercent(ratio)}` : formatPercent(ratio)
}

function getAchievementEffect(type: AchievementTier) {
  const detail = getAchievementTierDetailOf(`/achievement_tiers/${type}`)
  if (!detail?.buff) {
    return type
  }
  const value = (detail.buff.flatBoost || 0) + (detail.buff.ratioBoost || 0)
  return `${getBuffLabel(detail.buff.typeHrid)} ${formatPercent(value)}`
}
</script>

<template>
  <ul v-show="menuVisible" class="contextmenu" :style="{ left: `${left}px`, top: `${top}px` }">
    <li @click="onCopy" v-if="!playerStore.isOverflow()">
      复制
    </li>
    <li v-if="playerStore.presets.length > 1" @click="onRemove">
      删除
    </li>
  </ul>
  <div class="flex items-center">
    <div class="flex items-center  p-1 pl-2 pr-2" style="border:1px solid var(--el-border-color);border-radius: 4px;">
      <div>{{ t('预设') }}:</div>
      <!-- 长按打开右键菜单 -->
      <el-button
        v-for="(preset, index) in playerStore.presets"
        class="ml-1 w-32px"
        :plain="playerStore.presetIndex !== index"
        color="#16ab1b"
        :dark="activeThemeName.includes('dark')"
        :key="index"
        @click="onSelect(preset, index)"
        @contextmenu.prevent="openMenu(preset, index, $event)"
      >
        {{ preset.name?.substring(0, 1) }}
      </el-button>
      <el-button
        v-if="!playerStore.isOverflow()"
        class="ml-1 w-24px" size="small" :icon="Plus" plain
        @click="onAdd"
      />
      <span style="width:1px;height:20px;background:var(--el-border-color);margin:0 4px"></span>
      <el-button
        class="compare-trigger-btn" size="small" plain
        @click="emit('toggleCompare')"
      >
        {{ t("对比") }}
      </el-button>
    </div>

    <template v-for="[key, communityBuff] in playerStore.config.communityBuffMap.entries()" :key="key">
      <div v-if="communityBuff.level" class="community-buff ml-2">
        <ItemIcon :hrid="getCommunityBuffDetailOf(communityBuff.hrid!).buff.typeHrid" :width="22" :height="22" />
        <div v-if="communityBuff.level" class="community-level">
          Lv.{{ communityBuff.level }}
        </div>
      </div>
    </template>
  </div>
  <el-dialog v-model="visible" :show-close="false" width="80%" @close="onDialogClose">
    <el-row :gutter="20" class="mt-[-30px]">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="16">
        <el-card class="mt-5">
          <template #header>
            <div class="flex flex-wrap items-baseline ">
              <!-- <div class="mr-3 mb-2">
                {{ t('预设颜色') }}:
              </div>

              <el-color-picker
                class="mr-5"
                v-model="color"
                :predefine="[
                  '#ff4500',
                  '#ff8c00',
                  '#ffd700',
                  '#90ee90',
                  '#00ced1',
                  '#1e90ff',
                  '#c71585']"
              /> -->

              <div class=" mr-3 mb-2">
                {{ t('预设名称') }}:
              </div>
              <el-input class=" w-300px" :maxlength="20" v-model="name" />
              <el-button type="success" plain class="ml-4" @click="onImport">
                {{ t('导入') }}
              </el-button>
              <el-button type="success" plain class="ml-4" @click="onExport">
                {{ t('导出') }}
              </el-button>
            </div>
          </template>
          <el-table :data="actionList.filter(item => actions ? actions.includes(item.action) : true)">
            <el-table-column prop="name" width="54">
              <template #default="{ row }">
                <ItemIcon :hrid="`/actions/${row.action}`" />
              </template>
            </el-table-column>
            <el-table-column :label="t('Action')" width="125" align="center">
              <template #default="{ row }">
                {{ t(row.action) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('技能等级')" width="85" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.playerLevel" :min="1" :max="200" style="width: 60px" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column :label="t('房子等级')" width="85" align="center">
              <template #default="{ row }">
                <el-input-number v-model="row.houseLevel" :min="0" :max="8" style="width: 60px" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column :label="t('工具')" align="center" min-width="105">
              <template #default="{ row }">
                <el-select style="width:80px" v-model="row.tool.hrid" :placeholder="t('无')" clearable>
                  <el-option v-for="item in getToolListOf(row.action)" :key="item.hrid" :label="item.name" :value="item.hrid">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <ItemIcon :hrid="item.hrid" />
                      <div> {{ item.name }} </div>
                    </div>
                  </el-option>
                  <template #label>
                    <ItemIcon style="margin-top: 4px;" :hrid="row.tool.hrid" />
                  </template>
                </el-select>
                &nbsp;+&nbsp;
                <el-input-number v-model="row.tool.enhanceLevel" :min="0" :max="20" style="width: 60px" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column :label="t('身体')" align="center" min-width="105">
              <template #default="{ row }">
                <el-select style="width:80px" v-model="row.body.hrid" :placeholder="t('无')" clearable>
                  <el-option v-for="item in getEquipmentListOf(row.action, 'body')" :key="item.hrid" :label="item.name" :value="item.hrid">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <ItemIcon :hrid="item.hrid" />
                      <div> {{ item.name }} </div>
                    </div>
                  </el-option>
                  <template #label>
                    <ItemIcon style="margin-top: 4px;" :hrid="row.body.hrid" />
                  </template>
                </el-select>
                &nbsp;+&nbsp;
                <el-input-number v-model="row.body.enhanceLevel" :min="0" :max="20" style="width: 60px" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column :label="t('腿部')" align="center" min-width="105">
              <template #default="{ row }">
                <el-select style="width:80px" v-model="row.legs.hrid" :placeholder="t('无')" clearable>
                  <el-option v-for="item in getEquipmentListOf(row.action, 'legs')" :key="item.hrid" :label="item.name" :value="item.hrid">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <ItemIcon :hrid="item.hrid" />
                      <div> {{ item.name }} </div>
                    </div>
                  </el-option>
                  <template #label>
                    <ItemIcon style="margin-top: 4px;" :hrid="row.legs.hrid" />
                  </template>
                </el-select>
                &nbsp;+&nbsp;
                <el-input-number v-model="row.legs.enhanceLevel" :min="0" :max="20" style="width: 60px" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column :label="t('背部')" align="center" min-width="105">
              <template #default="{ row }">
                <el-select style="width:80px" v-model="row.back.hrid" :placeholder="t('无')" clearable>
                  <el-option v-for="item in getBackEquipmentListOf(row.action)" :key="item.hrid" :label="item.name" :value="item.hrid">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <ItemIcon :hrid="item.hrid" />
                      <div> {{ item.name }} </div>
                    </div>
                  </el-option>
                  <template #label>
                    <ItemIcon style="margin-top: 4px;" :hrid="row.back.hrid" />
                  </template>
                </el-select>
                &nbsp;+&nbsp;
                <el-input-number v-model="row.back.enhanceLevel" :min="0" :max="20" style="width: 60px" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column :label="t('护符')" align="center" min-width="105">
              <template #default="{ row }">
                <el-select style="width:80px" v-model="row.charm.hrid" :placeholder="t('无')" clearable>
                  <el-option v-for="item in getEquipmentListOf(row.action, 'charm').sort((a, b) => a.itemLevel - b.itemLevel)" :key="item.hrid" :label="item.name" :value="item.hrid">
                    <div style="display:flex;align-items:center;gap:10px;">
                      <ItemIcon :hrid="item.hrid" />
                      <div> {{ item.name }} </div>
                    </div>
                  </el-option>
                  <template #label>
                    <ItemIcon style="margin-top: 4px;" :hrid="row.charm.hrid" />
                  </template>
                </el-select>
                &nbsp;+&nbsp;
                <el-input-number v-model="row.charm.enhanceLevel" :min="0" :max="20" style="width: 60px" :controls="false" />
              </template>
            </el-table-column>
            <el-table-column :label="t('茶')" align="center" min-width="155">
              <template #default="{ row }">
                <el-checkbox-group v-model="row.tea" size="large" :max="3" class="tea-checkbox-group">
                  <el-checkbox v-for="tea in getTeaListOf(row.action)" :key="tea.hrid" :value="tea.hrid" border>
                    <ItemIcon :hrid="tea.hrid" />
                  </el-checkbox>
                </el-checkbox-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="8">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="14" :lg="12" :xl="24">
            <el-card class="mt-5">
              <template #header>
                <div style="line-height: 32px;">
                  {{ t('其他') }}
                </div>
              </template>
              <el-table :data="specialList.filter(item => equipments ? equipments.includes(item.type) : true)">
                <el-table-column prop="type" :label="t('部位')" width="120">
                  <template #default="{ row }">
                    {{ t(row.type.replace(/_/g, ' ').replace(/\b\w+\b/g, (word:any) => word.substring(0, 1).toUpperCase() + word.substring(1))) }}
                  </template>
                </el-table-column>
                <el-table-column :label="t('装备')">
                  <template #default="{ row }">
                    <el-select style="width:80px" v-model="row.hrid" :placeholder="t('无')" clearable>
                      <el-option v-for="item in getSpecialEquipmentListOf(row.type)" :key="item.hrid" :label="item.name" :value="item.hrid">
                        <div style="display:flex;align-items:center;gap:10px;">
                          <ItemIcon :hrid="item.hrid" />
                          <div> {{ item.name }} </div>
                        </div>
                      </el-option>
                      <template #label>
                        <ItemIcon style="margin-top: 4px;" :hrid="row.hrid" />
                      </template>
                    </el-select>
                    &nbsp;+&nbsp;
                    <el-input-number v-model="row.enhanceLevel" :min="0" :max="20" style="width: 60px" :controls="false" />
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="24" :md="10" :lg="12" :xl="24">
            <el-card class="mt-5">
              <template #header>
                <div style="line-height: 32px;">
                  {{ t('其他Buff') }}
                </div>
              </template>
              <div class="buff-title">
                {{ t('封印') }}
              </div>
              <div class="buff-tofu-grid">
                <div class="buff-tofu" v-for="item in sealList" :key="`seal-${item.hrid}`">
                  <div class="buff-tofu-head">
                    <ItemIcon :hrid="item.hrid" />
                    <span>{{ getTrans(item.name) }}</span>
                  </div>
                  <div class="buff-effect">
                    {{ getSealEffect(item) }}
                  </div>
                  <el-checkbox :model-value="isSealEnabled(item.hrid)" @change="(value) => onSealToggle(item.hrid, Boolean(value))">
                    {{ t('启用') }}
                  </el-checkbox>
                </div>
              </div>

              <div class="buff-title mt-3">
                {{ t('社区Buff') }}
              </div>
              <div class="buff-tofu-grid">
                <div class="buff-tofu" v-for="row in communityBuffList.filter(item => communityBuffs ? communityBuffs.includes(item.type) : true)" :key="`community-${row.type}`">
                  <div class="buff-tofu-head">
                    <ItemIcon :hrid="getCommunityBuffDetailOf(row.hrid!).buff.typeHrid" :width="22" :height="22" />
                    <span>{{ t('等级') }}</span>
                  </div>
                  <el-input-number v-model="row.level" :min="0" :max="20" style="width: 90px" :controls="false" />
                </div>
              </div>

              <div class="buff-title mt-3">
                {{ t('成就Buff') }}
              </div>
              <div class="buff-tofu-grid">
                <div class="buff-tofu" v-for="row in achievementBuffList.filter(item => achievementBuffs ? achievementBuffs.includes(item.type) : true)" :key="`achievement-${row.type}`">
                  <div class="buff-tofu-head">
                    <ItemIcon :hrid="getAchievementTierDetailOf(`/achievement_tiers/${row.type}`)?.buff.typeHrid" :width="22" :height="22" />
                    <span>{{ getAchievementEffect(row.type) }}</span>
                  </div>
                  <el-checkbox v-model="row.enabled">
                    {{ t('启用') }}
                  </el-checkbox>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <template #footer>
      <div style="text-align: center;">
        <el-button type="danger" plain @click="onDeleteInDialog">
          {{ t('删除') }}
        </el-button>
        <el-button type="primary" @click="onConfirm">
          {{ t('保存') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
:deep(.el-select__wrapper) {
  height: 38px;
}
:deep(.tea-checkbox-group .el-checkbox.is-bordered) {
  margin-right: 3px;
  position: relative;
  padding: 5px !important;
  height: 40px;
  width: 40px;
}
:deep(.tea-checkbox-group .el-checkbox__label) {
  padding: 0;
}
:deep(.tea-checkbox-group .el-checkbox__input) {
  position: absolute;
  width: 35px;
  height: 100%;
}
:deep(.tea-checkbox-group .el-checkbox__inner) {
  position: absolute;
  // 右下角
  right: 0;
  bottom: 0;
}
.config {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  .config-content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  div {
    width: 120px;
  }
}

.contextmenu {
  margin: 0;
  z-index: 3000;
  position: fixed;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  color: var(--v3-tagsview-contextmenu-text-color);
  background-color: var(--v3-tagsview-contextmenu-bg-color);
  box-shadow: var(--v3-tagsview-contextmenu-box-shadow);
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
      color: var(--v3-tagsview-contextmenu-hover-text-color);
      background-color: var(--v3-tagsview-contextmenu-hover-bg-color);
    }
  }
}
.community-buff {
  position: relative;
  width: 36px;
  height: 36px;
  border: 2px solid #2fc4a7;
  border-radius: 4px;
  padding: 6px;
  font-size: 11px;
  line-height: 11px;
}
.community-level {
  position: absolute;
  top: 1px;
  left: 1px;
  text-align: right;
  text-shadow:
    -1px 0 #131419,
    0 1px #131419,
    1px 0 #131419,
    0 -1px #131419;
}

.buff-title {
  font-weight: 600;
  margin-bottom: 10px;
}

.buff-tofu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 10px;
}

.buff-tofu {
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.buff-tofu-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  font-size: 13px;
}

.buff-effect {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
