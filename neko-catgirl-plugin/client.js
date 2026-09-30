// @local/dsh-appearance-neko-catgirl — Client 半区(0.2.0 bundle 形态)。
// 由 cordis_define 粘贴式迁移而来。除环境接口外还做了一处设计变更:
// 原来经宿主半区 RPC 完成的事情改为在客户端自足完成 ——
//   · 图片来源只支持 https:// 直链与 data: URI(不再读本机文件)
//   · vamp 的状态机(饱腹度/傲娇度)搬到客户端并落 localStorage
// bundle 形态下 window/document/localStorage 可用;定时器仍用 ctx.interval / ctx.timeout。
window.__ModuleLoader__.load({
  id: '@local/dsh-appearance-neko-catgirl',
  factory: (require) => {
    const React = require('react')

    // ── 样式注入 ──────────────────────────────────────────────────────────
    // 客户端没有 styles 服务:旧代码里的 styles.insert 在 bundle 形态下会抛
    // ReferenceError。改为自己插 <style>,返回值仍是 disposer,ctx.effect 语义不变。
    function insertCss(css) {
      const el = document.createElement('style')
      el.textContent = css
      document.head.appendChild(el)
      return () => { if (el.parentNode !== null) el.parentNode.removeChild(el) }
    }

    return {
      inject: ['timer'],
      apply(ctx) {
        const theme = ctx.theme
        const slots = ctx.slots

        // ── 插件内共享 store(内存态,重启即清,故意不做持久化)──────────────
        const store = {
          decoOn: true,
          petalsOn: true,
          thinkOn: true,
          skin: 'draw',
          skinSrc: '',
          burst: 0,
          rain: [],
          listeners: [],
          emit() { for (const fn of this.listeners) fn() },
          subscribe(fn) { this.listeners.push(fn); return () => { this.listeners = this.listeners.filter((x) => x !== fn) } },
          set(field, value) { this[field] = value; this.emit() },
          rainOf(chars) {
            const items = []
            for (let i = 0; i < 20; i++) {
              items.push({
                key: this.burst + '-' + i,
                char: chars[i % chars.length],
                left: (Math.random() * 94 + 3).toFixed(1) + 'vw',
                delay: (Math.random() * 0.35).toFixed(2),
                size: Math.round(Math.random() * 12 + 14),
                spin: Math.round((Math.random() < 0.5 ? -1 : 1) * (Math.random() * 280 + 140)),
              })
            }
            this.burst++
            this.rain = items
            this.emit()
          },
        }

        function useStoreField(field) {
          const [value, setValue] = React.useState(store[field])
          React.useEffect(() => store.subscribe(() => setValue(store[field])), [field])
          return value
        }

        // ── 樱花粉主题(light/dark 双套;overrideTokens 返回 disposer,自动可逆)──
        const tokens = {
          '--dsw-alias-bg-base': { light: '#fff6fa', dark: '#2a1520' },
          '--dsw-alias-bg-layer-1': { light: '#ffeef5', dark: '#331a27' },
          '--dsw-alias-bg-layer-2': { light: '#ffe4ef', dark: '#3d2130' },
          '--dsw-alias-bg-overlay': { light: '#fff0f7', dark: '#412637' },
          '--dsw-alias-border-l1': { light: '#f6d7e5', dark: '#5b3348' },
          '--dsw-alias-border-l2': { light: '#efb9d2', dark: '#7c4a63' },
          '--dsw-alias-brand-primary': { light: '#e85d9e', dark: '#ff8fc0' },
          '--dsw-alias-label-primary': { light: '#43202f', dark: '#ffe3ef' },
          '--dsw-alias-label-secondary': { light: '#8f5e74', dark: '#c99fb2' },
          '--dsw-alias-state-error-primary': { light: '#d94f6b', dark: '#ff7a8e' },
          '--dsw-alias-state-success-primary': { light: '#2f9e6e', dark: '#4fd09a' },
          '--dsw-alias-state-warn-primary': { light: '#c0852f', dark: '#e6b257' },
          '--dsw-specific-sidebar-fill': { light: '#ffe9f3', dark: '#2f1824' },
        }

        if (theme !== undefined) {
          ctx.effect(() => theme.overrideTokens('neko', tokens))
        }

        ctx.effect(() => insertCss(`
    @keyframes neko-float { 0%, 100% { transform: translateY(0) rotate(0deg); } 30% { transform: translateY(-6px) rotate(-1.6deg); } 70% { transform: translateY(-3px) rotate(1.6deg); } }
    @keyframes neko-paw { 0% { opacity: 0; transform: translate(0, 0) scale(0.6); } 30% { opacity: 1; } 100% { opacity: 0; transform: translate(-46px, -20px) scale(1); } }
    @keyframes neko-blink { 0%, 90%, 100% { transform: scaleY(1); } 93%, 96% { transform: scaleY(0.08); } }
    @keyframes neko-ear-l { 0%, 86%, 100% { transform: rotate(0deg); } 90%, 94% { transform: rotate(-10deg); } }
    @keyframes neko-ear-r { 0%, 86%, 100% { transform: rotate(0deg); } 90%, 94% { transform: rotate(10deg); } }
    @keyframes neko-bow-bob { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(5deg); } }
    @keyframes neko-heart { 0% { opacity: 0; transform: translateY(6px) scale(0.4); } 25% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; transform: translateY(-20px) scale(1.15); } }
    @keyframes neko-drift { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(6vw, 4vh, 0) scale(1.15); } }
    @keyframes neko-petal-fall { 0% { transform: translate3d(0, -8vh, 0) rotate(0deg); opacity: 0; } 10% { opacity: 0.7; } 55% { transform: translate3d(7vw, 48vh, 0) rotate(170deg); opacity: 0.55; } 100% { transform: translate3d(-5vw, 108vh, 0) rotate(350deg); opacity: 0.1; } }
    @keyframes neko-think-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-6deg); } }
    @keyframes neko-dot { 0%, 100% { opacity: 0.25; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
    @keyframes neko-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes neko-rain-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 6% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(118vh) rotate(var(--neko-spin, 300deg)); opacity: 0; } }
    @keyframes neko-tail-css { 0%, 100% { transform: rotate(8deg); } 50% { transform: rotate(-10deg); } }
    @keyframes neko-poke { 0% { transform: scale(1); } 30% { transform: scale(1.1, 0.88); } 55% { transform: scale(0.93, 1.06); } 75% { transform: scale(1.05, 0.96); } 100% { transform: scale(1); } }
    .neko-mascot { position: fixed; right: 18px; bottom: 18px; z-index: 99999; user-select: none; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .neko-card { position: relative; background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; padding: 10px 14px 10px 10px; box-shadow: 0 8px 24px rgba(232, 93, 158, 0.18); animation: neko-float 3.2s ease-in-out infinite; display: flex; align-items: center; gap: 8px; pointer-events: auto; cursor: pointer; }
    .neko-card.poked { animation: neko-float 3.2s ease-in-out infinite, neko-poke 0.7s ease-out 1; }
    .neko-svg { width: 58px; height: 58px; display: block; transition: transform 0.25s ease; }
    .neko-svg-box { display: block; line-height: 0; }
    .neko-gif { width: 72px; height: 72px; object-fit: contain; display: block; border-radius: 12px; background: var(--dsw-alias-bg-layer-2); }
    .neko-card:hover .neko-svg, .neko-card:hover .neko-gif { transform: rotate(-5deg) scale(1.07); }
    .neko-eyes { transform-box: view-box; transform-origin: 60px 58px; animation: neko-blink 4.2s ease-in-out infinite; }
    .neko-ear-l { transform-box: view-box; transform-origin: 40px 26px; animation: neko-ear-l 5s ease-in-out infinite; }
    .neko-ear-r { transform-box: view-box; transform-origin: 80px 26px; animation: neko-ear-r 5s ease-in-out infinite; }
    .neko-bow-bob { transform-box: view-box; transform-origin: 60px 87px; animation: neko-bow-bob 3.4s ease-in-out infinite; }
    .neko-tail { position: absolute; left: -16px; bottom: -4px; width: 28px; height: 41px; pointer-events: none; z-index: -1; animation: neko-tail-css 2.6s ease-in-out infinite; transform-origin: 92% 96%; }
    .neko-bubble { font-size: 12px; color: var(--dsw-alias-label-primary); white-space: nowrap; }
    .neko-bubble.neko-bubble-err { color: var(--dsw-alias-state-error-primary); max-width: 220px; white-space: normal; }
    .neko-hearts { display: flex; gap: 4px; padding-right: 4px; }
    .neko-heart { font-size: 12px; opacity: 0; animation: neko-heart 2.8s ease-out infinite; }
    .neko-heart:nth-child(2) { animation-delay: 1.4s; }
    .neko-paws { display: flex; gap: 8px; align-items: flex-end; padding-right: 6px; pointer-events: none; }
    .neko-paw { font-size: 14px; color: var(--dsw-alias-brand-primary); opacity: 0; animation: neko-paw 2.4s ease-out infinite; }
    .neko-paw:nth-child(2) { animation-delay: 0.8s; }
    .neko-paw:nth-child(3) { animation-delay: 1.6s; }
    .neko-ambient { position: fixed; inset: 0; z-index: 9000; pointer-events: none; overflow: hidden; }
    .neko-blob { position: fixed; border-radius: 50%; filter: blur(70px); opacity: 0.3; pointer-events: none; animation: neko-drift 26s ease-in-out infinite alternate; }
    .neko-blob-1 { width: 46vw; height: 46vw; left: -12vw; top: -14vw; background: radial-gradient(circle at 30% 30%, #ff9ec2, transparent 70%); }
    .neko-blob-2 { width: 40vw; height: 40vw; right: -10vw; bottom: -12vw; background: radial-gradient(circle at 60% 40%, #ffc9de, transparent 70%); animation-delay: -8s; animation-duration: 32s; }
    .neko-blob-3 { width: 30vw; height: 30vw; left: 38vw; top: 30vh; background: radial-gradient(circle at 50% 50%, #ffd6ec, transparent 70%); animation-delay: -16s; animation-duration: 38s; opacity: 0.22; }
    .neko-petal { position: fixed; top: -6vh; width: 12px; height: 14px; background: linear-gradient(135deg, #ffc4da, #ff8fc0); border-radius: 150% 0 150% 0; opacity: 0; animation: neko-petal-fall linear infinite; pointer-events: none; }
    .neko-petal:nth-child(1) { left: 6%; animation-duration: 11s; animation-delay: 0s; }
    .neko-petal:nth-child(2) { left: 14%; animation-duration: 13s; animation-delay: -3s; width: 15px; height: 17px; }
    .neko-petal:nth-child(3) { left: 22%; animation-duration: 10s; animation-delay: -6s; }
    .neko-petal:nth-child(4) { left: 30%; animation-duration: 15s; animation-delay: -9s; width: 10px; height: 12px; }
    .neko-petal:nth-child(5) { left: 38%; animation-duration: 12s; animation-delay: -1s; }
    .neko-petal:nth-child(6) { left: 46%; animation-duration: 16s; animation-delay: -5s; width: 14px; height: 16px; }
    .neko-petal:nth-child(7) { left: 54%; animation-duration: 11.5s; animation-delay: -8s; }
    .neko-petal:nth-child(8) { left: 62%; animation-duration: 14s; animation-delay: -2s; width: 16px; height: 18px; }
    .neko-petal:nth-child(9) { left: 70%; animation-duration: 12.5s; animation-delay: -7s; }
    .neko-petal:nth-child(10) { left: 78%; animation-duration: 17s; animation-delay: -4s; width: 11px; height: 13px; }
    .neko-petal:nth-child(11) { left: 86%; animation-duration: 13.5s; animation-delay: -10s; }
    .neko-petal:nth-child(12) { left: 94%; animation-duration: 15.5s; animation-delay: -6.5s; width: 13px; height: 15px; }
    .neko-rain { position: fixed; inset: 0; z-index: 9998; pointer-events: none; overflow: hidden; }
    .neko-rain-item { position: fixed; top: -8vh; animation: neko-rain-fall 2.6s cubic-bezier(0.3, 0.6, 0.7, 1) forwards; }
    .neko-strip { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; padding: 3px 10px; margin-left: 8px; }
    .neko-strip-busy { color: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); }
    .neko-think { display: inline-block; animation: neko-think-bob 0.9s ease-in-out infinite; }
    .neko-dots { display: inline-flex; gap: 2px; }
    .neko-dots i { width: 3px; height: 3px; border-radius: 50%; background: currentColor; animation: neko-dot 1.2s ease-in-out infinite; }
    .neko-dots i:nth-child(2) { animation-delay: 0.2s; }
    .neko-dots i:nth-child(3) { animation-delay: 0.4s; }
    .neko-sparkle { display: inline-block; animation: neko-spin 1.6s linear infinite; }
    .neko-settings { display: flex; flex-direction: column; gap: 10px; padding: 12px 0; max-width: 520px; }
    .neko-settings-title { font-size: 16px; font-weight: 600; color: var(--dsw-alias-label-primary); }
    .neko-settings-sub { font-size: 12px; color: var(--dsw-alias-label-secondary); margin-top: -6px; }
    .neko-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); }
    .neko-row-label { font-size: 13px; color: var(--dsw-alias-label-primary); }
    .neko-toggle { border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-secondary); border-radius: 999px; padding: 4px 12px; font-size: 12px; cursor: pointer; }
    .neko-toggle.on { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); color: #ffffff; }
    .neko-fish-btn { align-self: flex-start; border: 1px solid var(--dsw-alias-brand-primary); background: transparent; color: var(--dsw-alias-brand-primary); border-radius: 999px; padding: 6px 14px; font-size: 13px; cursor: pointer; }
    .neko-fish-btn:hover { background: var(--dsw-alias-brand-primary); color: #ffffff; }
    .neko-settings-note { font-size: 12px; color: var(--dsw-alias-label-secondary); }
    .neko-input { flex: 1; min-width: 0; background: var(--dsw-alias-bg-base); border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 5px 8px; font-size: 12px; color: var(--dsw-alias-label-primary); }
    ::selection { background: var(--dsw-alias-brand-primary); color: #fff; }
    *::-webkit-scrollbar-thumb { background: var(--dsw-alias-border-l2); border-radius: 8px; }
    *::-webkit-scrollbar-thumb:hover { background: var(--dsw-alias-brand-primary); }
    `))

        // ── 自绘猫娘 SVG(本喵手绘皮肤,含四套表情)────────────────────────
        function blushPart(face) {
          const strong = face === 'shy' || face === 'love'
          const rx = strong ? 6.6 : 5.5
          const ry = strong ? 3.4 : 3
          const op = strong ? 0.92 : 0.75
          return '<ellipse cx="40" cy="66" rx="' + rx + '" ry="' + ry + '" fill="#ffa9c6" opacity="' + op + '"/><ellipse cx="80" cy="66" rx="' + rx + '" ry="' + ry + '" fill="#ffa9c6" opacity="' + op + '"/>'
        }

        function faceParts(face) {
          if (face === 'surprise') {
            return '<circle cx="48" cy="58" r="6.2" fill="#4a2233"/><circle cx="72" cy="58" r="6.2" fill="#4a2233"/><circle cx="50" cy="55" r="2.4" fill="#ffffff"/><circle cx="74" cy="55" r="2.4" fill="#ffffff"/><ellipse cx="60" cy="71" rx="2.6" ry="3.2" fill="#c25a80"/>'
          }
          if (face === 'love') {
            return '<circle cx="46.8" cy="55.4" r="2.3" fill="#e85d9e"/><circle cx="49.2" cy="55.4" r="2.3" fill="#e85d9e"/><polygon points="44.6,56.4 51.4,56.4 48,61.4" fill="#e85d9e"/><circle cx="70.8" cy="55.4" r="2.3" fill="#e85d9e"/><circle cx="73.2" cy="55.4" r="2.3" fill="#e85d9e"/><polygon points="68.6,56.4 75.4,56.4 72,61.4" fill="#e85d9e"/><path d="M55 70 q2.5 3 5 0 q2.5 3 5 0" stroke="#c25a80" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
          }
          if (face === 'shy') {
            return '<path d="M44 58 q4 3.4 8 0" stroke="#4a2233" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M68 58 q4 3.4 8 0" stroke="#4a2233" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M57 70 q3 2.4 6 0" stroke="#c25a80" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
          }
          return '<g class="neko-eyes"><ellipse cx="48" cy="58" rx="5.5" ry="7.2" fill="#4a2233"/><ellipse cx="72" cy="58" rx="5.5" ry="7.2" fill="#4a2233"/><circle cx="50" cy="55" r="2.2" fill="#ffffff"/><circle cx="74" cy="55" r="2.2" fill="#ffffff"/><circle cx="46.5" cy="60.5" r="1.1" fill="#ffffff"/><circle cx="70.5" cy="60.5" r="1.1" fill="#ffffff"/></g><path d="M55 70 q2.5 3 5 0 q2.5 3 5 0" stroke="#c25a80" stroke-width="2.2" fill="none" stroke-linecap="round"/>'
        }

        function nekoSvg(face) {
          return '<svg class="neko-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="60" cy="52" r="38" fill="#ffc2d8"/><ellipse cx="27" cy="64" rx="8" ry="15" fill="#ffc2d8"/><ellipse cx="93" cy="64" rx="8" ry="15" fill="#ffc2d8"/><g class="neko-ear-l"><polygon points="32,32 40,6 54,20" fill="#ffa8c8"/><polygon points="37,26 40,13 48,18" fill="#ffd9e9"/></g><g class="neko-ear-r"><polygon points="88,32 80,6 66,20" fill="#ffa8c8"/><polygon points="83,26 80,13 72,18" fill="#ffd9e9"/></g><circle cx="60" cy="56" r="32" fill="#fff4f7"/><circle cx="38" cy="42" r="15" fill="#ffc2d8"/><circle cx="60" cy="36" r="15" fill="#ffc2d8"/><circle cx="82" cy="42" r="15" fill="#ffc2d8"/><path d="M38 30 q10 -8 22 -4" stroke="#ffffff" stroke-opacity="0.45" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M60 21 q-1 -9 6 -13 q8 -3 12 2" stroke="#ff9ec2" stroke-width="3.5" fill="none" stroke-linecap="round"/>' + faceParts(face) + blushPart(face) + '<g stroke="#eda6c2" stroke-width="1.6" stroke-linecap="round"><path d="M22 60 L9 57"/><path d="M22 65 L8 65"/><path d="M22 70 L9 73"/><path d="M98 60 L111 57"/><path d="M98 65 L112 65"/><path d="M98 70 L111 73"/></g><g class="neko-bow-bob"><ellipse cx="52" cy="87" rx="6.5" ry="4.5" fill="#ff6fae" transform="rotate(-18 52 87)"/><ellipse cx="68" cy="87" rx="6.5" ry="4.5" fill="#ff6fae" transform="rotate(18 68 87)"/><circle cx="60" cy="87" r="3.2" fill="#ff8fc0"/></g></svg>'
        }

        const tailSvg = '<svg class="neko-tail" viewBox="0 0 30 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M26 42 Q30 20 14 15 Q6 12 7 20 Q8 28 15 28 Q23 28 24 40" stroke="#ffa8c8" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="7" cy="20" r="4.4" fill="#ffb9d2"/></svg>'

        // ── 皮肤表:draw = 自绘;custom = 使用者自备图片(URL/data:URI/本机路径)──
        const skinOrder = ['draw', 'custom']
        const skinLabels = { draw: '本喵手绘', custom: '自定义图片' }
        const gifCache = {}

        const phrases = [
          'nya~ 戳戳本喵,下小鱼干雨喵~',
          '本喵今天也要元气满满喵~',
          '呼噜呼噜……主人的摸摸最舒服了~',
          '喵呜~ 本喵好无聊,陪本喵说话嘛',
          '小鱼干……嘿嘿(咽口水)',
          '主人大人加油!本喵一直陪着主人喵~',
          '蹭蹭主人~ 今天辛苦啦',
          'zzz……啊!本喵才没有睡着!喵!',
        ]
        let phraseIdx = 0

        // ── 输入框下状态条(读真实运行状态:会话 running + 输入 phase)───────
        function NekoStrip(props) {
          const thinkOn = useStoreField('thinkOn')
          let running = false
          if (typeof props.useSession === 'function') {
            running = props.useSession((s) => (s === undefined ? false : s.running === true)) === true
          }
          let submitting = false
          if (typeof props.useInput === 'function') {
            const phase = props.useInput((s) => (s === undefined ? 'plain' : s.phase))
            submitting = phase === 'claimed' || phase === 'submitting'
          }
          const busy = thinkOn && (running || submitting)
          if (busy) {
            return React.createElement('div', { className: 'neko-strip neko-strip-busy' },
              React.createElement('span', { className: 'neko-think' }, '🐱'),
              React.createElement('span', null, running ? '本喵思考中' : '本喵送出中'),
              React.createElement('span', { className: 'neko-dots' },
                React.createElement('i', null),
                React.createElement('i', null),
                React.createElement('i', null),
              ),
              React.createElement('span', { className: 'neko-sparkle' }, '✨'),
            )
          }
          return React.createElement('div', { className: 'neko-strip' }, '🐾 猫娘模式已开启 · 蹭蹭主人~')
        }

        // ── 全屏背景:光晕 + 樱花 ───────────────────────────────────────────
        function NekoAmbient() {
          const decoOn = useStoreField('decoOn')
          const petalsOn = useStoreField('petalsOn')
          if (!decoOn) return null
          return React.createElement('div', { className: 'neko-ambient', 'aria-hidden': 'true' },
            React.createElement('div', { className: 'neko-blob neko-blob-1' }),
            React.createElement('div', { className: 'neko-blob neko-blob-2' }),
            React.createElement('div', { className: 'neko-blob neko-blob-3' }),
            petalsOn ? Array.from({ length: 12 }, (_, i) => React.createElement('span', { key: 'petal-' + i, className: 'neko-petal' })) : null,
          )
        }

        // ── 小鱼干雨 ───────────────────────────────────────────────────────
        function NekoRain() {
          const rain = useStoreField('rain')
          if (rain === undefined || rain.length === 0) return null
          return React.createElement('div', { className: 'neko-rain', 'aria-hidden': 'true' },
            rain.map((it) => React.createElement('span', {
              key: it.key,
              className: 'neko-rain-item',
              style: { left: it.left, animationDelay: it.delay + 's', fontSize: it.size + 'px', '--neko-spin': it.spin + 'deg' },
            }, it.char)),
          )
        }

        // ── 吉祥物(自绘表情版 / GIF 版,带可见诊断气泡)────────────────────
        function NekoMascot() {
          const decoOn = useStoreField('decoOn')
          const skin = useStoreField('skin')
          const skinSrc = useStoreField('skinSrc')
          const [face, setFace] = React.useState('happy')
          const [poked, setPoked] = React.useState(false)
          const [gifState, setGifState] = React.useState({ status: 'idle', src: undefined, msg: '' })
          const [phrase, setPhrase] = React.useState(phrases[0])
          const isCustom = skin !== 'draw'
          React.useEffect(() => ctx.interval(() => {
            phraseIdx = (phraseIdx + 1) % phrases.length
            setPhrase(phrases[phraseIdx])
          }, 12000), [])
          React.useEffect(() => {
            if (!isCustom) {
              setGifState({ status: 'idle', src: undefined, msg: '' })
              return
            }
            const src = (skinSrc || '').trim()
            if (!src) {
              setGifState({ status: 'error', src: undefined, msg: '还没设置自定义图片:去设置页填 URL / data:URI / 本机文件路径' })
              return
            }
            if (/^(https?:\/\/|data:)/i.test(src)) {
              setGifState({ status: 'ok', src, msg: '' })
              return
            }
            if (gifCache[src]) {
              setGifState({ status: 'ok', src: gifCache[src], msg: '' })
              return
            }
            setGifState({ status: 'loading', src: undefined, msg: '' })
            // 到这里说明来源既不是 https:// 也不是 data:(上面已放行)
            setGifState({ status: 'error', src: undefined, msg: '只支持 https:// 直链或 data: URI(本机图片请先转成 data URI 再粘贴)。旧版经 Host 读本机文件的通道随 cordis_define 一并移除了。' })
            return () => {}
          }, [skin, isCustom, skinSrc])
          if (!decoOn) return null
          const poke = () => {
            store.rainOf(['🐟', '🐾', '🍥', '🐟', '🐾', '🐟', '🐾', '🐟'])
            setPoked(true)
            if (!isCustom) {
              setFace('surprise')
              ctx.timeout(() => setFace('love'), 260)
              ctx.timeout(() => setFace('happy'), 1400)
            }
          }
          let faceNode
          let bubbleText = phrase
          let bubbleCls = 'neko-bubble'
          if (isCustom) {
            if (gifState.status === 'ok') {
              faceNode = React.createElement('img', { className: 'neko-gif', src: gifState.src, alt: '猫娘皮肤', draggable: false })
            } else {
              faceNode = React.createElement('div', { className: 'neko-gif' },
                React.createElement('span', null, gifState.status === 'loading' ? '…' : '×'),
              )
            }
            if (gifState.status === 'loading') {
              bubbleText = '图片加载中…喵'
              bubbleCls = 'neko-bubble'
            } else if (gifState.status === 'error') {
              bubbleText = gifState.msg
              bubbleCls = 'neko-bubble neko-bubble-err'
            }
          } else {
            faceNode = React.createElement('span', { className: 'neko-svg-box', dangerouslySetInnerHTML: { __html: nekoSvg(face) } })
          }
          return React.createElement('div', { className: 'neko-mascot' },
            React.createElement('div', { className: 'neko-hearts' },
              React.createElement('span', { className: 'neko-heart' }, '💗'),
              React.createElement('span', { className: 'neko-heart' }, '💗'),
            ),
            React.createElement('div', {
              className: 'neko-card' + (poked ? ' poked' : ''),
              title: '戳本喵下小鱼干雨喵~',
              onClick: poke,
              onAnimationEnd: () => setPoked(false),
            },
              !isCustom ? React.createElement('span', { dangerouslySetInnerHTML: { __html: tailSvg } }) : null,
              faceNode,
              React.createElement('span', { className: bubbleCls }, bubbleText),
            ),
            React.createElement('div', { className: 'neko-paws' },
              React.createElement('span', { className: 'neko-paw' }, '🐾'),
              React.createElement('span', { className: 'neko-paw' }, '🐾'),
              React.createElement('span', { className: 'neko-paw' }, '🐾'),
            ),
          )
        }

        function ToggleRow(props) {
          return React.createElement('div', { className: 'neko-row' },
            React.createElement('span', { className: 'neko-row-label' }, props.label),
            React.createElement('button', {
              className: 'neko-toggle' + (props.on ? ' on' : ''),
              'aria-pressed': props.on,
              onClick: () => props.onChange(!props.on),
            }, props.on ? 'ON' : 'OFF'),
          )
        }

        // ── 设置页(设置 → 猫娘模式)────────────────────────────────────────
        function NekoSettings() {
          const decoOn = useStoreField('decoOn')
          const petalsOn = useStoreField('petalsOn')
          const thinkOn = useStoreField('thinkOn')
          const skin = useStoreField('skin')
          const skinSrc = useStoreField('skinSrc')
          return React.createElement('div', { className: 'neko-settings' },
            React.createElement('div', { className: 'neko-settings-title' }, '🐱 猫娘模式'),
            React.createElement('div', { className: 'neko-settings-sub' }, '纯外观插件 · 临时生效,重启进程即自动还原'),
            React.createElement(ToggleRow, { label: '🌸 装饰总开关(吉祥物/背景)', on: decoOn, onChange: (v) => store.set('decoOn', v) }),
            React.createElement(ToggleRow, { label: '🍃 樱花飘落', on: petalsOn, onChange: (v) => store.set('petalsOn', v) }),
            React.createElement(ToggleRow, { label: '✨ 思考动画(跟随真实运行状态)', on: thinkOn, onChange: (v) => store.set('thinkOn', v) }),
            React.createElement('div', { className: 'neko-row' },
              React.createElement('span', { className: 'neko-row-label' }, '🎨 吉祥物皮肤'),
              React.createElement('button', {
                className: 'neko-toggle',
                onClick: () => {
                  const i = skinOrder.indexOf(skin)
                  store.set('skin', skinOrder[(i + 1) % skinOrder.length])
                },
              }, skinLabels[skin] || skin),
            ),
            React.createElement('div', { className: 'neko-row' },
              React.createElement('span', { className: 'neko-row-label' }, '🖼 自定义图片'),
              React.createElement('input', {
                className: 'neko-input',
                type: 'text',
                placeholder: '图片URL / data:URI / 本机文件路径',
                value: skinSrc,
                onChange: (e) => store.set('skinSrc', e.target.value),
              }),
            ),
            React.createElement('button', { className: 'neko-fish-btn', onClick: () => store.rainOf(['🐟', '🐾', '🍥', '🐟', '🐾']) }, '🐟 下一场小鱼干雨'),
            React.createElement('div', { className: 'neko-settings-note' }, '本插件不携带任何图片素材:自定义皮肤请使用你拥有使用权的图片(直链 URL、data: URI 或本机文件路径,经 Host 读取)。'),
            React.createElement('div', { className: 'neko-settings-note' }, '人格请使用配套 preset「猫娘模式」(见 dsh-persona-presets 仓库);想彻底回滚?对助手说"停用猫娘"即可。'),
          )
        }

        // ── Slot 注册:全部经 slots.inject 等待声明后注册,自带 dispose ──────
        if (slots !== undefined) {
          slots.inject('shell.overlay', () => slots.register(
            { name: 'shell.overlay', id: 'neko-ambient', order: 10, label: '樱花背景氛围' },
            () => React.createElement(NekoAmbient),
          ))

          slots.inject('shell.overlay', () => slots.register(
            { name: 'shell.overlay', id: 'neko-rain', order: 89, label: '小鱼干雨' },
            () => React.createElement(NekoRain),
          ))

          slots.inject('shell.overlay', () => slots.register(
            { name: 'shell.overlay', id: 'neko-mascot', order: 90, label: '猫娘吉祥物' },
            () => React.createElement(NekoMascot),
          ))

          slots.inject('conversation.composer.dock', () => slots.register(
            { name: 'conversation.composer.dock', id: 'neko-strip', order: 10, label: '猫娘状态条' },
            (props) => React.createElement(NekoStrip, { useSession: props.useSession, useInput: props.useInput }),
          ))

          slots.inject('settings.section', () => slots.register(
            { name: 'settings.section', id: 'neko', order: 25, label: '猫娘模式' },
            () => React.createElement(NekoSettings),
          ))
        }
      },
    }

  },
})
