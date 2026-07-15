import type { AchievementBuffItem, CommunityBuffItem, PlayerEquipmentItem, ShrineBuffItem } from "@/pinia/stores/player"
import type { Action, NoncombatStatsKey } from "~/game"

export const DEFAULT_SEPCIAL_EQUIPMENT_LIST: PlayerEquipmentItem[] = [
  { type: "off_hand", hrid: "/items/eye_watch", enhanceLevel: 10 },
  { type: "head", hrid: "/items/red_culinary_hat", enhanceLevel: 10 },
  { type: "hands", hrid: "/items/enchanted_gloves", enhanceLevel: 10 },
  { type: "feet", hrid: "/items/collectors_boots", enhanceLevel: 10 },
  { type: "neck", hrid: "", enhanceLevel: undefined },
  { type: "earrings", hrid: "", enhanceLevel: undefined },
  { type: "ring", hrid: "", enhanceLevel: undefined },
  { type: "pouch", hrid: "", enhanceLevel: undefined }
]

export const DEFAULT_TEA: Record<Action, string[]> = Object.freeze({
  milking: ["/items/processing_tea", "/items/gathering_tea", "/items/efficiency_tea"],
  foraging: ["/items/processing_tea", "/items/gathering_tea", "/items/efficiency_tea"],
  woodcutting: ["/items/processing_tea", "/items/gathering_tea", "/items/efficiency_tea"],
  cheesesmithing: ["/items/wisdom_tea", "/items/artisan_tea", "/items/efficiency_tea"],
  crafting: ["/items/wisdom_tea", "/items/artisan_tea", "/items/efficiency_tea"],
  tailoring: ["/items/wisdom_tea", "/items/artisan_tea", "/items/efficiency_tea"],
  brewing: ["/items/gourmet_tea", "/items/artisan_tea", "/items/efficiency_tea"],
  cooking: ["/items/gourmet_tea", "/items/artisan_tea", "/items/efficiency_tea"],
  alchemy: ["/items/wisdom_tea", "/items/efficiency_tea", "/items/catalytic_tea"],
  enhancing: ["/items/wisdom_tea", "/items/blessed_tea", "/items/super_enhancing_tea"]
})

export const DEFAULT_COMMUNITY_BUFF_LIST: CommunityBuffItem[] = [
  { type: "experience", hrid: "/community_buff_types/experience", level: undefined },
  { type: "gathering_quantity", hrid: "/community_buff_types/gathering_quantity", level: undefined },
  { type: "production_efficiency", hrid: "/community_buff_types/production_efficiency", level: undefined },
  { type: "enhancing_speed", hrid: "/community_buff_types/enhancing_speed", level: undefined }
]

export const DEFAULT_ACHIEVEMENT_BUFF_LIST: AchievementBuffItem[] = [
  { type: "beginner", enabled: false },
  { type: "novice", enabled: false },
  { type: "adept", enabled: false },
  { type: "veteran", enabled: false },
  { type: "champion", enabled: false }
]

export const DEFAULT_SHRINE_LIST: ShrineBuffItem[] = [
  { type: "power", level: 0 },
  { type: "rhythm", level: 0 },
  { type: "spirit", level: 0 },
  { type: "rare", level: 0 },
  { type: "scholar", level: 0 }
]

export const SHRINE_CONFIG: Record<string, { key: NoncombatStatsKey, perLevel: number, name: string, label: string }> = {
  power: { key: "Efficiency", perLevel: 0.005, name: "力量神龛", label: "效率" },
  rhythm: { key: "Speed", perLevel: 0.005, name: "节奏神龛", label: "行动速度" },
  spirit: { key: "EssenceFind", perLevel: 0.02, name: "精神神龛", label: "精华发现" },
  rare: { key: "RareFind", perLevel: 0.01, name: "稀有神龛", label: "稀有发现" },
  scholar: { key: "Experience", perLevel: 0.005, name: "学者神龛", label: "经验" }
}
