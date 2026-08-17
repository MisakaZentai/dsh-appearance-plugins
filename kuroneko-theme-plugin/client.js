// 黑猫领域主题插件 (kuroneko) — Client 半区源码
// 五更瑠璃(黑猫)品味的紫黑哥特外观:全局主题覆盖 + 黑猫使魔 + 堕天氛围 + 星屑诅咒雨
// 结构参照:neko-catgirl-plugin / vamp-plugin(同运行时、同 Slot 体系)
// 环境约束:可用符号只有 ctx / React(createElement/useState/useEffect)/
//           styles / console。没有 window/document/fetch/原生定时器;
//           定时器用 ctx.interval / ctx.timeout(需 inject: ['timer'])。
// 无 Host 半区:使魔为手绘 SVG,不依赖文件/网络;一切副作用均可逆。

return {
  inject: ['timer'],
  apply(ctx) {
    console.log('kuroneko-theme apply')

    const theme = ctx.get('theme')
    const slots = ctx.get('slots')

    // ── 插件内共享 store(内存态,重启即清,故意不做持久化)──────────────
    const store = {
      decoOn: true,
      petalsOn: true,
      thinkOn: true,
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

    // ── 0. 紫黑哥特主题(light/dark 双套;overrideTokens 返回 disposer,自动可逆)──
    // 浅色 = 月白蕾丝(白猫);深色 = 堕天之夜(黑猫)。官方 13 token 全量覆盖。
    const tokens = {
      '--dsw-alias-bg-base': { light: '#f4f0fa', dark: '#0f0a18' },
      '--dsw-alias-bg-layer-1': { light: '#ece5f8', dark: '#171022' },
      '--dsw-alias-bg-layer-2': { light: '#e2d8f3', dark: '#1f1632' },
      '--dsw-alias-bg-overlay': { light: '#faf7fe', dark: '#2a1f45' },
      '--dsw-alias-border-l1': { light: 'rgba(109,63,192,.14)', dark: 'rgba(167,139,250,.14)' },
      '--dsw-alias-border-l2': { light: 'rgba(109,63,192,.28)', dark: 'rgba(167,139,250,.28)' },
      '--dsw-alias-brand-primary': { light: '#6d3fc0', dark: '#a78bfa' },
      '--dsw-alias-label-primary': { light: '#241a33', dark: '#ece7f6' },
      '--dsw-alias-label-secondary': { light: '#6a5d80', dark: '#b3a6d6' },
      '--dsw-alias-state-error-primary': { light: '#d5497c', dark: '#ff6b9d' },
      '--dsw-alias-state-success-primary': { light: '#3d9462', dark: '#63d29b' },
      '--dsw-alias-state-warn-primary': { light: '#b07d2f', dark: '#e5b357' },
      '--dsw-specific-sidebar-fill': { light: '#e6dcf4', dark: '#0b0714' },
    }

    if (theme !== undefined) {
      ctx.effect(() => theme.overrideTokens('kuroneko', tokens))
    }

    // ── 0b. 全量变量兜底 ────────────────────────────────────────────
    // 坑(来自 vamp-plugin 的教训):只覆盖 13 个官方 token 时,消息气泡、
    // 输入框等次生变量仍是浅色。此处把整套次生变量以 var() 别名到官方 token,
    // 使其自动跟随 light/dark 双套;shiki 代码高亮给静态中间色。
    ctx.effect(() => styles.insert(`
body,body[data-ds-dark-theme]{
--dsw-alias-bg-module-platform:var(--dsw-alias-bg-layer-2);
--dsw-alias-bg-multi-select:var(--dsw-alias-bg-layer-2);
--dsw-alias-bg-skeleton:var(--dsw-alias-border-l2);
--dsw-alias-border-inverted2:var(--dsw-alias-border-l1);
--dsw-alias-border-inverted:var(--dsw-alias-border-l1);
--dsw-alias-border-l2-darkmode-thin:var(--dsw-alias-border-l1);
--dsw-alias-border-l3:var(--dsw-alias-border-l2);
--dsw-alias-border-l4:var(--dsw-alias-border-l2);
--dsw-alias-brand-primary-invert:var(--dsw-alias-bg-base);
--dsw-alias-brand-primary-new-colorprimary-new-color:var(--dsw-alias-brand-primary);
--dsw-alias-brand-text:var(--dsw-alias-label-primary);
--dsw-alias-button-contrast-fill:var(--dsw-alias-label-primary);
--dsw-alias-button-elevated-fill:var(--dsw-alias-bg-layer-1);
--dsw-alias-button-floating-fill:var(--dsw-alias-bg-overlay);
--dsw-alias-button-floating-hover:var(--dsw-alias-bg-layer-2);
--dsw-alias-button-ghost-active-border:var(--dsw-alias-border-l2);
--dsw-alias-button-ghost-active-fill:var(--dsw-alias-bg-layer-2);
--dsw-alias-button-ghost-active-hover:var(--dsw-alias-bg-layer-2);
--dsw-alias-button-info-fill:var(--dsw-alias-brand-primary);
--dsw-alias-button-info-hover:var(--dsw-alias-brand-primary);
--dsw-alias-button-primary-dimmed:var(--dsw-alias-bg-layer-2);
--dsw-alias-button-primary-fill:var(--dsw-alias-brand-primary);
--dsw-alias-button-primary-hover:var(--dsw-alias-brand-primary);
--dsw-alias-button-tool-bar-fill-invisible:var(--dsw-alias-border-l1);
--dsw-alias-button-tool-bar-fill:var(--dsw-alias-bg-overlay);
--dsw-alias-button-tool-bar-hover:var(--dsw-alias-bg-layer-2);
--dsw-alias-interactive-bg-active:var(--dsw-alias-border-l2);
--dsw-alias-interactive-bg-hover-accent:var(--dsw-alias-border-l1);
--dsw-alias-interactive-bg-hover-danger:var(--dsw-alias-border-l2);
--dsw-alias-interactive-bg-hover-solid:var(--dsw-alias-bg-layer-2);
--dsw-alias-interactive-bg-hover:var(--dsw-alias-border-l1);
--dsw-alias-label-caption:var(--dsw-alias-label-secondary);
--dsw-alias-label-dimmed:var(--dsw-alias-label-secondary);
--dsw-alias-label-primary-bluish:var(--dsw-alias-label-primary);
--dsw-alias-label-primary-dimmed:var(--dsw-alias-label-primary);
--dsw-alias-label-primary-foreground:var(--dsw-alias-bg-base);
--dsw-alias-label-primary-inverted:var(--dsw-alias-bg-base);
--dsw-alias-label-tertiary:var(--dsw-alias-label-secondary);
--dsw-alias-markdown-citation:var(--dsw-alias-bg-layer-2);
--dsw-alias-markdown-code-block-banner:var(--dsw-alias-bg-layer-2);
--dsw-alias-markdown-code-block:var(--dsw-alias-bg-layer-1);
--dsw-alias-markdown-code-segment-selected:var(--dsw-alias-bg-layer-2);
--dsw-alias-markdown-code-segment-unselected:var(--dsw-alias-bg-layer-1);
--dsw-alias-markdown-inline-code:var(--dsw-alias-bg-layer-2);
--dsw-alias-markdown-placeholder:var(--dsw-alias-bg-layer-2);
--dsw-alias-markdown-tag:var(--dsw-alias-bg-layer-2);
--dsw-alias-scrollbar-bg-l1:var(--dsw-alias-border-l2);
--dsw-alias-scrollbar-bg-l2:var(--dsw-alias-border-l1);
--dsw-alias-scrollbar-hover-l1:var(--dsw-alias-brand-primary);
--dsw-alias-scrollbar-hover-l2:var(--dsw-alias-border-l2);
--dsw-alias-state-business-primary:var(--dsw-alias-brand-primary);
--dsw-alias-state-business-tertiary:var(--dsw-alias-bg-layer-2);
--dsw-alias-state-error-secondary:var(--dsw-alias-state-error-primary);
--dsw-alias-state-success-secondary:var(--dsw-alias-state-success-primary);
--dsw-alias-state-success-tertiary:var(--dsw-alias-bg-layer-2);
--dsw-alias-state-warn-label:var(--dsw-alias-state-warn-primary);
--dsw-alias-state-warn-secondary:var(--dsw-alias-state-warn-primary);
--dsw-alias-state-warn-tertiary:var(--dsw-alias-bg-layer-2);
--dsw-alias-toast-bg:var(--dsw-alias-bg-overlay);
--dsw-alias-tooltip-bg:var(--dsw-alias-bg-overlay);
--dsw-specific-bubble-highlight:var(--dsw-alias-bg-layer-2);
--dsw-specific-bubble:var(--dsw-alias-bg-layer-2);
--dsw-specific-input-major:var(--dsw-alias-bg-layer-1);
--dsw-specific-login-input:var(--dsw-alias-bg-layer-1);
--dsw-specific-menu:var(--dsw-alias-bg-overlay);
--dsw-specific-selector:var(--dsw-alias-bg-layer-1);
--dsw-specific-sidebar-nav-item-active-accent:var(--dsw-alias-brand-primary);
--dsw-specific-sidebar-nav-item-active:var(--dsw-alias-bg-layer-2);
--dsw-specific-sidebar-nav-item-hover:var(--dsw-alias-bg-layer-1);
--dsw-specific-tip:var(--dsw-alias-bg-layer-2);
--shiki-token-constant:#b78bff;
--shiki-token-string:#7fd8a4;
--shiki-token-comment:#8b7fae;
--shiki-token-keyword:#c4b5fd;
--shiki-token-parameter:#e8b04f;
--shiki-token-function:#a78bfa;
--shiki-token-string-expression:#93e0b3;
--shiki-token-punctuation:#b3a6d6;
--shiki-token-link:#d6a5ff;
}
::selection { background: var(--dsw-alias-brand-primary); color: #fff; }
*::-webkit-scrollbar-thumb { background: var(--dsw-alias-border-l2); border-radius: 8px; }
*::-webkit-scrollbar-thumb:hover { background: var(--dsw-alias-brand-primary); }
`))

    // ── 组件样式与动画 ──────────────────────────────────────────────
    ctx.effect(() => styles.insert(`
@keyframes kuru-float { 0%, 100% { transform: translateY(0) rotate(0deg); } 30% { transform: translateY(-6px) rotate(-1.4deg); } 70% { transform: translateY(-3px) rotate(1.4deg); } }
@keyframes kuru-blink { 0%, 88%, 100% { transform: scaleY(1); } 92%, 95% { transform: scaleY(.08); } }
@keyframes kuru-poke { 0% { transform: scale(1); } 30% { transform: scale(1.12, .9); } 55% { transform: scale(.94, 1.07); } 75% { transform: scale(1.06, .96); } 100% { transform: scale(1); } }
@keyframes kuru-sparkle { 0%, 100% { opacity: .25; transform: translateY(0) scale(.8); } 50% { opacity: 1; transform: translateY(-4px) scale(1.15); } }
@keyframes kuru-drift { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(5vw, 3vh, 0) scale(1.12); } }
@keyframes kuru-petal-fall { 0% { transform: translate3d(0, -8vh, 0) rotate(0deg); opacity: 0; } 10% { opacity: .75; } 55% { transform: translate3d(6vw, 48vh, 0) rotate(170deg); opacity: .55; } 100% { transform: translate3d(-5vw, 108vh, 0) rotate(350deg); opacity: .08; } }
@keyframes kuru-twinkle { 0%, 100% { opacity: .15; transform: scale(.7) rotate(0deg); } 50% { opacity: .9; transform: scale(1.2) rotate(30deg); } }
@keyframes kuru-moon-sway { 0%, 100% { transform: translateY(0) rotate(-8deg); } 50% { transform: translateY(10px) rotate(8deg); } }
@keyframes kuru-think-bob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-8deg); } }
@keyframes kuru-dot { 0%, 100% { opacity: .25; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-3px); } }
@keyframes kuru-rain-fall { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 6% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateY(118vh) rotate(var(--kuru-spin, 300deg)); opacity: 0; } }
.kuru-mascot { position: fixed; right: 18px; bottom: 18px; z-index: 99999; user-select: none; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.kuru-card { position: relative; background: var(--dsw-alias-bg-overlay); border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; padding: 10px 14px 10px 10px; box-shadow: 0 8px 24px rgba(109,63,192,.28); animation: kuru-float 3.4s ease-in-out infinite; display: flex; align-items: center; gap: 8px; pointer-events: auto; cursor: pointer; }
.kuru-card.poked { animation: kuru-float 3.4s ease-in-out infinite, kuru-poke .7s ease-out 1; }
.kuru-svg { width: 58px; height: 58px; display: block; transition: transform .25s ease; }
.kuru-card:hover .kuru-svg { transform: rotate(-4deg) scale(1.06); }
.kuru-eyes { transform-box: view-box; transform-origin: 60px 52px; animation: kuru-blink 4.6s ease-in-out infinite; }
.kuru-eye-glow { filter: drop-shadow(0 0 3px #ff4d6d); }
.kuru-bubble { font-size: 12px; color: var(--dsw-alias-label-primary); white-space: nowrap; max-width: 180px; overflow: hidden; text-overflow: ellipsis; }
.kuru-sparkles { display: flex; gap: 4px; padding-right: 4px; }
.kuru-sparkle { font-size: 12px; color: #9d7bff; opacity: .5; animation: kuru-sparkle 2.6s ease-in-out infinite; }
.kuru-sparkle:nth-child(2) { animation-delay: .9s; }
.kuru-sparkle:nth-child(3) { animation-delay: 1.8s; }
.kuru-ambient { position: fixed; inset: 0; z-index: 9000; pointer-events: none; overflow: hidden; }
.kuru-blob { position: fixed; border-radius: 50%; filter: blur(70px); opacity: .26; pointer-events: none; animation: kuru-drift 26s ease-in-out infinite alternate; }
.kuru-blob-1 { width: 46vw; height: 46vw; left: -12vw; top: -14vw; background: radial-gradient(circle at 30% 30%, #6d3fc0, transparent 70%); }
.kuru-blob-2 { width: 40vw; height: 40vw; right: -10vw; bottom: -12vw; background: radial-gradient(circle at 60% 40%, #a78bfa, transparent 70%); animation-delay: -8s; animation-duration: 32s; }
.kuru-blob-3 { width: 30vw; height: 30vw; left: 38vw; top: 30vh; background: radial-gradient(circle at 50% 50%, #3b2a5e, transparent 70%); animation-delay: -16s; animation-duration: 38s; opacity: .18; }
.kuru-petal { position: fixed; top: -6vh; background: linear-gradient(135deg, #4a3668, #0f0a18); border-radius: 150% 0 150% 0; opacity: 0; animation: kuru-petal-fall linear infinite; pointer-events: none; }
.kuru-star { position: fixed; color: #9d7bff; opacity: 0; animation: kuru-twinkle ease-in-out infinite; pointer-events: none; }
.kuru-moon { position: fixed; color: #c4b5fd; opacity: .5; animation: kuru-moon-sway 6s ease-in-out infinite; pointer-events: none; }
.kuru-rain { position: fixed; inset: 0; z-index: 9998; pointer-events: none; overflow: hidden; }
.kuru-rain-item { position: fixed; top: -8vh; animation: kuru-rain-fall 2.6s cubic-bezier(.3, .6, .7, 1) forwards; }
.kuru-strip { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-secondary); background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); border-radius: 999px; padding: 3px 10px; margin-left: 8px; }
.kuru-strip-busy { color: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); }
.kuru-think { display: inline-block; animation: kuru-think-bob .9s ease-in-out infinite; }
.kuru-dots { display: inline-flex; gap: 2px; }
.kuru-dots i { width: 3px; height: 3px; border-radius: 50%; background: currentColor; animation: kuru-dot 1.2s ease-in-out infinite; }
.kuru-dots i:nth-child(2) { animation-delay: .2s; }
.kuru-dots i:nth-child(3) { animation-delay: .4s; }
.kuru-settings { display: flex; flex-direction: column; gap: 10px; padding: 12px 0; max-width: 520px; }
.kuru-settings-title { font-size: 16px; font-weight: 600; color: var(--dsw-alias-label-primary); }
.kuru-settings-sub { font-size: 12px; color: var(--dsw-alias-label-secondary); margin-top: -6px; }
.kuru-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); }
.kuru-row-label { font-size: 13px; color: var(--dsw-alias-label-primary); }
.kuru-toggle { border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-overlay); color: var(--dsw-alias-label-secondary); border-radius: 999px; padding: 4px 12px; font-size: 12px; cursor: pointer; }
.kuru-toggle.on { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); color: #ffffff; }
.kuru-curse-btn { align-self: flex-start; border: 1px solid var(--dsw-alias-brand-primary); background: transparent; color: var(--dsw-alias-brand-primary); border-radius: 999px; padding: 6px 14px; font-size: 13px; cursor: pointer; }
.kuru-curse-btn:hover { background: var(--dsw-alias-brand-primary); color: #ffffff; }
.kuru-settings-note { font-size: 12px; color: var(--dsw-alias-label-secondary); }
.kuru-cardview { background: linear-gradient(160deg, #171022 0%, #221a3a 55%, #2b1f4a 100%); border: 1px solid #4a3668; border-radius: 14px; padding: 14px 16px; color: #ece7f6; max-width: 420px; box-shadow: 0 4px 18px rgba(109,63,192,.35); }
.kuru-cardview__head { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
.kuru-cardview__title { font-size: 15px; font-weight: 700; color: #efe9ff; }
.kuru-cardview__sub { font-size: 11px; color: #a99bd0; letter-spacing: .5px; }
.kuru-cardview__row { display: flex; align-items: center; gap: 8px; margin: 7px 0; font-size: 12px; }
.kuru-cardview__label { width: 64px; color: #c4b5fd; flex: none; }
.kuru-cardview__line { margin: 8px 0 10px; font-size: 12px; line-height: 1.6; color: #dcd2f5; background: #1f1632; border-left: 3px solid #8b5cf6; padding: 8px 10px; border-radius: 0 8px 8px 0; }
.kuru-cardview__actions { display: flex; gap: 8px; flex-wrap: wrap; }
.kuru-cardview__btn { flex: 1; min-width: 88px; background: linear-gradient(180deg, #2b1f4a, #1a1126); color: #dcd2f5; border: 1px solid #4a3668; border-radius: 9px; padding: 7px 8px; font-size: 12px; cursor: pointer; transition: transform .12s ease, box-shadow .12s ease; }
.kuru-cardview__btn:hover { transform: translateY(-1px); box-shadow: 0 2px 10px rgba(139,92,246,.4); }
.kuru-cardview__foot { margin-top: 9px; font-size: 10px; text-align: right; color: #8b7fae; letter-spacing: .5px; }
`))

    // ── 手绘使魔 SVG:黑猫(夜魔女王形态)──────────────────────────────
    // 黑发姬式刘海、深红魔瞳、左眼角泪痣、黑哥特裙配白蕾丝、紫蔷薇缎带。
    function blushPart(strong) {
      const op = strong ? '.8' : '.45'
      return '<ellipse cx="41" cy="59" rx="4.2" ry="2.4" fill="#ff9ec2" opacity="' + op + '"/><ellipse cx="79" cy="59" rx="4.2" ry="2.4" fill="#ff9ec2" opacity="' + op + '"/>'
    }

    function faceParts(face) {
      const mole = '<circle cx="73" cy="63.5" r="1.3" fill="#4a2438"/>'
      if (face === 'happy') {
        return '<g class="kuru-eyes"><path d="M44 52 Q48 46.5 52 52" stroke="#1a1126" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M68 52 Q72 46.5 76 52" stroke="#1a1126" stroke-width="2" fill="none" stroke-linecap="round"/></g>' + blushPart(false) + '<path d="M56.5 63.5 Q60 68 63.5 63.5" stroke="#8a4a5e" stroke-width="1.5" fill="none" stroke-linecap="round"/>' + mole
      }
      if (face === 'shy') {
        return '<g class="kuru-eyes"><ellipse cx="48" cy="53" rx="4.6" ry="6.4" fill="#d63057"/><ellipse cx="49" cy="55.5" rx="2.1" ry="3.3" fill="#3d0a1e"/><circle cx="47.3" cy="52.2" r="1.5" fill="#ffffff"/><path d="M43.4 49.6 Q48 47.2 52.6 49.6" stroke="#1a1126" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="72" cy="53" rx="4.6" ry="6.4" fill="#d63057"/><ellipse cx="73" cy="55.5" rx="2.1" ry="3.3" fill="#3d0a1e"/><circle cx="71.3" cy="52.2" r="1.5" fill="#ffffff"/><path d="M67.4 49.6 Q72 47.2 76.6 49.6" stroke="#1a1126" stroke-width="1.7" fill="none" stroke-linecap="round"/></g>' + blushPart(true) + '<path d="M56.5 65 q1.8 1.8 3.6 0 q1.8 1.8 3.6 0" stroke="#8a4a5e" stroke-width="1.5" fill="none" stroke-linecap="round"/>' + mole
      }
      if (face === 'curse') {
        return '<g class="kuru-eyes kuru-eye-glow"><ellipse cx="48" cy="53" rx="5" ry="7" fill="#ff2d55"/><ellipse cx="48" cy="55" rx="2.2" ry="3.6" fill="#5c0a20"/><circle cx="46.6" cy="50.8" r="1.6" fill="#ffffff"/><path d="M42.8 45.6 L53 49" stroke="#1a1126" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="72" cy="53" rx="5" ry="7" fill="#ff2d55"/><ellipse cx="72" cy="55" rx="2.2" ry="3.6" fill="#5c0a20"/><circle cx="70.6" cy="50.8" r="1.6" fill="#ffffff"/><path d="M77.2 45.6 L67 49" stroke="#1a1126" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>' + blushPart(false) + '<path d="M56.5 63.5 Q60 60.8 63.5 63" stroke="#ff2d55" stroke-width="1.6" fill="none" stroke-linecap="round"/>' + mole
      }
      return '<g class="kuru-eyes"><ellipse cx="48" cy="53" rx="4.6" ry="6.4" fill="#d63057"/><ellipse cx="48" cy="54.5" rx="2.1" ry="3.3" fill="#3d0a1e"/><circle cx="46.5" cy="51.5" r="1.5" fill="#ffffff"/><path d="M43.4 48.6 Q48 46.2 52.6 48.6" stroke="#1a1126" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="72" cy="53" rx="4.6" ry="6.4" fill="#d63057"/><ellipse cx="72" cy="54.5" rx="2.1" ry="3.3" fill="#3d0a1e"/><circle cx="70.5" cy="51.5" r="1.5" fill="#ffffff"/><path d="M67.4 48.6 Q72 46.2 76.6 48.6" stroke="#1a1126" stroke-width="1.7" fill="none" stroke-linecap="round"/></g>' + blushPart(false) + '<path d="M57 65.5 Q60 63 63 65.5" stroke="#8a4a5e" stroke-width="1.5" fill="none" stroke-linecap="round"/>' + mole
    }

    function kuruSvg(face) {
      return '<svg class="kuru-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
        + '<path d="M30 40 Q13 33 19 21 Q26 30 31 32 Z" fill="#0d0816"/>'
        + '<path d="M90 40 Q107 33 101 21 Q94 30 89 32 Z" fill="#0d0816"/>'
        + '<path d="M60 17 Q87 19 89 51 L91 84 Q91 94 83 95 L37 95 Q29 94 29 84 L31 51 Q33 19 60 17 Z" fill="#1a1126"/>'
        + '<ellipse cx="60" cy="52" rx="24" ry="22" fill="#f7ecf2"/>'
        + '<path d="M36 45 Q36 24 60 24 Q84 24 84 45 L84 49 L36 49 Z" fill="#1a1126"/>'
        + '<path d="M44 31 Q52 27 61 28" stroke="#3b2a5e" stroke-width="2" fill="none" opacity=".55"/>'
        + faceParts(face)
        + '<path d="M44 71 L76 71 L78 73 L42 73 Z" fill="#f7f2fa"/>'
        + '<circle cx="50" cy="73.5" r="2.1" fill="#f7f2fa"/><circle cx="60" cy="73.5" r="2.1" fill="#f7f2fa"/><circle cx="70" cy="73.5" r="2.1" fill="#f7f2fa"/>'
        + '<path d="M44 73 L36 112 L84 112 L76 73 Z" fill="#151021"/>'
        + '<polygon points="60,80 49.5,74.5 49.5,85.5" fill="#7c3aed"/><polygon points="60,80 70.5,74.5 70.5,85.5" fill="#7c3aed"/><circle cx="60" cy="80" r="2.8" fill="#9d7bff"/>'
        + '<path d="M36 108 L84 108 L84 112 L36 112 Z" fill="#f7f2fa"/>'
        + '<path d="M32 34 L40 34 L40 85 Q40 91 34 91 Z" fill="#1a1126"/>'
        + '<path d="M88 34 L80 34 L80 85 Q80 91 86 91 Z" fill="#1a1126"/>'
        + '<path d="M37 40 L39.5 40 L39.5 80 L37 80 Z" fill="#3b2a5e" opacity=".35"/>'
        + '<path d="M83 40 L80.5 40 L80.5 80 L83 80 Z" fill="#3b2a5e" opacity=".35"/>'
        + '<path d="M40 20 a9 9 0 1 0 0 18 a7.5 7.5 0 1 1 0 -18" fill="#8b5cf6"/>'
        + '<path d="M53 23 l1.1 2.4 2.4 1.1 -2.4 1.1 -1.1 2.4 -1.1 -2.4 -2.4 -1.1 2.4 -1.1 Z" fill="#c4b5fd"/>'
        + '</svg>'
    }

    const PHRASES = [
      '贵安,哥哥。',
      '五更残夜,琉璃耀月!',
      '……要诅咒你哦。',
      '†命短し恋せよ乙女†',
      '愚民,别一直盯着妾身看。',
      '命运记录上,此刻应有此相逢。',
      'maschera 的台词,才不轻易念给愚民听。',
      '……被诅咒是荣幸,感谢妾身吧。',
      '哼,才不是特意等你的呢。',
    ]
    const POKE_LINES = [
      '……要诅咒你哦。',
      '五更残夜,琉璃耀月!',
      '哼,谁允许你随便碰妾身的……',
      '†命短し恋せよ乙女†',
      '……感、感激得说不出话了吧,愚民。',
    ]
    const RAIN_CHARS = ['✧', '✦', '🌙', '🖤', '🥀']
    let phraseIdx = 0
    let pokeSeq = 0

    // ── 输入框下状态条(读真实运行状态:会话 running + 输入 phase)───────
    function KuruStrip(props) {
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
        return React.createElement('div', { className: 'kuru-strip kuru-strip-busy' },
          React.createElement('span', { className: 'kuru-think' }, '🔮'),
          React.createElement('span', null, running ? '咏唱咒文中' : '寄送诅咒中'),
          React.createElement('span', { className: 'kuru-dots' },
            React.createElement('i', null),
            React.createElement('i', null),
            React.createElement('i', null),
          ),
          React.createElement('span', null, '✦'),
        )
      }
      return React.createElement('div', { className: 'kuru-strip' }, '✧ †千葉の堕天聖黒猫† · 黑猫领域展开中')
    }

    // ── 全屏氛围:紫色光晕 + 黑蔷薇 + 星屑 + 残月 ─────────────────────
    const PETALS = [
      { left: 6, dur: 11, delay: 0, w: 12, h: 15 },
      { left: 14, dur: 13, delay: -3, w: 15, h: 18 },
      { left: 22, dur: 10, delay: -6, w: 12, h: 15 },
      { left: 30, dur: 15, delay: -9, w: 10, h: 13 },
      { left: 38, dur: 12, delay: -1, w: 12, h: 15 },
      { left: 46, dur: 16, delay: -5, w: 14, h: 17 },
      { left: 54, dur: 11.5, delay: -8, w: 12, h: 15 },
      { left: 62, dur: 14, delay: -2, w: 16, h: 19 },
      { left: 70, dur: 12.5, delay: -7, w: 12, h: 15 },
      { left: 78, dur: 17, delay: -4, w: 11, h: 14 },
      { left: 86, dur: 13.5, delay: -10, w: 12, h: 15 },
      { left: 94, dur: 15.5, delay: -6.5, w: 13, h: 16 },
    ]
    const STARS = [
      { top: '16%', left: '10%', size: 13, dur: 3.2, delay: 0 },
      { top: '34%', left: '88%', size: 11, dur: 4.1, delay: -1.2 },
      { top: '58%', left: '6%', size: 15, dur: 3.7, delay: -2.4 },
      { top: '76%', left: '92%', size: 12, dur: 4.6, delay: -3 },
    ]
    const MOONS = [
      { top: '10%', right: '12%', size: 16, delay: 0 },
      { bottom: '20%', left: '8%', size: 13, delay: -3 },
    ]

    function KuruAmbient() {
      const decoOn = useStoreField('decoOn')
      const petalsOn = useStoreField('petalsOn')
      if (!decoOn) return null
      return React.createElement('div', { className: 'kuru-ambient', 'aria-hidden': 'true' },
        React.createElement('div', { className: 'kuru-blob kuru-blob-1' }),
        React.createElement('div', { className: 'kuru-blob kuru-blob-2' }),
        React.createElement('div', { className: 'kuru-blob kuru-blob-3' }),
        petalsOn ? PETALS.map((p, i) => React.createElement('span', {
          key: 'petal-' + i,
          className: 'kuru-petal',
          style: {
            left: p.left + '%',
            animationDuration: p.dur + 's',
            animationDelay: p.delay + 's',
            width: p.w + 'px',
            height: p.h + 'px',
          },
        })) : null,
        STARS.map((s, i) => React.createElement('span', {
          key: 'star-' + i,
          className: 'kuru-star',
          style: {
            top: s.top,
            left: s.left,
            fontSize: s.size + 'px',
            animationDuration: s.dur + 's',
            animationDelay: s.delay + 's',
          },
        }, '✧')),
        MOONS.map((m, i) => React.createElement('span', {
          key: 'moon-' + i,
          className: 'kuru-moon',
          style: { top: m.top, right: m.right, bottom: m.bottom, left: m.left, fontSize: m.size + 'px', animationDelay: m.delay + 's' },
        }, '🌙')),
      )
    }

    // ── 星屑诅咒雨(点击使魔/按钮触发)────────────────────────────────
    function KuruRain() {
      const rain = useStoreField('rain')
      if (rain === undefined || rain.length === 0) return null
      return React.createElement('div', { className: 'kuru-rain', 'aria-hidden': 'true' },
        rain.map((it) => React.createElement('span', {
          key: it.key,
          className: 'kuru-rain-item',
          style: { left: it.left, animationDelay: it.delay + 's', fontSize: it.size + 'px', '--kuru-spin': it.spin + 'deg' },
        }, it.char)),
      )
    }

    // ── 黑猫使魔(点击:害羞→诅咒→星屑雨)────────────────────────────
    function KuruMascot() {
      const decoOn = useStoreField('decoOn')
      const [face, setFace] = React.useState('normal')
      const [poked, setPoked] = React.useState(false)
      const [phrase, setPhrase] = React.useState(PHRASES[0])
      const [bubble, setBubble] = React.useState(null)
      React.useEffect(() => ctx.interval(() => {
        phraseIdx = (phraseIdx + 1) % PHRASES.length
        setPhrase(PHRASES[phraseIdx])
      }, 12000), [])
      if (!decoOn) return null
      const poke = () => {
        pokeSeq++
        const seq = pokeSeq
        store.rainOf(RAIN_CHARS)
        setPoked(true)
        setFace('curse')
        setBubble(POKE_LINES[Math.floor(Math.random() * POKE_LINES.length)])
        ctx.timeout(() => setFace('shy'), 320)
        ctx.timeout(() => setFace('normal'), 1900)
        ctx.timeout(() => { if (seq === pokeSeq) setBubble(null) }, 4600)
      }
      return React.createElement('div', { className: 'kuru-mascot' },
        React.createElement('div', { className: 'kuru-sparkles' },
          React.createElement('span', { className: 'kuru-sparkle' }, '✦'),
          React.createElement('span', { className: 'kuru-sparkle' }, '✧'),
          React.createElement('span', { className: 'kuru-sparkle' }, '✦'),
        ),
        React.createElement('div', {
          className: 'kuru-card' + (poked ? ' poked' : ''),
          title: '戳妾身一下,会降下诅咒哦。',
          onClick: poke,
          onAnimationEnd: () => setPoked(false),
        },
          React.createElement('span', { dangerouslySetInnerHTML: { __html: kuruSvg(face) } }),
          React.createElement('span', { className: 'kuru-bubble' }, bubble !== null ? bubble : phrase),
        ),
      )
    }

    function ToggleRow(props) {
      return React.createElement('div', { className: 'kuru-row' },
        React.createElement('span', { className: 'kuru-row-label' }, props.label),
        React.createElement('button', {
          className: 'kuru-toggle' + (props.on ? ' on' : ''),
          'aria-pressed': props.on,
          onClick: () => props.onChange(!props.on),
        }, props.on ? 'ON' : 'OFF'),
      )
    }

    // ── 设置页(设置 → 黑猫领域)──────────────────────────────────────
    function KuruSettings() {
      const decoOn = useStoreField('decoOn')
      const petalsOn = useStoreField('petalsOn')
      const thinkOn = useStoreField('thinkOn')
      return React.createElement('div', { className: 'kuru-settings' },
        React.createElement('div', { className: 'kuru-settings-title' }, '†千葉の堕天聖黒猫† 黑猫领域'),
        React.createElement('div', { className: 'kuru-settings-sub' }, '动态插件 · 临时生效,重启进程即自动还原'),
        React.createElement(ToggleRow, { label: '🖤 装饰总开关(使魔/氛围/状态条)', on: decoOn, onChange: (v) => store.set('decoOn', v) }),
        React.createElement(ToggleRow, { label: '🥀 飘落特效(黑蔷薇与星屑)', on: petalsOn, onChange: (v) => store.set('petalsOn', v) }),
        React.createElement(ToggleRow, { label: '✨ 咏唱动画(跟随真实运行状态)', on: thinkOn, onChange: (v) => store.set('thinkOn', v) }),
        React.createElement('button', { className: 'kuru-curse-btn', onClick: () => store.rainOf(RAIN_CHARS) }, '🌙 降下诅咒(星屑雨)'),
        React.createElement('div', { className: 'kuru-settings-note' }, '主题为紫黑哥特双套:浅色模式是月白蕾丝,深色模式是堕天之夜。'),
        React.createElement('div', { className: 'kuru-settings-note' }, '想彻底回滚?对助手说"停用黑猫"即可——主题、使魔、装饰一次性全部还原。'),
      )
    }

    // ── Run 卡片内面板(历史可回看)───────────────────────────────────
    function KuruCard() {
      const petalsOn = useStoreField('petalsOn')
      const decoOn = useStoreField('decoOn')
      return React.createElement('div', { className: 'kuru-cardview' },
        React.createElement('div', { className: 'kuru-cardview__head' },
          React.createElement('div', { className: 'kuru-cardview__title' }, '†千葉の堕天聖黒猫†'),
          React.createElement('div', { className: 'kuru-cardview__sub' }, '五更残夜,琉璃耀月!'),
        ),
        React.createElement('div', { className: 'kuru-cardview__row' },
          React.createElement('div', { className: 'kuru-cardview__label' }, '🎨 主题'),
          React.createElement('span', null, '紫黑哥特 · light/dark 双套'),
        ),
        React.createElement('div', { className: 'kuru-cardview__row' },
          React.createElement('div', { className: 'kuru-cardview__label' }, '🧙 使魔'),
          React.createElement('span', null, decoOn ? '右下角驻守中' : '已隐去身形'),
        ),
        React.createElement('div', { className: 'kuru-cardview__row' },
          React.createElement('div', { className: 'kuru-cardview__label' }, '🥀 飘落'),
          React.createElement('span', null, petalsOn ? '黑蔷薇坠落中' : '已停息'),
        ),
        React.createElement('div', { className: 'kuru-cardview__line' }, '此领域已与命运记录同调。妾身暂且用紫与黑,将兄长的世界染上堕天之夜。'),
        React.createElement('div', { className: 'kuru-cardview__actions' },
          React.createElement('button', { className: 'kuru-cardview__btn', onClick: () => store.rainOf(RAIN_CHARS) }, '🌙 降下诅咒'),
          React.createElement('button', { className: 'kuru-cardview__btn', onClick: () => store.set('petalsOn', !petalsOn) }, '🥀 飘落切换'),
        ),
        React.createElement('div', { className: 'kuru-cardview__foot' }, '哼,才不是特意为哥哥做的呢。'),
      )
    }

    // ── Slot 注册:全部经 slots.inject 等待声明后注册,自带 dispose ──────
    if (slots !== undefined) {
      slots.inject('shell.overlay', () => slots.register(
        { name: 'shell.overlay', id: 'kuroneko-ambient', order: 10, label: '堕天氛围背景' },
        () => React.createElement(KuruAmbient),
      ))

      slots.inject('shell.overlay', () => slots.register(
        { name: 'shell.overlay', id: 'kuroneko-rain', order: 89, label: '星屑诅咒雨' },
        () => React.createElement(KuruRain),
      ))

      slots.inject('shell.overlay', () => slots.register(
        { name: 'shell.overlay', id: 'kuroneko-mascot', order: 90, label: '黑猫使魔' },
        () => React.createElement(KuruMascot),
      ))

      slots.inject('conversation.composer.dock', () => slots.register(
        { name: 'conversation.composer.dock', id: 'kuroneko-strip', order: 10, label: '黑猫状态条' },
        (props) => React.createElement(KuruStrip, { useSession: props.useSession, useInput: props.useInput }),
      ))

      slots.inject('settings.section', () => slots.register(
        { name: 'settings.section', id: 'kuroneko', order: 25, label: '黑猫领域' },
        () => React.createElement(KuruSettings),
      ))

      slots.inject('tool.view.cordis', () => slots.register(
        { name: 'tool.view.cordis', key: 'self' },
        (props) => React.createElement(KuruCard, props),
      ))
    }

    console.log('kuroneko-theme apply done')
  },
}
