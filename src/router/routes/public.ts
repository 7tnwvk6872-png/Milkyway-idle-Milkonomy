import type { RouteRecordRaw } from "vue-router"
import locale from "@/locales"

const Layouts = () => import("@/layouts/index.vue")
const { t } = locale.global

/**
 * 公开路由配置
 * 这些路由将在公开版本中包含
 */
export const publicRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/pages/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/pages/error/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: t("首页"),
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/enhancer",
    children: [
      {
        path: "enhancer",
        component: () => import("@/pages/enhancer/index.vue"),
        name: "Enhancer",
        meta: {
          title: t("强化计算"),
          elIcon: "MagicStick",
          affix: true
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/philosopher",
    children: [
      {
        path: "philosopher",
        component: () => import("@/pages/philosopher/index.vue"),
        name: "Philosopher",
        meta: {
          title: t("贤者镜计算"),
          itemIconHrid: "/items/philosophers_mirror",
          affix: false
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
        path: "enhanposer",
        component: () => import("@/pages/enhanposer/index.vue"),
        name: "Enhanposer",
        meta: {
          title: t("强化分解"),
          affix: false,
          svgIcon: "dashboard"
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/valhalla",
    children: [
      {
        path: "valhalla",
        component: () => import("@/pages/valhalla/index.vue"),
        name: "Valhalla",
        meta: {
          title: t("英灵殿"),
          elIcon: "User",
          affix: false
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/burial",
    children: [
      {
        path: "burial",
        component: () => import("@/pages/burial/index.vue"),
        name: "Burial",
        meta: {
          title: t("埋骨地"),
          elIcon: "User",
          affix: false
        }
      }
    ]
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/sponsor",
    children: [
      {
        path: "sponsor",
        component: () => import("@/pages/sponsor/index.vue"),
        name: "Sponsor",
        meta: {
          title: t("打赏"),
          elIcon: "Coin",
          affix: true
        }
      }
    ]
  },

  {
    path: "/",
    component: Layouts,
    redirect: "/changelog",
    children: [
      {
        path: "changelog",
        component: () => import("@/pages/changelog/index.vue"),
        name: "Changelog",
        meta: {
          title: t("更新日志"),
          elIcon: "Document",
          affix: false
        }
      }
    ]
  },

  {
    path: "/link",
    meta: {
      title: t("相关链接"),
      elIcon: "Link"
    },
    children: [
      {
        path: "https://github.com/luyh7/milkonomy",
        component: () => {},
        name: "Link0",
        meta: {
          title: "Milkonomy Source Code"
        }
      },
      {
        path: "https://www.milkywayidle.com/",
        component: () => {},
        name: "Link1",
        meta: {
          title: "Milky Way Idle"
        }
      },
      {
        path: "https://test-ctmd6jnzo6t9.feishu.cn/docx/KG9ddER6Eo2uPoxJFkicsvbEnCe",
        component: () => {},
        name: "Link2",
        meta: {
          title: "牛牛手册(攻略/插件)"
        }
      },
      {
        path: "https://github.com/holychikenz/MWIApi",
        component: () => {},
        name: "Link3",
        meta: {
          title: "MWI Api"
        }
      },
      {
        path: "https://docs.google.com/spreadsheets/d/13yBy3oQkH5N4y7UJ0Pkux2A8O5xM1ZsVTNAg6qgLEcM/edit?gid=2017655058#gid=2017655058",
        component: () => {},
        name: "Link4",
        meta: {
          title: "MWI Data"
        }
      }

    ]
  }
]
