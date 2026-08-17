# 黑猫领域主题插件 (kuroneko-theme)

†千葉の堕天聖黒猫† —— 五更瑠璃(黑猫)品味的紫黑哥特外观插件。**纯 Client 半区、零图片素材**,是三个插件里唯一可以直接放心 fork 的。

## 能力一览

| 能力 | 实现 |
| --- | --- |
| 全局紫黑哥特主题(light/dark 双套) | `theme.overrideTokens('kuroneko', tokens)` |
| 全量次生 CSS 变量兜底 | `styles.insert`(var() 别名到官方 token) |
| 全屏氛围(紫光晕 + 黑蔷薇 + 星屑 + 残月) | `shell.overlay(kuroneko-ambient)` |
| 星屑诅咒雨(点击使魔/按钮触发) | `shell.overlay(kuroneko-rain)` |
| 手绘黑猫使魔(夜魔女王形态,四表情,可戳) | `shell.overlay(kuroneko-mascot)`,原创手绘 SVG |
| 输入框下黑猫状态条(跟随真实运行状态) | `conversation.composer.dock(kuroneko-strip)` |
| 设置页(设置 → 黑猫领域) | `settings.section(kuroneko)` |
| Run 卡片内面板 | `tool.view.cordis(key: self)` |

## 配色

- 浅色模式 = 月白蕾丝(白猫):`#f4f0fa` 系,深紫点缀 `#6d3fc0`
- 深色模式 = 堕天之夜(黑猫):`#0f0a18` 系,亮紫点缀 `#a78bfa`

## 文件

| 文件 | 作用 |
| --- | --- |
| `client.js` | Client 半区(唯一文件,无 Host 半区、无网络依赖);整体复制进 `cordis_define` 的 `code.client` |

## 使用

安装/挂载步骤见[仓库根 README](../README.md)。人格(自称「妾身」、称呼用户「哥哥」的五更瑠璃)请使用配套 preset「黑猫模式」:[dsh-persona-presets/gokou-ruri](https://github.com/MisakaZentai/dsh-persona-presets/tree/main/gokou-ruri)。

## 回滚

对助手说「停用黑猫」即可:主题、使魔、装饰一次性全部还原。
