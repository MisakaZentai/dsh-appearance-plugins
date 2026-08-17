# 傲娇吸血鬼外观插件 (vamp)

暗红哥特主题的 DSH 动态外观插件:**纯外观,不含人格注入**。

- 全局暗红哥特主题(官方 token 覆盖 + 全量 CSS 变量兜底)
- 右下角可拖动状态面板:饱腹度/傲娇度进度条、投喂血包/摸头/送礼物互动、可收起成头像小球
- 全屏玫瑰花瓣飘落(花瓣/黑心/血滴)
- Run 卡片内面板(历史可回看)
- 动态模型工具 `vamp_blood_meter`(查询/互动状态)

## 文件

| 文件 | 作用 |
| --- | --- |
| `client.js` | Client 半区:主题、面板、飘落特效、Run 卡片;整体复制进 `cordis_define` 的 `code.client` |
| `host.js` | Host 半区:状态与互动 RPC、自定义头像读盘 RPC(`vamp-avatar`)、诊断工具 `vamp_diag`、`vamp_blood_meter`;整体复制进 `code.host` |
| `crop-gif.ps1` | 可选工具:把横版 GIF 逐帧裁成正方形(给自备头像用) |

## 使用

安装/挂载步骤见[仓库根 README](../README.md)。人格(自称"本小姐"的傲娇吸血鬼)请使用配套 preset「傲娇吸血鬼模式」:[dsh-persona-presets/vamp](https://github.com/MisakaZentai/dsh-persona-presets/tree/main/vamp)。

## 自定义头像

面板底部的输入框填入来源(三选一):

- 图片直链 URL / `data:` URI → 浏览器直接渲染;
- 本机文件路径 → 经 Host 的 `vamp-avatar` RPC 读盘转码(横版 GIF 先用 `crop-gif.ps1` 裁方);
- 留空 → 使用内置 CSS 手绘头像。

本插件不带任何图片素材;请使用你拥有使用权的图片。

## 回滚

`cordis_stop` 即可:主题、面板、特效一次性全部还原。
