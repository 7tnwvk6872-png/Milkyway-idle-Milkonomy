<script lang="ts" setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()

// 用 Vite 的 URL import 加载截图
const stepImgs = {
  step1: new URL("@@/assets/images/tutorial/step-1-copy.jpg", import.meta.url).href,
  step2: new URL("@@/assets/images/tutorial/step-2-preset.jpg", import.meta.url).href,
  step3: new URL("@@/assets/images/tutorial/step-3-buttons.jpg", import.meta.url).href,
  step4: new URL("@@/assets/images/tutorial/step-4-import.jpg", import.meta.url).href,
}

const steps = [
  {
    img: stepImgs.step1,
    title: "第一步：安装脚本，导出数据",
    text: "在游戏里点击顶部绿色「Milkonomy」按钮，数据会自动复制到剪贴板，弹出「Copied!」提示即成功。"
  },
  {
    img: stepImgs.step2,
    title: "第二步：切换预设",
    text: "点击绿色数字切换预设方案（0-9），每个预设独立保存装备、技能、房子数据。点「对比」可同时查看两个预设的利润差异。"
  },
  {
    img: stepImgs.step3,
    title: "第三步：导入 / 导出数据",
    text: "「导入」粘贴剪贴板数据，「导出」备份当前预设，「快速导入数据」一键覆盖当前预设。"
  },
  {
    img: stepImgs.step4,
    title: "第四步：粘贴并确认",
    text: "在弹窗中粘贴 JSON 数据。勾选「数据升级」可选目标预设合并数据。确认无误后点「确定」完成导入。"
  }
]
</script>

<template>
  <div class="tutorial-page">
    <div class="page-head">
      <h1>使用教程</h1>
      <p class="sub-title">从脚本安装到数据导入，4 步搞定</p>
    </div>

    <div class="steps">
      <el-card v-for="(step, i) in steps" :key="i" class="step-card">
        <div class="step-header">
          <span class="step-num">{{ i + 1 }}</span>
          <h3>{{ step.title }}</h3>
        </div>
        <div class="step-body">
          <div class="step-img">
            <img :src="step.img" :alt="step.title" />
          </div>
          <p class="step-text">{{ step.text }}</p>
        </div>
      </el-card>
    </div>

    <div class="links">
      <p>必需链接：</p>
      <a href="https://www.tampermonkey.net/" target="_blank">Tampermonkey 插件</a>
      <span>→</span>
      <a href="https://greasyfork.org/zh-CN/scripts/587094-milkonomy-data-exporter" target="_blank">安装脚本</a>
      <span>→</span>
      <a href="https://www.milkywayidle.com/" target="_blank">打开游戏</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tutorial-page {
  padding: 20px;
  max-width: 720px;
  margin: 0 auto;
}

.page-head {
  text-align: center;
  margin-bottom: 32px;
}

.page-head h1 {
  margin: 0 0 8px;
  font-size: 34px;
}

.sub-title {
  color: #999;
  font-size: 15px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-card {
  :deep(.el-card__body) {
    padding: 24px;
  }
}

.step-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #409eff;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-header h3 {
  margin: 0;
  font-size: 20px;
}

.step-body {
  padding-left: 52px;
}

.step-img {
  border-radius: 8px;
  overflow: hidden;
  background: #1a1a2e;
  margin-bottom: 12px;

  img {
    width: 100%;
    display: block;
  }
}

.step-text {
  color: #555;
  line-height: 1.8;
  font-size: 15px;
}

.links {
  margin-top: 32px;
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  color: #666;

  p {
    margin: 0 0 8px;
    font-weight: 600;
  }

  a {
    color: #409eff;
    margin: 0 6px;
  }

  span {
    color: #ccc;
    margin: 0 4px;
  }
}
</style>
