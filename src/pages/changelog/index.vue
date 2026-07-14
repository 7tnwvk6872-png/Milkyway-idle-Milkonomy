<script lang="ts" setup>
interface ChangelogEntry {
  version: string
  date: string
  changes: string[]
}

const { t } = useI18n()
const appVersion = __APP_VERSION__

// NOTE: Only user-facing feature changes are recorded here (no deploy/CI changes).
const entries: ChangelogEntry[] = [
  {
    version: "1.3.447",
    date: "2026-04-27",
    changes: [
      "采集计算：修复加工茶产物数量错误，补回采集茶系数与配方比例（2 原料 → 1 加工品），伐木 / 挤奶 / 采集三类均生效",
      "采集计算：加工茶的『扣减原料』效果只作用于真正存在加工配方的掉落物，多掉落动作中无关掉落（如鸡蛋、麦子）不再被错误扣减",
      "贤者镜方案：方案对比与最佳挑选改用『总费用（含工时费/税率）』，避免工时费下贤者镜方案被错误隐藏",
      "收藏夹：开放对多步动作的收藏，落库与重建会保存每一步的子配置；不同步数 / 不同子链的多步动作互不覆盖",
      "数据缓存：修复 game data 版本更新后当前 session 仍使用旧定义的问题，新版本到达时会即时刷新内存中的游戏数据并清空相关衍生缓存"
    ]
  },
  {
    version: "1.3.443",
    date: "2026-04-07",
    changes: [
      "本地缓存：将 gameData 与 marketData 从 localStorage 迁移到 IndexedDB，避免大体积数据触发浏览器存储配额限制",
      "启动加载：应用启动时会先从 IndexedDB 恢复游戏数据与市场数据缓存，再继续拉取最新市场数据",
      "缓存兼容：首次加载时会自动将旧版 localStorage 中的游戏数据与市场数据迁移到 IndexedDB"
    ]
  },
  {
    version: "1.3.442",
    date: "2026-03-26",
    changes: [
      "贤者镜计算：低级成品需求改为固定链路计件，不再与其他等级链路联动配平",
      "贤者镜计算：新增『贤者镜触发福气』开关，仅控制贤者镜合成段是否应用福气跳级，普通强化段保持原有福气计算"
    ]
  },
  {
    version: "1.3.440",
    date: "2026-03-20",
    changes: [
      "打野工具 / 超级打野工具：新增『起始等级』范围筛选，便于按初始强化等级过滤结果",
      "打野工具 / 超级打野工具：为『利润率』『经验 / h』补齐表格排序",
      "打赏页面：重新开放并恢复榜单 / 上榜功能，切换新的 Google Sheets / Apps Script 数据源",
      "打赏页面：更新维护者信息与二维码展示，支持 hyhfish 微信赞赏，并保留原作者 luyh7 的历史二维码"
    ]
  },
  {
    version: "1.3.439",
    date: "2026-03-19",
    changes: [
      "Buff 计算：工匠茶附带的 action_level 等级惩罚现在会正确计入暴饮浓度加成，避免高估工匠茶收益",
      "Dashboard：收藏夹新增『经验 / h』显示，便于同时查看利润与经验收益",
      "打野工具 / 超级打野工具：共用筛选项恢复生效，并补齐超级打野对售价、物品等级等筛选条件的支持"
    ]
  },
  {
    version: "1.3.437",
    date: "2026-03-16",
    changes: [
      "利润计算：新增 3 秒最短行动时间限制，若动作计算耗时低于 3 秒，将按 3 秒参与每小时产量、成本、收益与利润计算"
    ]
  },
  {
    version: "1.3.432",
    date: "2026-03-12",
    changes: [
      "Dashboard 配置：修复『其他Buff』中封印类卷轴不显示 buff 数值的问题",
      "Buff 计算：兼容迷宫封印改为卷轴后的新数据结构，封印增益会继续正确参与利润与 buff 汇总计算"
    ]
  },
  {
    version: "1.3.430",
    date: "2026-03-10",
    changes: [
      "贤者镜计算"
    ]
  },
  {
    version: "1.3.429",
    date: "2026-03-09",
    changes: [
      "英灵殿 / 埋骨地：切换 Google Apps Script 提交接口、上香接口与 Google Sheets 数据源",
      "英灵殿 / 埋骨地：统一两页的数据源配置，便于后续维护与迁移"
    ]
  },
  {
    version: "1.3.426",
    date: "2026-03-02",
    changes: [
      "打野工具：新增『超级打野』模式，并将原有 jungle / junglest 数据源整合到同一页面管理",
      "打野工具：支持数据源切换并记住上次选择，减少重复设置",
      "打野工具：新增期望耗时展示，便于预估任务完成时间",
      "打野工具：针对不同数据源动态区分手动价格卡片缓存，避免配置互相污染"
    ]
  },
  {
    version: "1.3.411",
    date: "2026-02-27",
    changes: [
      "强化工具：新增『成本指导价』功能，用于分析物品制作成本",
      "强化工具：支持从低级材料向上推导完整制作链路，并提供叶子材料汇总与完整链路两种视图",
      "强化工具：新增成本过滤、排序、单价分析、成本占比分析，以及展开/收起和仅显示无库存等交互"
    ]
  },
  {
    version: "1.3.410",
    date: "2026-02-27",
    changes: [
      "打野工具：新增装备筛选，支持按生活装备、战斗装备等维度快速过滤",
      "打野工具：新增生活装备细分筛选，支持工具 / 装备等子分类",
      "Dashboard / 打野工具：新增成交量（1h）显示，便于判断市场活跃度"
    ]
  },
  {
    version: "1.3.414",
    date: "2026-03-02",
    changes: [
      "强化工具：『装备成本』『强化消耗』全部价格项补齐档位上下调整（输入框 +/- 按市场价格档位跳价）",
      "中文翻译：更新迷宫新增物品的中文名称"
    ]
  },
  {
    version: "1.3.413",
    date: "2026-02-27",
    changes: [
      "强化计算 / 超级强化计算：修复『成品售价』价格档位步进异常，避免点击 - 直接跳到 -1，改为按市场档位逐级调整",
      "强化计算 / 超级强化计算：修复价格处于 -1 后无法回调的问题，点击 + 可恢复并继续按档位上调",
      "超级强化计算：档位步进判定增加容差处理，避免输入组件数值抖动导致档位判断错误"
    ]
  },
  {
    version: "1.3.412",
    date: "2026-02-27",
    changes: [
      "超级强化计算：为装备成本中的『初始物品价格』『逃逸价格』『白板价格』补齐价格档位步进（输入框 +/- 按市场档位跳价）",
      "超级强化计算：『强化消耗』中的每个材料价格与『保护』价格支持价格档位步进",
      "超级强化计算：移除上述价格项的下拉档位选择，统一使用与强化计算一致的价格档位调整交互"
    ]
  },
  {
    version: "1.3.411",
    date: "2026-02-27",
    changes: [
      "Dashboard 配置：封印改为可多选并支持叠加，展示方式与成就 Buff 一致（豆腐块勾选）",
      "Buff 规则：封印增益按行动范围生效（美食/采集/加工/效率/速度/经验/稀有发现）并参与利润计算",
      "成就 Buff：生效范围与封印规则统一，移除精英成就（战斗伤害增益）"
    ]
  },
  {
    version: "1.3.409",
    date: "2026-02-27",
    changes: [
      "Dashboard 配置：新增『成就Buff』勾选项，启用后会参与 Buff 汇总并影响利润计算",
      "Dashboard 配置：修复『成就Buff-启用』复选框与列标题未对齐的问题"
    ]
  },
  {
    version: "1.3.408",
    date: "2026-02-27",
    changes: [
      "Dashboard：首页利润计算新增『计算税率』开关（默认开启）",
      "Dashboard：利润排行/收藏夹新增『排除护符』过滤开关"
    ]
  },
  {
    version: "1.3.406",
    date: "2026-02-26",
    changes: [
      "强化工具：『成品售价』价格增加档位上下调整（按市场价格档位跳价）"
    ]
  },
  {
    version: "1.3.405",
    date: "2026-02-26",
    changes: [
      "强化工具：『装备成本』『强化消耗』新增买价下拉框（左价/左价-/右价/右价+），并移除『材料右价+』",
      "强化工具：保护道具的占位价格会跟随『强化消耗』买价选择联动更新",
      "强化工具：『成品售价』税率改为仅 0% / 2% 两档（默认 2%）"
    ]
  },
  {
    version: "1.3.404",
    date: "2026-02-26",
    changes: [
      "打野工具：新增『到强化工具中查看』，跳转到强化计算并回填物品 + 强化等级"
    ]
  },
  {
    version: "1.3.403",
    date: "2026-02-26",
    changes: [
      "Dashboard 配置：新增『背部』栏位，并按技能限制可选披风"
    ]
  },
  {
    version: "1.3.391",
    date: "2026-02-26",
    changes: [
      "强化计算：新增税率/溢价开关"
    ]
  },
  {
    version: "1.3.390",
    date: "2026-02-26",
    changes: [
      "强化计算：制作材料支持使用『右价+』参与成本计算"
    ]
  },
  {
    version: "1.3.387",
    date: "2026-02-25",
    changes: [
      "打野工具：新增『排除护符』过滤，以及物品等级范围筛选"
    ]
  }
]

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
              {{ c }}
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
