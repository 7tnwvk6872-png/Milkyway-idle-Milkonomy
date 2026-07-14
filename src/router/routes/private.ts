import type { RouteRecordRaw } from "vue-router"
import locale from "@/locales"

const Layouts = () => import("@/layouts/index.vue")
const { t } = locale.global

/**
 * 私有路由配置
 * 这些路由只会在私有版本中包含
 * 在构建公开版本时，这些路由和对应的页面文件将不会被打包
 */
export const privateRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layouts,
    redirect: "/enhancest",
    children: [
      {
        path: "enhancest",
        component: () => import("@/pages/enhancest/index.vue"),
        name: "Enhancest",
        meta: {
          title: t("超级强化计算"),
          elIcon: "MagicStick",
          affix: false
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/jungle",
    meta: {
      title: t("打野工具"),
      elIcon: "Compass"
    },
    children: [
      {
        path: "jungle",
        component: () => import("@/pages/jungle/index.vue"),
        name: "Jungle",
        meta: {
          title: t("打野工具"),
          affix: false,
          elIcon: "Compass"
        }
      },
      {
        path: "junglerit",
        component: () => import("@/pages/junglest/inherit.vue"),
        name: "junglerit",
        meta: {
          title: t("继承打野工具"),
          affix: false,
          elIcon: "Compass"
        }
      },
      {
        path: "inherit",
        component: () => import("@/pages/inherit/index.vue"),
        name: "inherit",
        meta: {
          title: t("继承"),
          affix: false,
          elIcon: "Compass"
        }
      },
      {
        path: "decompose",
        component: () => import("@/pages/decompose/index.vue"),
        name: "decompose",
        meta: {
          title: t("分解"),
          affix: false,
          elIcon: "Compass"
        }
      },
      {
        path: "pickout",
        component: () => import("@/pages/jungle/pickout.vue"),
        name: "Pickout",
        meta: {
          title: t("捡漏工具"),
          affix: false,
          elIcon: "Compass"
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/manualchemy",
    children: [
      {
        path: "manualchemy",
        component: () => import("@/pages/manualchemy/index.vue"),
        name: "Manualchemy",
        meta: {
          title: t("制作炼金"),
          svgIcon: "dashboard"
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/enhanposer",
    children: [
      {
        path: "enhanposest",
        component: () => import("@/pages/enhanposer/enhanposest.vue"),
        name: "Enhanposest",
        meta: {
          title: t("超级强化分解"),
          affix: false,
          svgIcon: "dashboard"
        }
      }
    ]
  },
  {
    path: "/demo",
    component: Layouts,
    redirect: "/demo/unocss",
    name: "Demo",
    meta: {
      title: "示例集合",
      elIcon: "DataBoard",
      hidden: true
    },
    children: [
      {
        path: "unocss",
        component: () => import("@/pages/demo/unocss/index.vue"),
        name: "UnoCSS",
        meta: {
          title: "UnoCSS"
        }
      },
      {
        path: "level2",
        component: () => import("@/pages/demo/level2/index.vue"),
        redirect: "/demo/level2/level3",
        name: "Level2",
        meta: {
          title: "二级路由",
          alwaysShow: true
        },
        children: [
          {
            path: "level3",
            component: () => import("@/pages/demo/level2/level3/index.vue"),
            name: "Level3",
            meta: {
              title: "三级路由",
              keepAlive: true
            }
          }
        ]
      },
      {
        path: "composable-demo",
        redirect: "/demo/composable-demo/use-fetch-select",
        name: "ComposableDemo",
        meta: {
          title: "组合式函数"
        },
        children: [
          {
            path: "use-fetch-select",
            component: () => import("@/pages/demo/composable-demo/use-fetch-select.vue"),
            name: "UseFetchSelect",
            meta: {
              title: "useFetchSelect"
            }
          },
          {
            path: "use-fullscreen-loading",
            component: () => import("@/pages/demo/composable-demo/use-fullscreen-loading.vue"),
            name: "UseFullscreenLoading",
            meta: {
              title: "useFullscreenLoading"
            }
          },
          {
            path: "use-watermark",
            component: () => import("@/pages/demo/composable-demo/use-watermark.vue"),
            name: "UseWatermark",
            meta: {
              title: "useWatermark"
            }
          }
        ]
      }
    ]
  }
]
