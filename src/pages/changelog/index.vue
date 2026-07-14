<script lang="ts" setup>
interface ChangelogEntry {
  version: string
  date: string
  changes: { zh: string; en: string }[]
}

const { t, locale } = useI18n()
const appVersion = __APP_VERSION__

function l(item: { zh: string; en: string }) {
  return locale.value === 'en' ? item.en : item.zh
}

const entries: ChangelogEntry[] = [{
    version: "2.0.0", date: "2026-07-14",
    changes: [
      {
        zh: "全局预设对比：利润总览、打野工具、超级打野、打野继承、继承、分解、挑选、强化合成、手工炼金全部页面支持预设对比——利润/h、利润率、利润/天、经验/h等数据并排对比，不同预设用不同颜色区分。预设栏右侧点「对比」按钮展开。",
        en: "Global Preset Comparison: All pages (Dashboard, Jungle, Super Jungle, Jungle Inherit, Inherit, Decompose, Pickout, Enhanposer, Manualchemy) now support cross-preset comparison — profit/h, profit rate, profit/day, EXP/h side by side in color-coded columns."
      },
      {
        zh: "预设删除：预设支持右键菜单一键删除，不再需要的预设可以直接清理。",
        en: "Preset Deletion: Right-click a preset to delete it instantly — no more cluttered preset list."
      },
      {
        zh: "逐级制作筛选：锻造/制造/裁缝新增「材质链」和「起始材质」筛选，只计算从指定等级材料开始制作的利润，支持全链逐级选择。",
        en: "Tier Crafting Filter: Added material chain and starting material filters for Smithing/Crafting/Tailoring. Only calculate profit from a chosen material tier."
      },
      {
        zh: "强化精确等级：打野工具支持按精确等级筛选强化利润，不再只能看全等级汇总。",
        en: "Precise Enchant Level: Jungle tools now filter enchant profit by exact level instead of all-level summary."
      },
      {
        zh: "左侧菜单重排：强化计算移至打野工具上方，常用功能更顺手。",
        en: "Menu Reorder: Enchant Calculator moved above Jungle Tools for quicker access."
      },
      {
        zh: "打赏页面更新：原作者补充 hyhfish，维护者 Polokiki 支持支付宝打赏，三人独立打赏码。",
        en: "Sponsor Page Update: Added hyhfish (original author), Polokiki now supports Alipay. Three independent sponsor QR codes."
      }
    ]
  }]
const activeVersions = ref<string[]>([entries[0]?.version].filter(Boolean) as string[])
</script>

<template>
  <div class="app-container">
    <el-card shadow="never">
      <template #header>
        <div class="header">
          <span class="title">{{ t("更新日志") }}</span>
          <el-tag size="small" type="info">
            {{ t("当前版本") }}：v{{ appVersion }}
          </el-tag>
        </div>
      </template>

      <el-collapse v-model="activeVersions">
        <el-collapse-item v-for="entry in entries" :key="entry.version" :name="entry.version">
          <template #title>
            <div class="collapse-title">
              <span class="version">v{{ entry.version }}</span>
              <span class="date">{{ entry.date }}</span>
            </div>
          </template>
          <ul class="changes">
            <li v-for="(c, idx) in entry.changes" :key="idx">
              {{ l(c) }}
            </li>
          </ul>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title {
  font-weight: 600;
}

.collapse-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.version {
  font-weight: 600;
}

.date {
  opacity: 0.7;
  font-size: 12px;
}

.changes {
  margin: 0;
  padding-left: 18px;
}

.changes > li {
  line-height: 1.8;
}
</style>
