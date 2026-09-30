# 猫娘外观插件 (neko-catgirl)

樱花粉猫娘主题的 DSH 外观插件 bundle:**纯外观,不含人格注入**。

- 全局樱花粉主题(light/dark 双套配色,停用自动还原)
- 右下角可戳猫娘使魔(原创手绘 SVG,四套表情;戳一下下小鱼干雨)
- 全屏光晕 + 樱花飘落
- 输入框下"思考中"状态条(跟随真实会话运行状态)
- 设置页(设置 → 猫娘模式):装饰开关、皮肤切换、自定义图片

## 文件

| 文件 | 作用 |
| --- | --- |
| `package.json` | bundle 清单:`dsh.bundle.patch` 指向补丁,`dsh.client` 把客户端半区放进浏览器 boot graph |
| `cordis.patch.yml` | insert 一个宿主行(行名即包名) |
| `index.js` | 宿主半区:纯客户端视觉插件,不做任何事 |
| `client.js` | 客户端半区:主题 tokens、使魔 SVG、氛围、状态条、设置页 |

## 使用

安装步骤见[仓库根 README](../README.md)。人格(自称"本喵"的说话方式)请使用配套 preset「猫娘模式」:[dsh-persona-presets/neko](https://github.com/MisakaZentai/dsh-persona-presets/tree/main/neko)。

## 自定义吉祥物皮肤

设置页把皮肤切到「自定义图片」,再填来源(二选一):

- 图片直链 `https://...` URL → 浏览器直接渲染;
- `data:` URI → 本地图片转 base64 后粘贴。

> 旧版还有第三条「填本机文件路径、由 Host 的 `neko-skin` RPC 读盘转码」。该通道依赖已移除的 `cordis_define` 动态插件工具集,0.2.0 起不再可用——本机图片请先转成 `data:` URI。

本插件不带任何图片素材;请使用你拥有使用权的图片。

## 卸载

本插件是持久化的 bundle,不是重启即消失的动态插件:在 Web 侧边栏的 **Plugins** 页面停用即可,主题、使魔、装饰一次性全部还原。
