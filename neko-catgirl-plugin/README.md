# 猫娘外观插件 (neko-catgirl)

樱花粉猫娘主题的 DSH 动态外观插件:**纯外观,不含人格注入**。

- 全局樱花粉主题(light/dark 双套配色,停用自动还原)
- 右下角可戳猫娘使魔(原创手绘 SVG,四套表情;戳一下下小鱼干雨)
- 全屏光晕 + 樱花飘落
- 输入框下"思考中"状态条(跟随真实会话运行状态)
- 设置页(设置 → 猫娘模式):装饰开关、皮肤切换、自定义图片

## 文件

| 文件 | 作用 |
| --- | --- |
| `client.js` | Client 半区:主题 tokens、使魔 SVG、氛围、状态条、设置页;整体复制进 `cordis_define` 的 `code.client` |
| `host.js` | Host 半区:自定义皮肤读盘 RPC(`neko-skin`)+ 诊断工具 `neko_probe`;整体复制进 `code.host` |

## 使用

安装/挂载步骤见[仓库根 README](../README.md)。人格(自称"本喵"的说话方式)请使用配套 preset「猫娘模式」:[dsh-persona-presets/neko](https://github.com/MisakaZentai/dsh-persona-presets/tree/main/neko)。

## 自定义吉祥物皮肤

设置页把皮肤切到「自定义图片」,再填来源(三选一):

- 图片直链 URL / `data:` URI → 浏览器直接渲染;
- 本机文件路径 → 经 Host 的 `neko-skin` RPC 读盘转码。

本插件不带任何图片素材;请使用你拥有使用权的图片。

## 回滚

对助手说「停用猫娘」或执行 `cordis_stop`:主题、使魔、装饰一次性全部还原。
