/**
 * 逐级制作 / 起始材质 —— 材质档位配置
 *
 * 游戏里锻造/制造/裁缝的装备是逐级升级的（cheese→verdant→...→holy），
 * 每一档对应一个固定的 itemLevel。用 itemLevel 作为绝对锚点来筛选：
 *   - 起始材质：workflow 链条起点（configs[0]）的 itemLevel
 *   - 逐级制作（终点）：workflow 最终产物的 itemLevel
 *
 * 基础主链档位用颜色名；顶端特殊装备档位（无统一颜色名）用等级数命名（Lv85/90/95）。
 */

export interface TierOption {
  itemLevel: number
  label: string
}

export interface TierChain {
  key: string
  label: string
  tiers: TierOption[]
}

export const TIER_CHAINS: Record<string, TierChain[]> = {
  锻造: [
    {
      key: "cheese",
      label: "奶酪",
      tiers: [
        { itemLevel: 1, label: "普通" },
        { itemLevel: 10, label: "绿" },
        { itemLevel: 20, label: "蓝" },
        { itemLevel: 35, label: "紫" },
        { itemLevel: 50, label: "红" },
        { itemLevel: 65, label: "彩虹" },
        { itemLevel: 80, label: "神圣" },
        { itemLevel: 85, label: "Lv85" },
        { itemLevel: 90, label: "Lv90" },
        { itemLevel: 95, label: "Lv95" }
      ]
    }
  ],
  制造: [
    {
      key: "wood",
      label: "木材",
      tiers: [
        { itemLevel: 1, label: "普通" },
        { itemLevel: 10, label: "桦木" },
        { itemLevel: 20, label: "雪松" },
        { itemLevel: 35, label: "紫檀" },
        { itemLevel: 50, label: "银杏" },
        { itemLevel: 65, label: "红杉" },
        { itemLevel: 80, label: "奥术" },
        { itemLevel: 85, label: "Lv85" },
        { itemLevel: 90, label: "Lv90" },
        { itemLevel: 95, label: "Lv95" }
      ]
    }
  ],
  裁缝: [
    {
      key: "leather",
      label: "皮革",
      tiers: [
        { itemLevel: 1, label: "粗皮" },
        { itemLevel: 15, label: "爬虫" },
        { itemLevel: 35, label: "哥布林" },
        { itemLevel: 55, label: "野兽" },
        { itemLevel: 75, label: "暗影" },
        { itemLevel: 85, label: "狮鹫" },
        { itemLevel: 95, label: "海妖/Lv95" }
      ]
    },
    {
      key: "fabric",
      label: "布料",
      tiers: [
        { itemLevel: 1, label: "棉" },
        { itemLevel: 15, label: "亚麻" },
        { itemLevel: 35, label: "竹" },
        { itemLevel: 55, label: "丝绸" },
        { itemLevel: 75, label: "辐光" },
        { itemLevel: 90, label: "Lv90" },
        { itemLevel: 95, label: "Lv95" }
      ]
    }
  ]
}

// 动作名归一化：英文/繁体动作名统一映射回简体中文 key，
// 保证中英文界面下逐级制作过滤器都能正确匹配 TIER_CHAINS。
const PROJECT_ALIAS: Record<string, string> = {
  // 锻造
  "锻造": "锻造",
  "Smithing": "锻造",
  "Cheesesmithing": "锻造",
  // 制造
  "制造": "制造",
  "Crafting": "制造",
  // 裁缝 / 缝纫
  "裁缝": "裁缝",
  "缝纫": "裁缝",
  "Tailoring": "裁缝"
}

export function normalizeProject(project: string): string {
  return PROJECT_ALIAS[project] || project
}

export function supportsTierFilter(project: string): boolean {
  const p = normalizeProject(project)
  return p === "锻造" || p === "制造" || p === "裁缝"
}
