# 傲娇吸血鬼外观插件 (vamp)

暗红哥特主题的 DSH 外观插件 bundle:**纯外观,不含人格注入**。

- 全局暗红哥特主题(官方 token 覆盖 + 全量 CSS 变量兜底)
- 右下角可拖动状态面板:饱腹度/傲娇度进度条、投喂血包/摸头/送礼物互动、可收起成头像小球
- 全屏玫瑰花瓣飘落(花瓣/黑心/血滴)
- Run 卡片内面板(历史可回看)

## 文件

| 文件 | 作用 |
| --- | --- |
| `package.json` | bundle 清单:`dsh.bundle.patch` 指向补丁,`dsh.client` 把客户端半区放进浏览器 boot graph |
| `cordis.patch.yml` | insert 一个宿主行(行名即包名) |
| `index.js` | 宿主半区:纯客户端视觉插件,不做任何事 |
| `client.js` | 客户端半区:主题、面板、状态机、飘落特效、Run 卡片 |
| `crop-gif.ps1` | 可选工具:把横版 GIF 逐帧裁成正方形(给自备头像用) |

## 使用

安装步骤见[仓库根 README](../README.md)。人格(自称"本小姐"的傲娇吸血鬼)请使用配套 preset「傲娇吸血鬼模式」:[dsh-persona-presets/vamp](https://github.com/MisakaZentai/dsh-persona-presets/tree/main/vamp)。

## 状态面板

饱腹度/傲娇度由**客户端自己持有**,并写入 `localStorage`(键 `dsh-vamp:state:v1`),刷新页面与重启进程都保留。投喂/摸头/送礼物的判定逻辑与原宿主半区版本逐字一致。

> 迁移说明:旧版的血量表状态与 `vamp_blood_meter` 动态模型工具都依赖 `cordis_define` 的 Host RPC,该工具集在 0.2.0 已移除。状态机因此搬进客户端,动态工具不再提供(它本就是调试用的)。

## 自定义头像

面板底部的输入框填入来源(二选一):

- 图片直链 `https://...` URL → 浏览器直接渲染;
- `data:` URI → 本地图片转 base64 后粘贴(横版 GIF 可先用 `crop-gif.ps1` 裁方);
- 留空 → 使用内置 CSS 手绘头像。

> 旧版还有一条「填本机文件路径、由 Host 的 `vamp-avatar` RPC 读盘转码」,随 `cordis_define` 一并移除。

本插件不带任何图片素材;请使用你拥有使用权的图片。

## 卸载

本插件是持久化的 bundle,不是重启即消失的动态插件:在 Web 侧边栏的 **Plugins** 页面停用即可,主题、面板、特效一次性全部还原。
