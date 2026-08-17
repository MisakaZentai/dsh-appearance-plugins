// 猫娘外观插件 (neko-catgirl) — Host 半区源码
// 用途:纯外观插件(樱花粉主题 + 猫娘吉祥物 + 状态条 + 小鱼干雨),不含人格注入;
//       人格请使用配套 agent preset「猫娘模式」(见 dsh-persona-presets 仓库)。
// 用法:本文件内容整体复制到 cordis_define 的 code.host 字段即可(与 client.js 配套)。
// 说明:return {...} 是 Cordis Plugin 对象,apply(ctx) 在插件激活时执行。
// 版权:本仓库只分发代码,不携带任何图片素材;吉祥物皮肤图一律由使用者自备
//       (图片 URL / data: URI / 本机文件路径),请使用你拥有使用权的图片。

return {
  apply(ctx) {
    // 纯字节 base64 编码器。
    // 为什么手写:宿主内置 btoa 是"UTF-8 文本编码器",二进制字节 >= 0x80 会被
    // 先转成多字节 UTF-8 再编码,导致图片数据损坏(浏览器解码失败,图裂)。
    function bytesToBase64(bytes) {
      const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
      const parts = []
      for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i]
        const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0
        const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0
        parts.push(
          table[b0 >> 2],
          table[((b0 & 3) << 4) | (b1 >> 4)],
          i + 1 < bytes.length ? table[((b1 & 15) << 2) | (b2 >> 6)] : '=',
          i + 2 < bytes.length ? table[b2 & 63] : '=',
        )
      }
      return parts.join('')
    }

    function mimeFor(path) {
      const lower = String(path).toLowerCase()
      if (lower.endsWith('.gif')) return 'image/gif'
      if (lower.endsWith('.png')) return 'image/png'
      if (lower.endsWith('.webp')) return 'image/webp'
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
      return 'image/png'
    }

    // ── 吉祥物皮肤 RPC ────────────────────────────────────────────────
    // 约定:客户端把「皮肤来源」字符串传给 Host。
    //   - 以 http(s):// 或 data: 开头 → 视为直链,返回 { kind: 'direct' },客户端直接渲染;
    //   - 其余 → 视为本机文件路径,Host 读盘转 data URI,返回 { kind: 'data', dataUri };
    //   - 读取失败 → { kind: 'none', msg: ... },客户端显示错误气泡。
    const fs = ctx.get('fs')
    if (fs !== undefined) {
      ctx.effect(() => harness.handle('neko-skin', async (args) => {
        const src = args && typeof args.src === 'string' ? args.src.trim() : ''
        if (!src) return { kind: 'none', msg: 'empty source' }
        if (/^(https?:\/\/|data:)/i.test(src)) return { kind: 'direct' }
        try {
          const target = await fs.resolve(src)
          const bytes = await fs.readBytes(target, undefined, 4 * 1024 * 1024)
          if (!bytes || bytes.length === 0) return { kind: 'none', msg: 'file is empty' }
          return { kind: 'data', dataUri: 'data:' + mimeFor(src) + ';base64,' + bytesToBase64(bytes) }
        } catch (err) {
          return { kind: 'none', msg: String(err && err.message ? err.message : err).slice(0, 120) }
        }
      }))

      // ── 诊断探针工具(排查本机读图链路用)────────────────────────────
      // 注意契约:动态工具必须先 harness.defineTool(...) 包装,
      // 且 output 必须声明 { schema, render }。直接塞裸对象会被 Guard 拒绝。
      const probeTool = harness.defineTool({
        name: 'neko_probe',
        description: '诊断探针:测试本插件 Host 半区能否读取本机图片文件并 base64 编码,报告每一步结果。',
        parameters: {
          type: 'object',
          properties: {
            path: { type: 'string', description: '要读取的本地图片文件路径' },
          },
          required: ['path'],
        },
        output: {
          schema: {
            type: 'object',
            properties: {
              path: { type: 'string' },
              stage: { type: 'string' },
              resolveOk: { type: 'boolean' },
              targetKey: { type: 'string' },
              statFound: { type: 'boolean' },
              size: { type: 'number' },
              bytes: { type: 'number' },
              first6: { type: 'string' },
              b64Len: { type: 'number' },
              expectedB64Len: { type: 'number' },
              error: { type: 'string' },
            },
            additionalProperties: true,
          },
          render(args, value) {
            return [{ type: 'text', text: JSON.stringify(value) }]
          },
        },
        execute: async (args) => {
          const out = { path: args.path, stage: 'start' }
          try {
            const target = await fs.resolve(args.path)
            out.resolveOk = true
            out.targetKey = String(target.targetKey).slice(0, 60)
            out.stage = 'resolved'
            const stat = await fs.stat(target)
            out.statFound = stat !== undefined
            out.size = stat && stat.size
            out.stage = 'statted'
            const bytes = await fs.readBytes(target, undefined, 4 * 1024 * 1024)
            out.bytes = bytes.length
            out.stage = 'read'
            let first = ''
            for (let i = 0; i < Math.min(6, bytes.length); i++) first += String.fromCharCode(bytes[i])
            out.first6 = first
            out.b64Len = bytesToBase64(bytes).length
            out.expectedB64Len = Math.ceil(bytes.length / 3) * 4
            out.stage = 'encoded'
          } catch (err) {
            out.error = String(err && err.message ? err.message : err)
          }
          return out
        },
      })
      ctx.effect(() => harness.registerTool(ctx, probeTool))
    }
  },
}
