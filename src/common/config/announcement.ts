/**
 * 公告配置
 * 用于在页面顶部展示全局公告信息
 */

export interface AnnouncementConfig {
  /** 是否启用公告 */
  enabled: boolean
  /** 公告唯一标识，用于localStorage记录关闭状态，修改id可让已关闭的用户重新看到公告 */
  id: string
  /** 公告消息的i18n key */
  message: {
    title: string
    content: string
  }
  /** 相关链接 */
  link?: {
    url: string
    text: string
  }
}

export const announcementConfig: AnnouncementConfig = {
  enabled: false,
  id: "v2.1.0-2026",
  message: {
    title: "v2.1.0 更新公告",
    content: "神龛 Buff / 预设弹窗重构 / 快速导入 / 装备自动填入 / 成就修复 / 菜单重组 / 材质链修复 / 公告弹窗 / 导出脚本 v1.5.0"
  },
  link: {
    url: "https://polokikiki.github.io/Milkonomy/#/changelog",
    text: "查看详情"
  }
}

const STORAGE_KEY = "announcement-dismissed-2026"

/**
 * 检查公告是否应该显示
 */
export function shouldShowAnnouncement(): boolean {
  if (!announcementConfig.enabled) return false
  const dismissed = localStorage.getItem(STORAGE_KEY)
  return dismissed !== announcementConfig.id
}

/**
 * 关闭/忽略公告
 */
export function dismissAnnouncement(): void {
  localStorage.setItem(STORAGE_KEY, announcementConfig.id)
}
