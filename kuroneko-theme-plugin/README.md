# 黑猫领域主题插件 (kuroneko-theme)

†千葉の堕天聖黒猫† —— 五更瑠璃(黑猫)品味的紫黑哥特外观插件。**纯客户端、零图片素材**,是三个插件里唯一可以直接放心 fork 的。

## 能力一览

| 能力 | 实现 |
| --- | --- |
| 全局紫黑哥特主题(light/dark 双套) | `theme.overrideTokens('kuroneko', tokens)` |
| 全量次生 CSS 变量兜底 | `insertCss`(自插 `<style>`,var() 别名到官方 token) |
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
| `package.json` | bundle 清单:`dsh.bundle.patch` 指向补丁,`dsh.client` 把客户端半区放进浏览器 boot graph |
| `cordis.patch.yml` | insert 一个宿主行(行名即包名) |
| `index.js` | 宿主半区:纯客户端视觉插件,不做任何事 |
| `client.js` | 客户端半区:全部界面都在这里,无网络依赖、不读本机文件 |

## 使用

安装步骤见[仓库根 README](../README.md)。人格(自称「我」、称呼用户「哥哥」的五更瑠璃)请使用配套 preset「黑猫模式」:[dsh-persona-presets/gokou-ruri](https://github.com/MisakaZentai/dsh-persona-presets/tree/main/gokou-ruri)。

## 卸载

本插件是持久化的 bundle,不是重启即消失的动态插件:在 Web 侧边栏的 **Plugins** 页面停用即可,主题、使魔、装饰一次性全部还原。
