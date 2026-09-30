# DSH 外观插件集 · DeepSeek Harness Appearance Plugins

给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)(DSH)Web GUI 用的外观插件 bundle:换主题、养吉祥物、飘花瓣、状态面板……本仓库**只分发代码,不含任何第三方图片素材**——吉祥物/头像图一律由使用者自备。

| 目录 | 效果 | 素材情况 |
| --- | --- | --- |
| [`kuroneko-theme-plugin/`](./kuroneko-theme-plugin) | 黑猫品味:紫黑哥特主题(light/dark 双套)+ 手绘黑猫使魔(四表情)+ 紫光晕/黑蔷薇氛围 + 星屑诅咒雨 + 状态条 + 设置页 | 零素材,使魔为原创手绘 SVG |
| [`neko-catgirl-plugin/`](./neko-catgirl-plugin) | 猫娘:樱花粉主题 + 可戳猫娘使魔(四表情)+ 小鱼干雨 + 樱花飘落 + 状态条 + 设置页 | 默认原创手绘 SVG;自定义皮肤由使用者自备 |
| [`vamp-plugin/`](./vamp-plugin) | 傲娇吸血鬼:暗红哥特主题 + 可拖动状态面板(饱腹度/傲娇度/投喂互动)+ 玫瑰花瓣飘落 + Run 卡片 | 默认 CSS 手绘头像;自定义头像由使用者自备 |

## 搭配人格预设

外观插件只负责"皮",人格另由 agent preset 提供——见配套仓库 **[dsh-persona-presets](https://github.com/MisakaZentai/dsh-persona-presets)**(黑猫 / 猫娘 / 吸血鬼三个人格,与上方插件一一对应)。两者可任意组合:比如「黑猫模式」preset + 黑猫主题插件,或者把猫娘皮肤换到黑猫人格上(笑)。

## 版本要求

本仓库自 2026-09-30 起使用 **DSH 0.2.0 及以后**的插件 bundle 格式。

旧版依赖 `cordis_define` / `cordis_run` 动态插件工具集把源码粘进会话——**该工具集在 0.2.0 已被移除**(只剩 `cordis_inspect_list` / `cordis_inspect_query`),因此旧安装方式不再可用。现在每个目录都是一个可直接安装的 bundle,重启后依然在。

## 安装

在 DSH 0.2.0+ 上,把想要的插件目录作为 bundle 装进 profile。三选一:

**方式 A · 让助手装(推荐)** — 在「创造模式」等带 `plugin_manager` 的会话里说:

> 用 plugin_manager 的 install_bundle 安装 `C:\path\to\dsh-appearance-plugins\kuroneko-theme-plugin`

**方式 B · Web 侧边栏** — 打开侧边栏的 **Plugins** 页面安装本地目录。

**方式 C · 命令行**

```powershell
# <profile> 换成你的 profile 名(web / desktop / …)
dsh plugin --profile <profile> add C:\path\to\dsh-appearance-plugins\kuroneko-theme-plugin
```

装完重启 DSH(或刷新页面)即可看到效果。客户端半区加载时,页面会请求一次授权。

## 目录结构

```
kuroneko-theme-plugin/
├── package.json       # bundle 清单:dsh.bundle.patch + dsh.client
├── cordis.patch.yml   # insert 一个宿主行,行名就是包名
├── index.js           # 宿主半区(纯客户端视觉插件,这里不做任何事)
└── client.js          # 客户端半区:全部界面都在这里
```

`dsh.client` 段是客户端半区进入浏览器 boot graph 的关键;`index.js` 只是让宿主那一行有东西可挂。

## 自定义吉祥物 / 头像

插件不带图。想用自己的图,在设置页/面板输入框里填(二选一):

- **直链 URL**:任何你能访问的 `https://...` 图片;
- **`data:` URI**:本地图片转 base64 后粘贴。

> 0.2.0 移除了 `cordis_define`,顺带失去了「填本机文件路径、由 Host 半区读盘转码」这条通道——bundle 形态的客户端插件没有通用的宿主调用桥。本机图片请先转成 `data:` URI(一张图一次即可)。
>
> `vamp-plugin/crop-gif.ps1` 仍可用于把横版 GIF 裁成正方形。

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
