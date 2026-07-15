<template>
  <div class="changelog-page">
        <h2>v2.2.1 — 2026-07-16</h2>

    <p><strong>一、利润网修复</strong></p>
    <ol>
      <li>排行榜缓存修复：切换买/卖价后排行榜价格不再锁死。此前缓存未区分价格模式，切换后仍返回旧数据。</li>
      <li>丛林/打野缓存修复：同上，切换买/卖价后丛林和超级打野页面价格正确刷新。</li>
      <li>制造纯火车修复：开启纯净火车并选择起始材质后不再空白。修复了起始材质过滤只检查链路第一步的 bug。</li>
      <li>制造纯火车护符排除：纯净火车模式下自动排除护符，不再混入非材质链产物。</li>
      <li>「排除装备」功能完善：排除装备时保留多步制作链条，只隐藏单步制造装备项。</li>
    </ol>

    <p><strong>二、材质链改进</strong></p>
    <ol>
      <li>裁缝档位补全：皮革链新增 Lv90，布料链新增 Lv85。</li>
      <li>「全部」模式上限提升：75→95，现在可看到高端档位。</li>
      <li>纯净火车提示文字修正：「黄油、树枝、毛线」→「精通之油、洞察之枝、专精之线」。</li>
    </ol>

    <p><strong>三、商店价格</strong></p>
    <ol>
      <li>新增商店固定售价硬编码兜底（38 个物品），覆盖基础工具/武器（5,000 金币）和实习护符（250,000 金币）。</li>
    </ol>

    <p><strong>四、快速导入数据脚本教程</strong></p>
    <ol>
      <li>左侧栏新增图文教程页面，从脚本安装到数据导入细致教学。</li>
    </ol>

    <p><strong>五、导出脚本更新</strong></p>
    <ol>
      <li>茶叶自动导出：读取每个技能当前喝的茶，茶槽里有就导出，不跳过已过期茶叶。</li>
      <li>修复神龛：读取个人等级而非公会等级。</li>
      <li>房屋等级修正：当没修建房屋时会设置成0级，而非四级。</li>
    </ol>
    <p>📥 <a href="https://wormhole.app/44BX8p#04s85C2cWvQ0XOWNu51Lzw" target="_blank" style="color:#409eff">脚本下载（免梯子）</a> — 24小时有效（2026.7.16 2pm 发出）</p>

    <hr />

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

    <p><strong>三、社区功能</strong></p>
    <ol>
      <li>建议反馈：新增反馈页面，支持提交 Bug 报告和功能建议，数据直达维护者。</li>
      <li>中英双语：打赏页面和反馈页面全面支持中英文切换，海外玩家也能用。</li>
      <li>新赞助者：感谢 Laulau01（¥28.88）和 Blue（¥30）的支持！</li>
    </ol>
    <p style="color:#e6a23c">⚠ 请在打赏时留下您的游戏昵称，这很重要！！</p>
    <p style="color:#e6a23c">⚠ 今天打赏的微信名"空"的朋友请来找我认领游戏名称，我暂且将您命名为 Blue。</p>

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
