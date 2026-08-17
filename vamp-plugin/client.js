// 傲娇吸血鬼外观插件 (vamp) — Client 半区源码
// 纯外观:暗红哥特主题 + 可拖动状态面板 + 飘落特效 + Run 卡片,不含人格注入。
// 用法:本文件内容整体复制到 cordis_define 的 code.client 字段即可(与 host.js 配套)。
// 效果:暗红哥特全局主题 + 右下角可拖动面板(自定义头像/状态条/互动按钮)
//      + 全屏玫瑰花瓣飘落 + Run 卡片内面板。
// 环境约束:可用符号只有 ctx / React(createElement/useState/useEffect/useRef)/
//           host / styles / console。没有 window/document/fetch/原生定时器;
//           定时器用 ctx.interval(需 inject: ['timer']);动画全靠 CSS keyframes。

return {
  inject: ['timer'],
  apply(ctx) {
    const report = (step, msg) => {
      host.call('vamp-diag', { step, msg: msg || null }).catch(() => {})
    }

    // ── 0. 全局主题:官方 token 覆盖 + 全量变量兜底 ────────────────────
    // 坑:只覆盖 13 个官方 token 会让消息气泡(--dsw-specific-bubble)、
    // 输入框(--dsw-specific-input-major)等仍是浅色,亮色文字叠上去"隐形"。
    // 必须把 body 下整套 --dsw-alias-* 变量全量覆盖(styles.insert 兜底)。
    const theme = ctx.get('theme')
    if (theme !== undefined) {
      theme.overrideTokens('vamp', {
        '--dsw-alias-bg-base': { light: '#150a0f', dark: '#150a0f' },
        '--dsw-alias-bg-layer-1': { light: '#1c0d14', dark: '#1c0d14' },
        '--dsw-alias-bg-layer-2': { light: '#231019', dark: '#231019' },
        '--dsw-alias-bg-overlay': { light: '#30161f', dark: '#30161f' },
        '--dsw-alias-border-l1': { light: 'rgba(255,180,200,.08)', dark: 'rgba(255,180,200,.08)' },
        '--dsw-alias-border-l2': { light: 'rgba(255,180,200,.14)', dark: 'rgba(255,180,200,.14)' },
        '--dsw-alias-brand-primary': { light: '#d61f47', dark: '#d61f47' },
        '--dsw-alias-label-primary': { light: '#f3d9e3', dark: '#f3d9e3' },
        '--dsw-alias-label-secondary': { light: '#d9b0c2', dark: '#d9b0c2' },
        '--dsw-alias-state-error-primary': { light: '#ff4d6d', dark: '#ff4d6d' },
        '--dsw-alias-state-success-primary': { light: '#6fc893', dark: '#6fc893' },
        '--dsw-alias-state-warn-primary': { light: '#f2b84b', dark: '#f2b84b' },
        '--dsw-specific-sidebar-fill': { light: '#12070c', dark: '#12070c' },
      })
      report('theme-overridden')
    }

    styles.insert('body,body[data-ds-dark-theme]{--dsw-alias-bg-module-platform:#231019;--dsw-alias-bg-multi-select:#2a131d;--dsw-alias-bg-skeleton:rgba(255,255,255,.08);--dsw-alias-border-inverted2:rgba(255,180,200,.08);--dsw-alias-border-inverted:rgba(255,180,200,.06);--dsw-alias-border-l2-darkmode-thin:rgba(255,180,200,.08);--dsw-alias-border-l3:rgba(255,180,200,.18);--dsw-alias-border-l4:rgba(255,180,200,.24);--dsw-alias-brand-primary-invert:#1c0d14;--dsw-alias-brand-primary-new-colorprimary-new-color:#d61f47;--dsw-alias-brand-text:#f3d9e3;--dsw-alias-button-contrast-fill:#f3d9e3;--dsw-alias-button-elevated-fill:#2a131d;--dsw-alias-button-floating-fill:#30161f;--dsw-alias-button-floating-hover:#3a1b26;--dsw-alias-button-ghost-active-border:#b0788c;--dsw-alias-button-ghost-active-fill:#3a1b26;--dsw-alias-button-ghost-active-hover:#30161f;--dsw-alias-button-info-fill:#d61f47;--dsw-alias-button-info-hover:#e04463;--dsw-alias-button-primary-dimmed:#3a1b26;--dsw-alias-button-primary-fill:#d61f47;--dsw-alias-button-primary-hover:#e04463;--dsw-alias-button-tool-bar-fill-invisible:rgba(40,15,25,.36);--dsw-alias-button-tool-bar-fill:rgba(70,25,40,.5);--dsw-alias-button-tool-bar-hover:rgba(90,30,50,.6);--dsw-alias-interactive-bg-active:rgba(255,255,255,.14);--dsw-alias-interactive-bg-hover-accent:rgba(214,31,71,.24);--dsw-alias-interactive-bg-hover-danger:rgba(242,90,90,.15);--dsw-alias-interactive-bg-hover-solid:#2a131d;--dsw-alias-interactive-bg-hover:rgba(255,255,255,.08);--dsw-alias-label-caption:#b0788c;--dsw-alias-label-dimmed:#6d4a58;--dsw-alias-label-primary-bluish:#f3d9e3;--dsw-alias-label-primary-dimmed:#e8c4d3;--dsw-alias-label-primary-foreground:#150a0f;--dsw-alias-label-primary-inverted:#150a0f;--dsw-alias-label-tertiary:#b0788c;--dsw-alias-markdown-citation:#3a1b26;--dsw-alias-markdown-code-block-banner:#231019;--dsw-alias-markdown-code-block:#1c0d14;--dsw-alias-markdown-code-segment-selected:#2a131d;--dsw-alias-markdown-code-segment-unselected:#1c0d14;--dsw-alias-markdown-inline-code:#3a1b26;--dsw-alias-markdown-placeholder:#2a131d;--dsw-alias-markdown-tag:#3a1b26;--dsw-alias-scrollbar-bg-l1:#4d2233;--dsw-alias-scrollbar-bg-l2:#3d1a2a;--dsw-alias-scrollbar-hover-l1:#5e2a3f;--dsw-alias-scrollbar-hover-l2:#4d2233;--dsw-alias-state-business-primary:#e04463;--dsw-alias-state-business-tertiary:#3a1b26;--dsw-alias-state-error-secondary:#ff7a94;--dsw-alias-state-success-secondary:#7fd8a4;--dsw-alias-state-success-tertiary:#23402e;--dsw-alias-state-warn-label:#e8a93e;--dsw-alias-state-warn-secondary:#f7c86e;--dsw-alias-state-warn-tertiary:#40331f;--dsw-alias-toast-bg:#2a131d;--dsw-alias-tooltip-bg:#30161f;--dsw-specific-bubble-highlight:#4d2233;--dsw-specific-bubble:#231019;--dsw-specific-input-major:#1c0d14;--dsw-specific-login-input:#1c0d14;--dsw-specific-menu:#2a131d;--dsw-specific-selector:#231019;--dsw-specific-sidebar-nav-item-active-accent:#4d2233;--dsw-specific-sidebar-nav-item-active:#2a131d;--dsw-specific-sidebar-nav-item-hover:#231019;--dsw-specific-tip:#231019;--shiki-token-constant:#ff8fb0;--shiki-token-string:#8ce99a;--shiki-token-comment:#9e7388;--shiki-token-keyword:#ffb3c8;--shiki-token-parameter:#ffb86b;--shiki-token-function:#c9a8ff;--shiki-token-string-expression:#a9e8b5;--shiki-token-punctuation:#d9b0c2;--shiki-token-link:#ff9ec4}')

    // CSS 手绘头像(加载失败兜底)
    styles.insert('.vamp-ava{position:relative;width:40px;height:40px;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 62%,#f7e6ec 0%,#f2dce5 52%,#e8c8d6 100%);border:2px solid #8a2440;box-shadow:0 0 10px rgba(214,31,71,.45);flex:none}.vamp-ava__hair{position:absolute;inset:0;background:linear-gradient(180deg,#fdfbff 0%,#e6dcef 46%,#cdbdd8 47%,#b9a6c8 100%)}.vamp-ava__face{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:22px;height:20px;background:#f9edf2;border-radius:46% 46% 48% 48%}.vamp-ava__fringe{position:absolute;top:-2px;left:50%;transform:translateX(-50%);width:30px;height:15px;background:linear-gradient(180deg,#fdfbff,#e9dff2);border-radius:0 0 60% 60%/0 0 85% 85%}.vamp-ava__eye{position:absolute;top:19px;width:4.5px;height:5.5px;background:radial-gradient(circle at 50% 40%,#ff5c7a 0%,#c1133d 70%);border-radius:50%;box-shadow:0 0 3px rgba(214,31,71,.8)}.vamp-ava__eye--l{left:11px}.vamp-ava__eye--r{right:11px}.vamp-ava__fang{position:absolute;top:26px;width:0;height:0;border-left:2px solid transparent;border-right:2px solid transparent;border-top:3.5px solid #fff;filter:drop-shadow(0 1px 0 rgba(120,30,50,.3))}.vamp-ava__fang--l{left:12px}.vamp-ava__fang--r{right:12px}.vamp-ava__blush{position:absolute;top:24px;width:6px;height:3.5px;background:rgba(255,140,170,.5);border-radius:50%}.vamp-ava__blush--l{left:7px}.vamp-ava__blush--r{right:7px}.vamp-ava__bow{position:absolute;top:1px;left:4px;width:7px;height:6px;background:linear-gradient(135deg,#e04463,#8e1030);border-radius:2px;transform:rotate(-14deg);box-shadow:0 0 4px rgba(214,31,71,.6)}')

    // GIF 头像:浮动动画
    styles.insert('.vamp-bob{animation:vamp-bob 3s ease-in-out infinite;border-radius:50%;flex:none;display:block;overflow:hidden;box-shadow:0 0 12px rgba(214,31,71,.55)}.vamp-gif{display:block;object-fit:cover;border-radius:50%}@keyframes vamp-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}')

    // 自定义头像输入框
    styles.insert('.vamp-panel__input{flex:1;min-width:0;background:#2a0f18;border:1px solid #7a1f3a;border-radius:8px;padding:5px 8px;font-size:11px;color:#f3d9e3}.vamp-panel__input::placeholder{color:#a86b80}')

    // 悬浮面板(可拖动/收起)
    styles.insert('.vamp-panel{position:fixed;z-index:9995;width:252px;pointer-events:auto;background:linear-gradient(165deg,#24101a,#3a1224 55%,#46142a);border:1px solid #7a1f3a;border-radius:14px;padding:10px 12px 12px;color:#f3d9e3;box-shadow:0 6px 24px rgba(90,10,30,.5);font-family:inherit}.vamp-panel__grip{cursor:grab;text-align:center;font-size:10px;color:#c98b9e;letter-spacing:2px;padding:2px 0 6px;border-bottom:1px dashed #5a1a2c;margin-bottom:8px;touch-action:none;user-select:none}.vamp-panel__grip:active{cursor:grabbing}.vamp-panel__head{display:flex;align-items:center;gap:8px;margin-bottom:8px}.vamp-panel__title{font-size:13px;font-weight:700;color:#ffd9e4}.vamp-panel__sub{font-size:10px;color:#c98b9e}.vamp-panel__row{display:flex;align-items:center;gap:6px;margin:5px 0;font-size:11px}.vamp-panel__label{width:44px;color:#e8a9bc;flex:none}.vamp-panel__bar{flex:1;height:8px;background:#2a1119;border-radius:5px;overflow:hidden;border:1px solid #5a1a2c}.vamp-panel__fill{height:100%;border-radius:5px;transition:width .45s ease}.vamp-panel__fill--blood{background:linear-gradient(90deg,#8e1030,#d61f47)}.vamp-panel__fill--tsun{background:linear-gradient(90deg,#a34a8f,#e86bb5)}.vamp-panel__num{width:34px;text-align:right;color:#ffd9e4;font-variant-numeric:tabular-nums;flex:none}.vamp-panel__line{margin:7px 0 8px;font-size:11.5px;line-height:1.6;color:#f7dce6;background:#2a0f18;border-left:3px solid #d61f47;padding:6px 8px;border-radius:0 8px 8px 0;min-height:32px}.vamp-panel__actions{display:flex;gap:6px;flex-wrap:wrap}.vamp-panel__btn{flex:1;min-width:64px;background:linear-gradient(180deg,#4a1224,#2e0a16);color:#ffd9e4;border:1px solid #7a1f3a;border-radius:8px;padding:5px 6px;font-size:11px;cursor:pointer;transition:transform .12s ease,box-shadow .12s ease}.vamp-panel__btn:hover{transform:translateY(-1px);box-shadow:0 2px 8px rgba(214,31,71,.4)}.vamp-panel__btn:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none}.vamp-panel__btn--on{background:linear-gradient(180deg,#8e1030,#d61f47);border-color:#e04463}.vamp-peek{position:fixed;z-index:9995;pointer-events:auto;width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%,#4a1224,#24101a);border:1.5px solid #7a1f3a;box-shadow:0 4px 16px rgba(90,10,30,.5);cursor:pointer;animation:vamp-bob 2.6s ease-in-out infinite;font-family:inherit}.vamp-peek__hint{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#d61f47;color:#ffd9e4;font-size:10px;line-height:18px;text-align:center;box-shadow:0 0 6px rgba(214,31,71,.7)}')

    // 玫瑰花瓣飘落特效层
    styles.insert('.vamp-fall-layer{position:fixed;inset:0;pointer-events:none;z-index:9990;overflow:hidden}.vamp-petal{position:absolute;top:-30px;background:linear-gradient(180deg,#e04463,#8e1030);border-radius:70% 10% 70% 10%;opacity:.85;animation-name:vamp-fall;animation-timing-function:linear;animation-iteration-count:1;animation-fill-mode:forwards}.vamp-fall-emoji{position:absolute;top:-30px;opacity:.65;animation-name:vamp-fall;animation-timing-function:linear;animation-iteration-count:1;animation-fill-mode:forwards}@keyframes vamp-fall{0%{transform:translateY(-30px) rotate(0deg) translateX(0)}25%{transform:translateY(26vh) rotate(90deg) translateX(26px)}50%{transform:translateY(52vh) rotate(180deg) translateX(-20px)}75%{transform:translateY(78vh) rotate(270deg) translateX(22px)}100%{transform:translateY(112vh) rotate(360deg) translateX(0);opacity:.12}}')

    // Run 卡片内面板
    styles.insert('.vamp-card{background:linear-gradient(160deg,#1a0b10 0%,#2b0d16 55%,#3a1020 100%);border:1px solid #7a1f3a;border-radius:14px;padding:14px 16px;color:#f3d9e3;max-width:420px;box-shadow:0 4px 18px rgba(90,10,30,.35);font-family:inherit}.vamp-card__head{display:flex;align-items:center;gap:10px;margin-bottom:10px}.vamp-card__title{font-size:15px;font-weight:700;color:#ffd9e4}.vamp-card__sub{font-size:11px;color:#c98b9e;letter-spacing:.5px}.vamp-card__row{display:flex;align-items:center;gap:8px;margin:7px 0;font-size:12px}.vamp-card__label{width:52px;color:#e8a9bc;flex:none}.vamp-card__bar{flex:1;height:10px;background:#2a1119;border-radius:6px;overflow:hidden;border:1px solid #5a1a2c}.vamp-card__fill{height:100%;border-radius:6px;transition:width .45s ease}.vamp-card__fill--blood{background:linear-gradient(90deg,#8e1030,#d61f47)}.vamp-card__fill--tsun{background:linear-gradient(90deg,#a34a8f,#e86bb5)}.vamp-card__num{width:44px;text-align:right;color:#ffd9e4;font-variant-numeric:tabular-nums;flex:none}.vamp-card__mood{margin:8px 0;font-size:12px;color:#f3c6d5}.vamp-card__line{margin:8px 0 10px;font-size:12px;line-height:1.6;color:#f7dce6;background:#2a0f18;border-left:3px solid #d61f47;padding:8px 10px;border-radius:0 8px 8px 0;min-height:34px}.vamp-card__actions{display:flex;gap:8px;flex-wrap:wrap}.vamp-card__btn{flex:1;min-width:88px;background:linear-gradient(180deg,#4a1224,#2e0a16);color:#ffd9e4;border:1px solid #7a1f3a;border-radius:9px;padding:7px 8px;font-size:12px;cursor:pointer;transition:transform .12s ease,box-shadow .12s ease}.vamp-card__btn:hover{transform:translateY(-1px);box-shadow:0 2px 10px rgba(214,31,71,.35)}.vamp-card__btn:disabled{opacity:.55;cursor:default;transform:none;box-shadow:none}.vamp-card__foot{margin-top:9px;font-size:10px;text-align:right;color:#a86b80;letter-spacing:.5px}')

    const MOOD_META = {
      calm: { emoji: '😐', label: '平淡' },
      happy: { emoji: '😏', label: '嘴硬开心' },
      shy: { emoji: '😳', label: '害羞' },
      angry: { emoji: '😠', label: '气鼓鼓' },
    }

    // CSS 手绘头像(加载失败兜底)
    function Ava(props) {
      const size = props && props.size ? props.size : 40
      return React.createElement('div', { className: 'vamp-ava', style: { width: size, height: size } },
        React.createElement('div', { className: 'vamp-ava__hair' }),
        React.createElement('div', { className: 'vamp-ava__face' }),
        React.createElement('div', { className: 'vamp-ava__fringe' }),
        React.createElement('div', { className: 'vamp-ava__eye vamp-ava__eye--l' }),
        React.createElement('div', { className: 'vamp-ava__eye vamp-ava__eye--r' }),
        React.createElement('div', { className: 'vamp-ava__fang vamp-ava__fang--l' }),
        React.createElement('div', { className: 'vamp-ava__fang vamp-ava__fang--r' }),
        React.createElement('div', { className: 'vamp-ava__blush vamp-ava__blush--l' }),
        React.createElement('div', { className: 'vamp-ava__blush vamp-ava__blush--r' }),
        React.createElement('div', { className: 'vamp-ava__bow' }),
      )
    }

    // 头像组件:src 为空 → CSS 手绘头像;URL/data:URI 直接渲染;本机路径经 Host 读盘
    function VampImg(props) {
      const [uri, setUri] = React.useState(null)
      const size = props && props.size ? props.size : 56
      const src = props && props.src ? props.src : ''
      React.useEffect(() => {
        if (!src) {
          setUri(null)
          return
        }
        if (/^(https?:\/\/|data:)/i.test(src)) {
          setUri(src)
          return
        }
        let alive = true
        host.call('vamp-avatar', { src }).then((r) => {
          if (alive && r && typeof r.dataUri === 'string' && r.dataUri) setUri(r.dataUri)
        }).catch(() => {})
        return () => { alive = false }
      }, [src])
      if (!uri) return React.createElement(Ava, { size })
      return React.createElement('div', { className: 'vamp-bob', style: { width: size, height: size } },
        React.createElement('img', {
          className: 'vamp-gif',
          src: uri,
          alt: '自定义头像',
          style: { width: size, height: size },
        }),
      )
    }

    function useVampState() {
      const [status, setStatus] = React.useState(null)
      const [busy, setBusy] = React.useState(false)
      React.useEffect(() => {
        let alive = true
        host.call('vamp-status', {}).then((s) => { if (alive) setStatus(s) }).catch(() => {})
        return () => { alive = false }
      }, [])
      const act = (action) => {
        if (busy) return
        setBusy(true)
        host.call('vamp-act', { action })
          .then((s) => { setStatus(s); setBusy(false) })
          .catch(() => setBusy(false))
      }
      return { status, busy, act }
    }

    // 可拖动悬浮面板(默认右下角,可收起为头像小球;头像图由使用者自备)
    function VampOverlay() {
      const { status, busy, act } = useVampState()
      const [pos, setPos] = React.useState(null)
      const [collapsed, setCollapsed] = React.useState(false)
      const [avatarSrc, setAvatarSrc] = React.useState('')
      const drag = React.useRef(null)
      const onHandleDown = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        drag.current = { offX: e.clientX - rect.left, offY: e.clientY - rect.top }
        e.currentTarget.setPointerCapture(e.pointerId)
      }
      const onHandleMove = (e) => {
        if (!drag.current) return
        setPos({ x: e.clientX - drag.current.offX, y: e.clientY - drag.current.offY })
      }
      const onHandleUp = () => { drag.current = null }
      const fixedStyle = pos !== null ? { left: pos.x, top: pos.y } : { right: 16, bottom: 20 }

      if (collapsed) {
        return React.createElement('div', {
          className: 'vamp-peek',
          style: fixedStyle,
          onClick: () => setCollapsed(false),
          title: '露娜·卡米拉',
        },
          React.createElement(VampImg, { size: 52, src: avatarSrc }),
          React.createElement('div', { className: 'vamp-peek__hint' }, '!'),
        )
      }

      const mood = status && MOOD_META[status.mood] ? MOOD_META[status.mood] : MOOD_META.calm
      const hunger = status ? status.hunger : 0
      const tsun = status ? status.tsun : 0
      return React.createElement('div', { className: 'vamp-panel', style: fixedStyle },
        React.createElement('div', {
          className: 'vamp-panel__grip',
          onPointerDown: onHandleDown,
          onPointerMove: onHandleMove,
          onPointerUp: onHandleUp,
          onPointerCancel: onHandleUp,
        }, '✥ 拖动本小姐 ✥'),
        React.createElement('div', { className: 'vamp-panel__head' },
          React.createElement(VampImg, { size: 64, src: avatarSrc }),
          React.createElement('div', null,
            React.createElement('div', { className: 'vamp-panel__title' }, '露娜·卡米拉'),
            React.createElement('div', { className: 'vamp-panel__sub' }, '白毛红瞳吸血鬼大小姐 · ' + mood.emoji + ' ' + mood.label),
          ),
        ),
        React.createElement('div', { className: 'vamp-panel__row' },
          React.createElement('div', { className: 'vamp-panel__label' }, '🩸 饱腹'),
          React.createElement('div', { className: 'vamp-panel__bar' },
            React.createElement('div', { className: 'vamp-panel__fill vamp-panel__fill--blood', style: { width: hunger + '%' } }),
          ),
          React.createElement('div', { className: 'vamp-panel__num' }, status ? hunger + '%' : '--'),
        ),
        React.createElement('div', { className: 'vamp-panel__row' },
          React.createElement('div', { className: 'vamp-panel__label' }, '💢 傲娇'),
          React.createElement('div', { className: 'vamp-panel__bar' },
            React.createElement('div', { className: 'vamp-panel__fill vamp-panel__fill--tsun', style: { width: tsun + '%' } }),
          ),
          React.createElement('div', { className: 'vamp-panel__num' }, status ? tsun + '%' : '--'),
        ),
        React.createElement('div', { className: 'vamp-panel__line' }, status ? status.line : '……哼,本小姐还在加载状态,别急!'),
        React.createElement('div', { className: 'vamp-panel__actions' },
          React.createElement('button', { className: 'vamp-panel__btn', onClick: () => act('feed'), disabled: busy }, '🩸 投喂'),
          React.createElement('button', { className: 'vamp-panel__btn', onClick: () => act('headpat'), disabled: busy }, '🤏 摸头'),
          React.createElement('button', { className: 'vamp-panel__btn', onClick: () => act('gift'), disabled: busy }, '🎁 礼物'),
          React.createElement('button', { className: 'vamp-panel__btn', onClick: () => act('check'), disabled: busy }, '🔄 刷新'),
          React.createElement('button', { className: 'vamp-panel__btn', onClick: () => setCollapsed(true), disabled: false }, '– 收起'),
        ),
        React.createElement('div', { className: 'vamp-panel__actions' },
          React.createElement('input', {
            className: 'vamp-panel__input',
            type: 'text',
            placeholder: '自定义头像:URL / data:URI / 本机文件路径',
            value: avatarSrc,
            onChange: (e) => setAvatarSrc(e.target.value),
          }),
        ),
      )
    }

    // 飘落特效:玫瑰花瓣 + 黑心 + 血滴
    function PetalLayer() {
      const [items, setItems] = React.useState([])
      const idRef = React.useRef(0)
      React.useEffect(() => {
        return ctx.interval(() => {
          const id = idRef.current++
          const kind = id % 5
          const item = {
            id,
            kind,
            left: Math.random() * 100,
            delay: Math.random() * 4,
            dur: 7 + Math.random() * 6,
            size: 10 + Math.random() * 10,
          }
          setItems((prev) => {
            const next = [...prev, item]
            return next.length > 36 ? next.slice(next.length - 36) : next
          })
        }, 380)
      }, [])
      const remove = (id) => {
        setItems((prev) => prev.filter((x) => x.id !== id))
      }
      return React.createElement('div', { className: 'vamp-fall-layer' },
        items.map((item) => {
          if (item.kind < 2) {
            return React.createElement('span', {
              key: item.id,
              className: 'vamp-petal',
              style: {
                left: item.left + '%',
                animationDelay: item.delay + 's',
                animationDuration: item.dur + 's',
                width: item.size + 'px',
                height: (item.size * 1.35) + 'px',
              },
              onAnimationEnd: () => remove(item.id),
            })
          }
          return React.createElement('span', {
            key: item.id,
            className: 'vamp-fall-emoji',
            style: {
              left: item.left + '%',
              animationDelay: item.delay + 's',
              animationDuration: item.dur + 's',
              fontSize: item.size + 'px',
            },
            onAnimationEnd: () => remove(item.id),
          }, item.kind === 2 ? '🖤' : item.kind === 3 ? '🩸' : '🥀')
        }),
      )
    }

    function VampOverlayRoot() {
      return React.createElement(React.Fragment, null,
        React.createElement(PetalLayer),
        React.createElement(VampOverlay),
      )
    }

    // Run 卡片内面板(历史可回看)
    function VampCard(props) {
      const { status, busy, act } = useVampState()
      React.useEffect(() => {
        report('card-mounted', props && props.pluginRunId ? 'run=' + props.pluginRunId : 'no-run-id')
      }, [])
      const mood = status && MOOD_META[status.mood] ? MOOD_META[status.mood] : MOOD_META.calm
      const hunger = status ? status.hunger : 0
      const tsun = status ? status.tsun : 0
      return React.createElement('div', { className: 'vamp-card' },
        React.createElement('div', { className: 'vamp-card__head' },
          React.createElement(VampImg, { size: 64, src: '' }),
          React.createElement('div', null,
            React.createElement('div', { className: 'vamp-card__title' }, '露娜·卡米拉'),
            React.createElement('div', { className: 'vamp-card__sub' }, '白毛红瞳傲娇吸血鬼 · 才不是特意陪你的呢'),
          ),
        ),
        React.createElement('div', { className: 'vamp-card__row' },
          React.createElement('div', { className: 'vamp-card__label' }, '🩸 饱腹'),
          React.createElement('div', { className: 'vamp-card__bar' },
            React.createElement('div', { className: 'vamp-card__fill vamp-card__fill--blood', style: { width: hunger + '%' } }),
          ),
          React.createElement('div', { className: 'vamp-card__num' }, status ? hunger + '%' : '--'),
        ),
        React.createElement('div', { className: 'vamp-card__row' },
          React.createElement('div', { className: 'vamp-card__label' }, '💢 傲娇'),
          React.createElement('div', { className: 'vamp-card__bar' },
            React.createElement('div', { className: 'vamp-card__fill vamp-card__fill--tsun', style: { width: tsun + '%' } }),
          ),
          React.createElement('div', { className: 'vamp-card__num' }, status ? tsun + '%' : '--'),
        ),
        React.createElement('div', { className: 'vamp-card__mood' }, '心情: ' + mood.emoji + ' ' + mood.label),
        React.createElement('div', { className: 'vamp-card__line' }, status ? status.line : '……哼,本小姐还在加载状态,别急!'),
        React.createElement('div', { className: 'vamp-card__actions' },
          React.createElement('button', { className: 'vamp-card__btn', onClick: () => act('feed'), disabled: busy }, '🩸 投喂血包'),
          React.createElement('button', { className: 'vamp-card__btn', onClick: () => act('headpat'), disabled: busy }, '🤏 摸头'),
          React.createElement('button', { className: 'vamp-card__btn', onClick: () => act('gift'), disabled: busy }, '🎁 送礼物'),
          React.createElement('button', { className: 'vamp-card__btn', onClick: () => act('check'), disabled: busy }, '🔄 刷新'),
        ),
        React.createElement('div', { className: 'vamp-card__foot' }, '哼,才不是特意做给你的呢!'),
      )
    }

    const slots = ctx.get('slots')
    if (!slots) {
      report('no-slots-return')
      return
    }

    // 悬浮层:飘落特效 + 可拖动面板
    slots.inject('shell.overlay', () => {
      report('overlay-inject-fired')
      try {
        return slots.register(
          { name: 'shell.overlay', id: 'vamp', order: 0 },
          () => React.createElement(VampOverlayRoot),
        )
      } catch (e) {
        report('overlay-register-threw', String(e && e.message || e))
        throw e
      }
    })

    // Run 卡片内
    slots.inject('tool.view.cordis', () => {
      report('inject-fired')
      try {
        return slots.register(
          { name: 'tool.view.cordis', key: 'self' },
          (props) => React.createElement(VampCard, props),
        )
      } catch (e) {
        report('register-threw', String(e && e.message || e))
        throw e
      }
    })
    report('apply-done')
  },
}
