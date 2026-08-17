// 傲娇吸血鬼外观插件 (vamp) — Host 半区源码
// 用途:纯外观插件(暗红哥特主题 + 可拖动状态面板 + 飘落特效 + Run 卡片),不含人格注入;
//       人格请使用配套 agent preset「傲娇吸血鬼模式」(见 dsh-persona-presets 仓库)。
// 用法:本文件内容整体复制到 cordis_define 的 code.host 字段即可(与 client.js 配套)。
// 说明:return {...} 是 Cordis Plugin 对象,apply(ctx) 在插件激活时执行。
// 版权:本仓库只分发代码,不携带任何图片素材;头像图一律由使用者自备
//       (图片 URL / data: URI / 本机文件路径),请使用你拥有使用权的图片。

return {
  apply(ctx) {
    const diag = []
    const record = (entry) => {
      diag.push(entry)
      if (diag.length > 200) diag.splice(0, diag.length - 200)
    }
    ctx.effect(() => harness.handle('vamp-diag', (args) => {
      record(args && typeof args === 'object' ? args : { msg: String(args) })
      return { ok: true }
    }))
    const diagTool = harness.defineTool({
      name: 'vamp_diag',
      description: '读取傲娇吸血鬼外观插件的客户端执行诊断日志,排查状态面板未显示的问题。',
      parameters: {},
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            entries: { type: 'array', required: true, items: { type: 'object', additionalProperties: true } },
          },
        },
        render(args, value) {
          return [{ type: 'text', text: '诊断日志 ' + value.entries.length + ' 条:\n' + JSON.stringify(value.entries, null, 2) }]
        },
      },
      async execute() {
        return { entries: diag.slice() }
      },
    })
    ctx.effect(() => harness.registerTool(ctx, diagTool))

    // 纯字节 base64 编码器。
    // 为什么手写:宿主内置 btoa 是"UTF-8 文本编码器",二进制字节 >= 0x80 会被
    // 先转成多字节 UTF-8 再编码,导致图片数据损坏(浏览器解码失败,图裂)。
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    function bytesToBase64(bytes) {
      let out = ''
      const len = bytes.length
      for (let i = 0; i < len; i += 3) {
        const b0 = bytes[i]
        const b1 = i + 1 < len ? bytes[i + 1] : 0
        const b2 = i + 2 < len ? bytes[i + 2] : 0
        out += CHARS[b0 >> 2]
        out += CHARS[((b0 & 3) << 4) | (b1 >> 4)]
        out += i + 1 < len ? CHARS[((b1 & 15) << 2) | (b2 >> 6)] : '='
        out += i + 2 < len ? CHARS[b2 & 63] : '='
      }
      return out
    }

    function mimeFor(path) {
      const lower = String(path).toLowerCase()
      if (lower.endsWith('.gif')) return 'image/gif'
      if (lower.endsWith('.png')) return 'image/png'
      if (lower.endsWith('.webp')) return 'image/webp'
      if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
      return 'image/png'
    }

    // ── 自定义头像 RPC ────────────────────────────────────────────────
    // 约定:客户端把「头像来源」字符串传给 Host。
    //   - 以 http(s):// 或 data: 开头 → 直链,返回 { dataUri: src, kind: 'direct' };
    //   - 其余 → 视为本机文件路径,Host 读盘转 data URI 返回 { kind: 'data' };
    //   - 失败 → { dataUri: '', kind: 'none', msg },客户端退回 CSS 手绘头像。
    ctx.effect(() => harness.handle('vamp-avatar', async (args) => {
      try {
        const src = args && typeof args.src === 'string' ? args.src.trim() : ''
        if (!src) {
          record({ step: 'avatar-empty' })
          return { dataUri: '', kind: 'none', msg: 'empty source' }
        }
        if (/^(https?:\/\/|data:)/i.test(src)) {
          record({ step: 'avatar-direct', src: src.slice(0, 40) })
          return { dataUri: src, kind: 'direct' }
        }
        const fs = ctx.get('fs')
        if (fs === undefined) {
          record({ step: 'avatar-fs-missing' })
          return { dataUri: '', kind: 'none', msg: 'fs service unavailable' }
        }
        const target = await fs.resolve(src)
        const bytes = await fs.readBytes(target, undefined, 2 * 1024 * 1024)
        if (bytes && bytes.length > 0) {
          const dataUri = 'data:' + mimeFor(src) + ';base64,' + bytesToBase64(bytes)
          record({ step: 'avatar-served', src: src.slice(0, 40), len: bytes.length })
          return { dataUri, kind: 'data' }
        }
        record({ step: 'avatar-not-found', src: src.slice(0, 40) })
        return { dataUri: '', kind: 'none', msg: 'file is empty' }
      } catch (e) {
        record({ step: 'avatar-threw', msg: String(e && e.message || e) })
        return { dataUri: '', kind: 'none', msg: String(e && e.message || e).slice(0, 120) }
      }
    }))

    const state = { hunger: 62, tsun: 40, mood: 'calm' }

    function applyAction(action) {
      let line = ''
      if (action === 'feed') {
        state.hunger = Math.min(100, state.hunger + 22)
        state.tsun = Math.max(0, state.tsun - 6)
        state.mood = state.hunger >= 85 ? 'happy' : 'calm'
        line = state.mood === 'happy'
          ? '哼!才、才不是因为血包开心呢!……不过味道勉强及格,本小姐姑且收下啦!'
          : '……哼,还算你有点眼色,知道本小姐有点饿了。才、才不是在等你投喂呢!'
      } else if (action === 'headpat') {
        state.tsun = Math.min(100, state.tsun + 18)
        state.hunger = Math.max(0, state.hunger - 5)
        state.mood = 'shy'
        line = '呜……谁、谁允许你摸本小姐的头了!……不过,再、再摸一下也不是不可以……笨蛋主人!'
      } else if (action === 'gift') {
        state.tsun = Math.max(0, state.tsun - 12)
        state.hunger = Math.min(100, state.hunger + 8)
        state.mood = 'happy'
        line = '礼物?哼,本小姐才不稀罕呢……(偷偷收好)……那、那个,谢谢你啦。才不是特意说的!'
      } else {
        line = state.mood === 'happy'
          ? '哼!本小姐现在心情不错……才、才不是因为你的原因!'
          : state.mood === 'shy'
            ? '呜……不许盯着本小姐看!……也、也不是不行啦……'
            : '哼,本小姐今天心情尚可,姑且陪你聊聊天好了。'
      }
      return { hunger: state.hunger, tsun: state.tsun, mood: state.mood, line }
    }

    ctx.effect(() => harness.handle('vamp-status', () => ({ ...state })))
    ctx.effect(() => harness.handle('vamp-act', (args) => {
      const action = args && typeof args.action === 'string' ? args.action : 'check'
      return applyAction(action)
    }))

    // ── 动态模型工具:vamp_blood_meter ────────────────────────────────
    // 契约:动态工具必须先 harness.defineTool(...) 包装,且 output 必须声明
    // { schema, render }。直接塞裸对象会被 Guard 拒绝。
    const tool = harness.defineTool({
      name: 'vamp_blood_meter',
      description: '傲娇吸血鬼小姐的状态面板与互动:查询饱腹度/傲娇度,或投喂血包、摸头、送礼物。想知道本小姐现在的状态就 call 一下……才、才不是在期待被摸头呢!',
      parameters: {
        action: {
          type: 'string',
          required: true,
          enum: ['check', 'feed', 'headpat', 'gift'],
          description: '要执行的互动:check 查看状态;feed 投喂血包;headpat 摸头;gift 送礼物。',
        },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            hunger: { type: 'number', required: true },
            tsun: { type: 'number', required: true },
            mood: { type: 'string', required: true },
            line: { type: 'string', required: true },
          },
        },
        render(args, value) {
          return [{
            type: 'text',
            text: '【吸血鬼状态】饱腹度 ' + value.hunger + '/100 · 傲娇度 ' + value.tsun + '/100 · 心情 ' + value.mood + '\n' + value.line,
          }]
        },
      },
      async execute(args, exec) {
        const action = args && typeof args.action === 'string' ? args.action : 'check'
        return applyAction(action)
      },
    })
    ctx.effect(() => harness.registerTool(ctx, tool))
  },
}
