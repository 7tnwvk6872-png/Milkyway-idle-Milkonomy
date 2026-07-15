<template>
  <div class="changelog-page">
    <h2>v2.1.0 — 2026-07-15</h2>

    <p><strong>1. 神龛数据</strong></p>
    <p>导入生活数据时自动识别公会神龛等级，支持五种神龛：力量、节奏、精神、稀有、学者。数据来源于游戏内公会建筑等级，导出脚本自动提取，导入时自动映射填入。</p>

    <p><strong>2. 导入升级</strong></p>
    <p>导入对话框从简单文本框改为完整交互界面。粘贴 JSON 数据后，勾选「数据升级」并通过下拉框选择目标预设，即可一键合并。界面新增提示图标，悬停显示功能说明。</p>

    <p><strong>3. 数据合并</strong></p>
    <p>勾选「数据升级」后导入数据与选中预设自动对比取优。合并规则：装备、技能、房子、神龛取两者最高等级，社区 Buff 使用最新导入数据，预设颜色与封印保持不变。不勾选则按原有逻辑创建新预设。</p>

    <p><strong>4. 修复</strong></p>
    <ul>
      <li>加号按钮在超过 5 个预设后不再消失。</li>
    </ul>

    <p><strong>5. 导出脚本 v1.2.0</strong></p>
    <p>一键从游戏内导出完整生活技能数据（技能、装备、房子、神龛、社区 Buff），粘贴到 Milkonomy 即可导入。安装链接：<a href="https://greasyfork.org/zh-CN/scripts/587094-milkonomy-data-exporter" target="_blank">Milkonomy Data Exporter</a></p>
    <ul>
      <li>根据游戏域名自动适配中英文界面。</li>
      <li>新增神龛数据导出。</li>
    </ul>

    <hr />

    <h2>v2.0.0 — 2026-07-14</h2>
    <ul>
      <li>生活数据一键导入（技能、装备、房子、社区 Buff、成就）</li>
      <li>独立油猴导出脚本</li>
      <li>9 个利润页面全部支持预设对比</li>
      <li>商店物品标注来源</li>
    </ul>
  </div>
</template>

<style scoped>
.changelog-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
}
.changelog-page h2 {
  font-size: 20px;
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color);
}
.changelog-page p {
  font-size: 14px;
  color: var(--el-text-color-regular);
}
.changelog-page li {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin: 4px 0;
}
.changelog-page a {
  color: var(--el-color-primary);
}
.changelog-page hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--el-border-color);
}
</style>
