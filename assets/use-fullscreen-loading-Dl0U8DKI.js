import{a$ as _,k as m,f as g,s as n,q as r,au as f,G as l,ad as y,y as u,h as E}from"./vue-BaavM1Z4.js";import{_ as w}from"./_plugin-vue_export-helper-DlAUqK2U.js";const x={lock:!0,text:"加载中..."},p=(s,e={})=>{let a;return async(...c)=>{try{return a=_.service({...x,...e}),await s(...c)}finally{a.close()}}},C={code:0,data:{list:[]},message:"获取成功"};function S(s){return new Promise(e=>{setTimeout(()=>{e({...C,data:{list:s}})},1e3)})}function k(){return new Promise((s,e)=>{setTimeout(()=>{e(new Error("发生错误"))},1e3)})}const v={class:"app-container"},A=`
  <path class="path" d="
    M 30 15
    L 28 17
    M 25.61 25.61
    A 15 15, 0, 0, 1, 15 30
    A 15 15, 0, 1, 1, 27.99 7.5
    L 15 15
  " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
`,L=m({__name:"use-fullscreen-loading",setup(s){const e={text:"即将发生错误...",background:"#F56C6C20",svg:A,svgViewBox:"-10, -10, 50, 50"};async function a(){const o=await p(S)([1,2,3]);u.success(`${o.message}，传参为 ${o.data.list.toString()}`)}async function c(){try{await p(k,e)()}catch(o){u.error(o.message)}}return(o,t)=>{const i=f,d=y;return E(),g("div",v,[n(i,{shadow:"never"},{default:r(()=>t[0]||(t[0]=[l(" 该示例是演示：通过将要执行的函数传递给 composable，让 composable 自动开启全屏 loading，函数执行结束后自动关闭 loading ")])),_:1}),n(i,{header:"示例",shadow:"never"},{default:r(()=>[n(d,{type:"primary",onClick:a},{default:r(()=>t[1]||(t[1]=[l(" 查询成功 ")])),_:1}),n(d,{type:"danger",onClick:c},{default:r(()=>t[2]||(t[2]=[l(" 查询失败 ")])),_:1})]),_:1})])}}}),h=w(L,[["__scopeId","data-v-d330363c"]]);export{h as default};
