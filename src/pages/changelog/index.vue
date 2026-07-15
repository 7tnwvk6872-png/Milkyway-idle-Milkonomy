<template>
  <div class="changelog-page">
    <h2>v2.2.0 — 2026-07-15</h2>

    <p><strong>一、一键导入数据脚本</strong></p>
    <ol>
      <li>映射修复：护符、背部、身体、腿部及房屋的导入映射已修复，各部位装备均可正确录入。</li>
      <li>批量提取：仓库内高品质装备、身体、腿部、护符支持一次性全量导出，无需逐件操作。</li>
      <li>生活技能提取：适配一键提取生活等级脚本，无需手动逐项录入。</li>
    </ol>
    <p>一键导入数据脚本：<a href="https://greasyfork.org/zh-CN/scripts/587094-milkonomy-data-exporter" target="_blank" style="color:#409eff">Greasy Fork</a></p>

    <p><strong>二、利润网</strong></p>
    <ol>
      <li>纯净火车：锻造、制造、裁缝新增开关，开启后仅保留基础材料制造链路，战斗掉落及精通之油、洞察之枝、专精之线不纳入计算。</li>
      <li>材质链区分：裁缝支持全部、布料、皮革三种模式独立切换，档位筛选仅在所选材质范围内生效。</li>
      <li>神龛导入：新增神龛数据导入与利润计算支持，补齐原版利润网的缺失模块。</li>
      <li>逐级制作：多步制作链路新增起始材质与终点档位设置按钮，支持自定义链条起止点。</li>
      <li>预设对比：支持同时加载两套预设方案，直观对比不同配置下的利润差异。</li>
      <li>加载优化：页面改为先渲染后加载数据，首次打开不再长时间白屏。</li>
      <li>档位修正：布料档位名称由 "辐光" 更正为 "光辉"。</li>
      <li>版本公告：每版本首次访问弹出更新说明，关闭后本版不再重复显示。</li>
    </ol>

    <hr />

    <details>
      <summary style="cursor:pointer;font-weight:bold;font-size:18px;margin:16px 0 8px">v2.1.0 — 2026-07-15</summary>
      <div style="padding-left:16px">
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
        <p><a href="https://greasyfork.org/zh-CN/scripts/587094-milkonomy-data-exporter" target="_blank">Milkonomy Data Exporter</a></p>
        <ul>
          <li>根据游戏域名自动适配中英文界面。</li>
          <li>新增神龛数据导出。</li>
        </ul>
      </div>
    </details>

    <hr />

    <details>
      <summary style="cursor:pointer;font-weight:bold;font-size:18px;margin:16px 0 8px">v2.0.0 — 2026-07-14</summary>
      <div style="padding-left:16px">
        <ul>
          <li>生活数据一键导入（技能、装备、房子、社区 Buff、成就）</li>
          <li>独立油猴导出脚本</li>
          <li>9 个利润页面全部支持预设对比</li>
          <li>商店物品标注来源</li>
        </ul>
      </div>
    </details>
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
