# DSH 外观插件集 · DeepSeek Harness Appearance Plugins

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(DSH)Web GUI 用的动态 Cordis 外观插件:换主题、养吉祥物、飘花瓣、状态面板……本仓库**只分发代码,不含任何第三方图片素材**——吉祥物/头像图一律由使用者自备。

| 目录 | 效果 | 素材情况 |
| --- | --- | --- |
| [`kuroneko-theme-plugin/`](./kuroneko-theme-plugin) | 黑猫品味:紫黑哥特主题(light/dark 双套)+ 手绘黑猫使魔(四表情)+ 紫光晕/黑蔷薇氛围 + 星屑诅咒雨 + 状态条 + 设置页 | 零素材,使魔为原创手绘 SVG |
| [`neko-catgirl-plugin/`](./neko-catgirl-plugin) | 猫娘:樱花粉主题 + 可戳猫娘使魔(四表情)+ 小鱼干雨 + 樱花飘落 + 状态条 + 设置页 | 默认原创手绘 SVG;自定义皮肤由使用者自备 |
| [`vamp-plugin/`](./vamp-plugin) | 傲娇吸血鬼:暗红哥特主题 + 可拖动状态面板(饱腹度/傲娇度/投喂互动)+ 玫瑰花瓣飘落 + Run 卡片 | 默认 CSS 手绘头像;自定义头像由使用者自备 |

## 搭配人格预设

外观插件只负责"皮",人格另由 agent preset 提供——见配套仓库 **[dsh-persona-presets](https://github.com/MisakaZentai/dsh-persona-presets)**(黑猫 / 猫娘 / 吸血鬼三个人格,与上方插件一一对应)。两者可任意组合:比如「黑猫模式」preset + 黑猫主题插件,或者把猫娘皮肤换到黑猫人格上(笑)。

## 安装 / 挂载

动态插件只活在当前进程里,进程重启即消失;源码在本仓库,随时一键复活:

1. 打开 DSH Web GUI,使用带 `cordis_*` 工具集的会话(如「创造模式」preset);
2. 用 `cordis_define` 定义插件:
   - `code.host` = 对应目录 `host.js` 的全部内容(kuroneko 没有 Host 半区,留空);
   - `code.client` = 对应目录 `client.js` 的全部内容;
3. `cordis_run` 激活。首次激活客户端插件需要在本页面允许授权;
4. 进程重启后重复以上步骤即可(把源码重新贴回),或直接对助手说「挂载 XX 插件」。

## 自定义吉祥物 / 头像

插件不带图。想用自己的图,在设置页/面板输入框里填(三选一):

- **直链 URL**:任何你能访问的 `https://...` 图片;
- **`data:` URI**:本地图片转 base64 后粘贴;
- **本机文件路径**:由插件 Host 半区读盘转码(DSH 进程需有该路径的读权限;vamp 目录附带 `crop-gif.ps1`,横版 GIF 可先裁成正方形)。

请只使用你拥有使用权的图片。

## 提交前自检

往本仓库提交前,先确认没有夹带私货(本机路径/令牌/账号):

```powershell
rg -n "C:[/\\]DSH|gho_|github_pat_|BEGIN.*PRIVATE|58793" .
git diff --cached --stat
```

出现任何本机路径或令牌匹配就停手,清干净再提交。

## 说明与许可

- 插件为**纯外观层**:不改动 agent 的任何能力、工具与安全约束;人格注入已全部移除,请使用配套 preset。
- 本仓库不含任何第三方图片素材(本地开发期用过的 GIF 素材已全部移除)。
- **非官方项目**:与 DeepSeek Harness 官方及原作版权方无任何关联。
- 代码按 `LICENSE`(MIT)授权;角色元素仅作同人致敬:黑猫/五更瑠璃出自《我的妹妹哪有这么可爱!》(伏见司 著,电击文库),版权归原作者与版权方所有,仅限**同人非商用**使用。
- 使用请遵守 DeepSeek Harness 及其依赖包各自的许可证。
