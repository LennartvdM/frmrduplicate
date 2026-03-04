/* CSS extracted to: chunk--shared-components.css */
/**
 * shared components
 */
import { $ as ct,
  useLocale,
  ControlType,
  addPropertyControls,
  cx,
  useDeviceSize,
  withCSS,
  ReactFragment,
  d as $,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  MotionFragment,
  useVariantState,
  jsx,
  jsxs,
  fontLoader,
  MotionContext,
  RichTextComponent,
  motion,
  LayoutGroup,
  loadFonts } from "./chunk--react-and-framer-runtime.mjs";
import { window } from "./chunk--browser-polyfills.mjs";
function U() {
  return (
    (U = Object.assign
      ? Object.assign.bind()
      : function (a) {
          for (var t = 1; t < arguments.length; t++) {
            var e = arguments[t];
            for (var i in e)
              Object.prototype.hasOwnProperty.call(e, i) && (a[i] = e[i]);
          }
          return a;
        }),
    U.apply(this, arguments)
  );
}
function N(a, t, e) {
  return Math.max(a, Math.min(t, e));
}
var G = class {
    advance(t) {
      var e;
      if (!this.isRunning) return;
      let i = !1;
      if (this.lerp)
        ((this.value =
          ((s = this.value),
          (r = this.to),
          (1 - (o = 1 - Math.exp(-60 * this.lerp * t))) * s + o * r)),
          Math.round(this.value) === this.to &&
            ((this.value = this.to), (i = !0)));
      else {
        this.currentTime += t;
        let n = N(0, this.currentTime / this.duration, 1);
        i = n >= 1;
        let l = i ? 1 : this.easing(n);
        this.value = this.from + (this.to - this.from) * l;
      }
      var s, r, o;
      ((e = this.onUpdate) == null || e.call(this, this.value, i),
        i && this.stop());
    }
    stop() {
      this.isRunning = !1;
    }
    fromTo(
      t,
      e,
      {
        lerp: i = 0.1,
        duration: s = 1,
        easing: r = (l) => l,
        onStart: o,
        onUpdate: n,
      },
    ) {
      ((this.from = this.value = t),
        (this.to = e),
        (this.lerp = i),
        (this.duration = s),
        (this.easing = r),
        (this.currentTime = 0),
        (this.isRunning = !0),
        o?.(),
        (this.onUpdate = n));
    }
  },
  K = class {
    constructor({ wrapper: t, content: e, autoResize: i = !0 } = {}) {
      if (
        ((this.resize = () => {
          (this.onWrapperResize(), this.onContentResize());
        }),
        (this.onWrapperResize = () => {
          this.wrapper === window
            ? ((this.width = window.innerWidth), (this.height = window.innerHeight))
            : ((this.width = this.wrapper.clientWidth),
              (this.height = this.wrapper.clientHeight));
        }),
        (this.onContentResize = () => {
          ((this.scrollHeight = this.content.scrollHeight),
            (this.scrollWidth = this.content.scrollWidth));
        }),
        (this.wrapper = t),
        (this.content = e),
        i)
      ) {
        let s = (function (r, o) {
          let n;
          return function () {
            let l = arguments,
              h = this;
            (clearTimeout(n),
              (n = setTimeout(function () {
                r.apply(h, l);
              }, 250)));
          };
        })(this.resize);
        (this.wrapper !== window &&
          ((this.wrapperResizeObserver = new ResizeObserver(s)),
          this.wrapperResizeObserver.observe(this.wrapper)),
          (this.contentResizeObserver = new ResizeObserver(s)),
          this.contentResizeObserver.observe(this.content));
      }
      this.resize();
    }
    destroy() {
      var t, e;
      ((t = this.wrapperResizeObserver) == null || t.disconnect(),
        (e = this.contentResizeObserver) == null || e.disconnect());
    }
    get limit() {
      return {
        x: this.scrollWidth - this.width,
        y: this.scrollHeight - this.height,
      };
    }
  },
  O = class {
    constructor() {
      this.events = {};
    }
    emit(t, ...e) {
      let i = this.events[t] || [];
      for (let s = 0, r = i.length; s < r; s++) i[s](...e);
    }
    on(t, e) {
      var i;
      return (
        ((i = this.events[t]) != null && i.push(e)) || (this.events[t] = [e]),
        () => {
          var s;
          this.events[t] =
            (s = this.events[t]) == null ? void 0 : s.filter((r) => e !== r);
        }
      );
    }
    off(t, e) {
      var i;
      this.events[t] =
        (i = this.events[t]) == null ? void 0 : i.filter((s) => e !== s);
    }
    destroy() {
      this.events = {};
    }
  },
  A = class {
    constructor(
      t,
      {
        wheelMultiplier: e = 1,
        touchMultiplier: i = 2,
        normalizeWheel: s = !1,
      },
    ) {
      ((this.onTouchStart = (r) => {
        let { clientX: o, clientY: n } = r.targetTouches
          ? r.targetTouches[0]
          : r;
        ((this.touchStart.x = o),
          (this.touchStart.y = n),
          (this.lastDelta = { x: 0, y: 0 }));
      }),
        (this.onTouchMove = (r) => {
          let { clientX: o, clientY: n } = r.targetTouches
              ? r.targetTouches[0]
              : r,
            l = -(o - this.touchStart.x) * this.touchMultiplier,
            h = -(n - this.touchStart.y) * this.touchMultiplier;
          ((this.touchStart.x = o),
            (this.touchStart.y = n),
            (this.lastDelta = { x: l, y: h }),
            this.emitter.emit("scroll", { deltaX: l, deltaY: h, event: r }));
        }),
        (this.onTouchEnd = (r) => {
          this.emitter.emit("scroll", {
            deltaX: this.lastDelta.x,
            deltaY: this.lastDelta.y,
            event: r,
          });
        }),
        (this.onWheel = (r) => {
          let { deltaX: o, deltaY: n } = r;
          (this.normalizeWheel &&
            ((o = N(-100, o, 100)), (n = N(-100, n, 100))),
            (o *= this.wheelMultiplier),
            (n *= this.wheelMultiplier),
            this.emitter.emit("scroll", { deltaX: o, deltaY: n, event: r }));
        }),
        (this.element = t),
        (this.wheelMultiplier = e),
        (this.touchMultiplier = i),
        (this.normalizeWheel = s),
        (this.touchStart = { x: null, y: null }),
        (this.emitter = new O()),
        this.element.addEventListener("wheel", this.onWheel, { passive: !1 }),
        this.element.addEventListener("touchstart", this.onTouchStart, {
          passive: !1,
        }),
        this.element.addEventListener("touchmove", this.onTouchMove, {
          passive: !1,
        }),
        this.element.addEventListener("touchend", this.onTouchEnd, {
          passive: !1,
        }));
    }
    on(t, e) {
      return this.emitter.on(t, e);
    }
    destroy() {
      (this.emitter.destroy(),
        this.element.removeEventListener("wheel", this.onWheel, {
          passive: !1,
        }),
        this.element.removeEventListener("touchstart", this.onTouchStart, {
          passive: !1,
        }),
        this.element.removeEventListener("touchmove", this.onTouchMove, {
          passive: !1,
        }),
        this.element.removeEventListener("touchend", this.onTouchEnd, {
          passive: !1,
        }));
    }
  },
  H = class {
    constructor({
      wrapper: t = window,
      content: e = document.documentElement,
      wheelEventsTarget: i = t,
      eventsTarget: s = i,
      smoothWheel: r = !0,
      smoothTouch: o = !1,
      syncTouch: n = !1,
      syncTouchLerp: l = 0.1,
      __iosNoInertiaSyncTouchLerp: h = 0.4,
      touchInertiaMultiplier: u = 35,
      duration: v,
      easing: p = (d) => Math.min(1, 1.001 - Math.pow(2, -10 * d)),
      lerp: g = !v && 0.1,
      infinite: w = !1,
      orientation: j = "vertical",
      gestureOrientation: q = "vertical",
      touchMultiplier: P = 1,
      wheelMultiplier: M = 1,
      normalizeWheel: _ = !1,
      autoResize: L = !0,
    } = {}) {
      ((this.onVirtualScroll = ({ deltaX: d, deltaY: y, event: S }) => {
        if (S.ctrlKey) return;
        let T = S.type.includes("touch"),
          Q = S.type.includes("wheel");
        if (
          (this.options.gestureOrientation === "both" && d === 0 && y === 0) ||
          (this.options.gestureOrientation === "vertical" && y === 0) ||
          (this.options.gestureOrientation === "horizontal" && d === 0) ||
          (T &&
            this.options.gestureOrientation === "vertical" &&
            this.scroll === 0 &&
            !this.options.infinite &&
            y <= 0)
        )
          return;
        let D = S.composedPath();
        if (
          ((D = D.slice(0, D.indexOf(this.rootElement))),
          D.find((x) => {
            var Z;
            return (
              (x.hasAttribute == null
                ? void 0
                : x.hasAttribute("data-lenis-prevent")) ||
              (T &&
                (x.hasAttribute == null
                  ? void 0
                  : x.hasAttribute("data-lenis-prevent-touch"))) ||
              (Q &&
                (x.hasAttribute == null
                  ? void 0
                  : x.hasAttribute("data-lenis-prevent-wheel"))) ||
              ((Z = x.classList) == null ? void 0 : Z.contains("lenis"))
            );
          }))
        )
          return;
        if (this.isStopped || this.isLocked) return void S.preventDefault();
        if (
          ((this.isSmooth =
            ((this.options.smoothTouch || this.options.syncTouch) && T) ||
            (this.options.smoothWheel && Q)),
          !this.isSmooth)
        )
          return ((this.isScrolling = !1), void this.animate.stop());
        S.preventDefault();
        let k = y;
        this.options.gestureOrientation === "both"
          ? (k = Math.abs(y) > Math.abs(d) ? y : d)
          : this.options.gestureOrientation === "horizontal" && (k = d);
        let dt = T && this.options.syncTouch,
          J = T && S.type === "touchend" && Math.abs(k) > 1;
        (J && (k = this.velocity * this.options.touchInertiaMultiplier),
          this.scrollTo(
            this.targetScroll + k,
            U(
              { programmatic: !1 },
              dt && {
                lerp: J
                  ? this.syncTouchLerp
                  : this.options.__iosNoInertiaSyncTouchLerp,
              },
            ),
          ));
      }),
        (this.onNativeScroll = () => {
          if (!this.__preventNextScrollEvent && !this.isScrolling) {
            let d = this.animatedScroll;
            ((this.animatedScroll = this.targetScroll = this.actualScroll),
              (this.velocity = 0),
              (this.direction = Math.sign(this.animatedScroll - d)),
              this.emit());
          }
        }),
        (window.lenisVersion = "1.0.29"),
        (t !== document.documentElement && t !== document.body) || (t = window),
        (this.options = {
          wrapper: t,
          content: e,
          wheelEventsTarget: i,
          eventsTarget: s,
          smoothWheel: r,
          smoothTouch: o,
          syncTouch: n,
          syncTouchLerp: l,
          __iosNoInertiaSyncTouchLerp: h,
          touchInertiaMultiplier: u,
          duration: v,
          easing: p,
          lerp: g,
          infinite: w,
          gestureOrientation: q,
          orientation: j,
          touchMultiplier: P,
          wheelMultiplier: M,
          normalizeWheel: _,
          autoResize: L,
        }),
        (this.animate = new G()),
        (this.emitter = new O()),
        (this.dimensions = new K({ wrapper: t, content: e, autoResize: L })),
        this.toggleClass("lenis", !0),
        (this.velocity = 0),
        (this.isLocked = !1),
        (this.isStopped = !1),
        (this.isSmooth = n || r || o),
        (this.isScrolling = !1),
        (this.targetScroll = this.animatedScroll = this.actualScroll),
        this.options.wrapper.addEventListener("scroll", this.onNativeScroll, {
          passive: !1,
        }),
        (this.virtualScroll = new A(s, {
          touchMultiplier: P,
          wheelMultiplier: M,
          normalizeWheel: _,
        })),
        this.virtualScroll.on("scroll", this.onVirtualScroll));
    }
    destroy() {
      (this.emitter.destroy(),
        this.options.wrapper.removeEventListener(
          "scroll",
          this.onNativeScroll,
          { passive: !1 },
        ),
        this.virtualScroll.destroy(),
        this.dimensions.destroy(),
        this.toggleClass("lenis", !1),
        this.toggleClass("lenis-smooth", !1),
        this.toggleClass("lenis-scrolling", !1),
        this.toggleClass("lenis-stopped", !1),
        this.toggleClass("lenis-locked", !1));
    }
    on(t, e) {
      return this.emitter.on(t, e);
    }
    off(t, e) {
      return this.emitter.off(t, e);
    }
    setScroll(t) {
      this.isHorizontal
        ? (this.rootElement.scrollLeft = t)
        : (this.rootElement.scrollTop = t);
    }
    resize() {
      this.dimensions.resize();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    reset() {
      ((this.isLocked = !1),
        (this.isScrolling = !1),
        (this.animatedScroll = this.targetScroll = this.actualScroll),
        (this.velocity = 0),
        this.animate.stop());
    }
    start() {
      ((this.isStopped = !1), this.reset());
    }
    stop() {
      ((this.isStopped = !0), this.animate.stop(), this.reset());
    }
    raf(t) {
      let e = t - (this.time || t);
      ((this.time = t), this.animate.advance(0.001 * e));
    }
    scrollTo(
      t,
      {
        offset: e = 0,
        immediate: i = !1,
        lock: s = !1,
        duration: r = this.options.duration,
        easing: o = this.options.easing,
        lerp: n = !r && this.options.lerp,
        onComplete: l = null,
        force: h = !1,
        programmatic: u = !0,
      } = {},
    ) {
      if ((!this.isStopped && !this.isLocked) || h) {
        if (["top", "left", "start"].includes(t)) t = 0;
        else if (["bottom", "right", "end"].includes(t)) t = this.limit;
        else {
          var v;
          let p;
          if (
            (typeof t == "string"
              ? (p = document.querySelector(t))
              : (v = t) != null && v.nodeType && (p = t),
            p)
          ) {
            if (this.options.wrapper !== window) {
              let w = this.options.wrapper.getBoundingClientRect();
              e -= this.isHorizontal ? w.left : w.top;
            }
            let g = p.getBoundingClientRect();
            t = (this.isHorizontal ? g.left : g.top) + this.animatedScroll;
          }
        }
        if (typeof t == "number") {
          if (
            ((t += e),
            (t = Math.round(t)),
            this.options.infinite
              ? u && (this.targetScroll = this.animatedScroll = this.scroll)
              : (t = N(0, t, this.limit)),
            i)
          )
            return (
              (this.animatedScroll = this.targetScroll = t),
              this.setScroll(this.scroll),
              this.reset(),
              void (l == null || l(this))
            );
          if (!u) {
            if (t === this.targetScroll) return;
            this.targetScroll = t;
          }
          this.animate.fromTo(this.animatedScroll, t, {
            duration: r,
            easing: o,
            lerp: n,
            onStart: () => {
              (s && (this.isLocked = !0), (this.isScrolling = !0));
            },
            onUpdate: (p, g) => {
              ((this.isScrolling = !0),
                (this.velocity = p - this.animatedScroll),
                (this.direction = Math.sign(this.velocity)),
                (this.animatedScroll = p),
                this.setScroll(this.scroll),
                u && (this.targetScroll = p),
                g || this.emit(),
                g &&
                  (this.reset(),
                  this.emit(),
                  l?.(this),
                  (this.__preventNextScrollEvent = !0),
                  requestAnimationFrame(() => {
                    delete this.__preventNextScrollEvent;
                  })));
            },
          });
        }
      }
    }
    get rootElement() {
      return this.options.wrapper === window
        ? document.documentElement
        : this.options.wrapper;
    }
    get limit() {
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
      return this.options.orientation === "horizontal";
    }
    get actualScroll() {
      return this.isHorizontal
        ? this.rootElement.scrollLeft
        : this.rootElement.scrollTop;
    }
    get scroll() {
      return this.options.infinite
        ? ((this.animatedScroll % (t = this.limit)) + t) % t
        : this.animatedScroll;
      var t;
    }
    get progress() {
      return this.limit === 0 ? 1 : this.scroll / this.limit;
    }
    get isSmooth() {
      return this.__isSmooth;
    }
    set isSmooth(t) {
      this.__isSmooth !== t &&
        ((this.__isSmooth = t), this.toggleClass("lenis-smooth", t));
    }
    get isScrolling() {
      return this.__isScrolling;
    }
    set isScrolling(t) {
      this.__isScrolling !== t &&
        ((this.__isScrolling = t), this.toggleClass("lenis-scrolling", t));
    }
    get isStopped() {
      return this.__isStopped;
    }
    set isStopped(t) {
      this.__isStopped !== t &&
        ((this.__isStopped = t), this.toggleClass("lenis-stopped", t));
    }
    get isLocked() {
      return this.__isLocked;
    }
    set isLocked(t) {
      this.__isLocked !== t &&
        ((this.__isLocked = t), this.toggleClass("lenis-locked", t));
    }
    get className() {
      let t = "lenis";
      return (
        this.isStopped && (t += " lenis-stopped"),
        this.isLocked && (t += " lenis-locked"),
        this.isScrolling && (t += " lenis-scrolling"),
        this.isSmooth && (t += " lenis-smooth"),
        t
      );
    }
    toggleClass(t, e) {
      (this.rootElement.classList.toggle(t, e),
        this.emitter.emit("className change", this));
    }
  };
function B(a) {
  let { intensity: t } = a,
    e = useRef(null);
  return (
    useEffect(() => {
      e.current && e.current.scrollTo(0, { immediate: !0 });
    }, [e]),
    useEffect(() => {
      let i = document.getElementById("overlay");
      if (i) {
        let s = (n, l) => {
            for (let h of n)
              if (h.type === "childList")
                if (i.children.length > 0) {
                  let v = document.documentElement;
                  window.getComputedStyle(v).getPropertyValue("overflow") ===
                  "hidden"
                    ? e.current.stop()
                    : e.current.start();
                } else e.current.start();
          },
          r = new MutationObserver(s),
          o = { childList: !0 };
        return (r.observe(i, o), () => r.disconnect());
      }
    }, []),
    useEffect(() => {
      e.current = new H({ duration: t / 10 });
      let i = (s) => {
        (e.current.raf(s), requestAnimationFrame(i));
      };
      return (
        requestAnimationFrame(i),
        () => {
          (e.current.destroy(), (e.current = null));
        }
      );
    }, []),
    jsx(MotionFragment, {
      children: jsx("style", {
        children: `
      html.lenis {
        height: auto;
      }

      .lenis.lenis-smooth {
        scroll-behavior: auto !important;
      }

      .lenis.lenis-smooth [data-lenis-prevent] {
        overscroll-behavior: contain;
      }

      .lenis.lenis-stopped {
        overflow: hidden;
      }

      .lenis.lenis-scrolling iframe {
        pointer-events: none;
      }
    `,
      }),
    })
  );
}
B.displayName = "Smooth Scroll";
addPropertyControls(B, { intensity: { title: "Intensity", type: ControlType.Number, defaultValue: 10 } });
var ft = { Rwa3hKEk5: { hover: !0 } },
  gt = ["Rwa3hKEk5", "f7_6jHMU5"],
  vt = "framer-w2DMm",
  yt = { f7_6jHMU5: "framer-v-omnff2", Rwa3hKEk5: "framer-v-1h7km6n" };
function St(a, ...t) {
  let e = {};
  return (t?.forEach((i) => i && Object.assign(e, a[i])), e);
}
var xt = { damping: 40, delay: 0, mass: 1, stiffness: 400, type: "spring" /* physics-based spring animation */ },
  wt = ({ value: a, children: t }) => {
    let e = useContext(MotionContext),
      i = a ?? e.transition,
      s = useMemo(() => ({ ...e, transition: i }), [JSON.stringify(i)]);
    return jsx(MotionContext.Provider, { value: s, children: t });
  },
  _t = motion(ReactFragment),
  bt = { Active: "f7_6jHMU5", Inactive: "Rwa3hKEk5" },
  Mt = ({ height: a, id: t, link: e, smooth: i, title: s, width: r, ...o }) => {
    var n, l, h, u;
    return {
      ...o,
      PGkyTrycd: (n = s ?? o.PGkyTrycd) !== null && n !== void 0 ? n : "Title",
      PvnQG2uF_: (l = i ?? o.PvnQG2uF_) !== null && l !== void 0 ? l : !0,
      S0KhFTFra: e ?? o.S0KhFTFra,
      variant:
        (u = (h = bt[o.variant]) !== null && h !== void 0 ? h : o.variant) !==
          null && u !== void 0
          ? u
          : "Rwa3hKEk5",
    };
  },
  Tt = (a, t) =>
    a.layoutDependency ? t.join("-") + a.layoutDependency : t.join("-"),
  kt = $(function (a, t) {
    let { activeLocale: e, setLocale: i } = useLocale(),
      {
        style: s,
        className: r,
        layoutId: o,
        variant: n,
        PGkyTrycd: l,
        S0KhFTFra: h,
        PvnQG2uF_: u,
        ...v
      } = Mt(a),
      {
        baseVariant: p,
        classNames: g,
        gestureHandlers: w,
        gestureVariant: j,
        setGestureState: q,
        setVariant: P,
        variants: M,
      } = useVariantState({
        cycleOrder: gt,
        defaultVariant: "Rwa3hKEk5",
        enabledGestures: ft,
        variant: n,
        variantClassNames: yt,
      }),
      _ = Tt(a, M),
      L = useRef(null),
      d = useId(),
      y = [],
      S = useDeviceSize();
    return jsx(LayoutGroup, {
      id: o ?? d,
      children: jsx(_t, {
        animate: M,
        initial: !1,
        children: jsx(wt, {
          value: xt,
          children: jsx(ct, {
            href: h,
            openInNewTab: !1,
            smoothScroll: u,
            children: jsxs(motion.a, {
              ...v,
              ...w,
              className: `${cx(vt, ...y, "framer-1h7km6n", r, g)} framer-1d3etll`,
              "data-framer-name": "Inactive",
              layoutDependency: _,
              layoutId: "Rwa3hKEk5",
              ref: t ?? L,
              style: { ...s },
              ...St(
                {
                  "Rwa3hKEk5-hover": { "data-framer-name": void 0 },
                  f7_6jHMU5: { "data-framer-name": "Active" },
                },
                p,
                j,
              ),
              children: [
                jsx(motion.div, {
                  className: "framer-18dmzzj",
                  layoutDependency: _,
                  layoutId: "dVn66HQMb",
                  style: {
                    backgroundColor: "rgb(255, 240, 240)",
                    borderBottomLeftRadius: 100,
                    borderBottomRightRadius: 100,
                    borderTopLeftRadius: 100,
                    borderTopRightRadius: 100,
                    opacity: 0.4,
                  },
                  variants: {
                    f7_6jHMU5: {
                      backgroundColor: "rgb(255, 255, 255)",
                      opacity: 1,
                    },
                  },
                }),
                jsx(RichTextComponent, {
                  __fromCanvasComponent: !0,
                  children: jsx(ReactFragment, {
                    children: jsx(motion.h2, {
                      style: {
                        "--font-selector": "R0Y7RE0gU2Fucy01MDA=",
                        "--framer-font-family":
                          '"DM Sans", "DM Sans Placeholder", sans-serif',
                        "--framer-font-size": "18px",
                        "--framer-font-weight": "500",
                        "--framer-line-height": "1.4em",
                        "--framer-text-color":
                          "var(--extracted-1of0zx5, rgb(255, 255, 255))",
                      },
                      children: "Carousel V2",
                    }),
                  }),
                  className: "framer-mc7b1",
                  "data-framer-name": "Title",
                  fonts: ["GF;DM Sans-500"],
                  layoutDependency: _,
                  layoutId: "YbylabICy",
                  style: {
                    "--extracted-1of0zx5": "rgb(255, 255, 255)",
                    "--framer-paragraph-spacing": "0px",
                    opacity: 0.4,
                  },
                  text: l,
                  variants: {
                    "Rwa3hKEk5-hover": { opacity: 0.8 },
                    f7_6jHMU5: { opacity: 1 },
                  },
                  verticalAlignment: "top",
                  withExternalLayout: !0,
                }),
              ],
            }),
          }),
        }),
      }),
    });
  }),
  Ct = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-w2DMm.framer-1d3etll, .framer-w2DMm .framer-1d3etll { display: block; }",
    ".framer-w2DMm.framer-1h7km6n { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; min-width: 200px; padding: 0px; position: relative; text-decoration: none; width: 200px; }",
    ".framer-w2DMm .framer-18dmzzj { flex: none; height: 2px; overflow: visible; position: relative; width: 2px; }",
    ".framer-w2DMm .framer-mc7b1 { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-w2DMm.framer-1h7km6n { gap: 0px; } .framer-w2DMm.framer-1h7km6n > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-w2DMm.framer-1h7km6n > :first-child { margin-left: 0px; } .framer-w2DMm.framer-1h7km6n > :last-child { margin-right: 0px; } }",
    ".framer-w2DMm.framer-v-omnff2.framer-1h7km6n { cursor: unset; }",
    ".framer-w2DMm.framer-v-omnff2 .framer-18dmzzj { width: 30px; }",
    ".framer-w2DMm.framer-v-1h7km6n.hover .framer-18dmzzj { width: 11px; }",
  ],
  E = withCSS(kt, Ct, "framer-w2DMm"),
  Wt = E;
E.displayName = "Item Copy 2";
E.defaultProps = { height: 25, width: 200 };
addPropertyControls(E, {
  variant: {
    options: ["Rwa3hKEk5", "f7_6jHMU5"],
    optionTitles: ["Inactive", "Active"],
    title: "Variant",
    type: ControlType.Enum,
  },
  PGkyTrycd: { defaultValue: "Title", title: "Title", type: ControlType.String },
  S0KhFTFra: { title: "Link", type: ControlType.Link },
  PvnQG2uF_: { defaultValue: !0, title: "Smooth", type: ControlType.Boolean },
});
loadFonts(
  E,
  [
    {
      explicitInter: !0,
      fonts: [
        {
          family: "DM Sans",
          source: "google",
          style: "normal",
          url: "https://fonts.gstatic.com/s/dmsans/v15/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxhS2f3ZGMZpg.woff2",
          weight: "500",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: !0 },
);
fontLoader.loadWebFontsFromSelectors(["Inter-Medium"]);
var Kt = [],
  At = [
    '.framer-9T5XM .framer-styles-preset-21ogod:not(.rich-text-wrapper), .framer-9T5XM .framer-styles-preset-21ogod.rich-text-wrapper p, .framer-9T5XM .framer-styles-preset-21ogod.rich-text-wrapper [data-preset-tag="p"] { --framer-font-family: "Inter-Medium", "Inter", sans-serif; --framer-font-size: 16px; --framer-font-style: normal; --framer-font-weight: 500; --framer-letter-spacing: 0px; --framer-line-height: 2em; --framer-paragraph-spacing: 20px; --framer-text-alignment: start; --framer-text-color: #666666; --framer-text-decoration: none; --framer-text-transform: none; }',
  ],
  Bt = "framer-9T5XM";
fontLoader.loadWebFontsFromSelectors(["Inter-ExtraBold"]);
var Jt = [],
  Zt = [
    '.framer-3fk2D .framer-styles-preset-3nqyhf:not(.rich-text-wrapper), .framer-3fk2D .framer-styles-preset-3nqyhf.rich-text-wrapper h1, .framer-3fk2D .framer-styles-preset-3nqyhf.rich-text-wrapper [data-preset-tag="h1"] { --framer-font-family: "Inter-ExtraBold", "Inter", sans-serif; --framer-font-size: 40px; --framer-font-style: normal; --framer-font-weight: 800; --framer-letter-spacing: -1.5px; --framer-line-height: 1.2em; --framer-paragraph-spacing: 0px; --framer-text-alignment: start; --framer-text-color: #111111; --framer-text-decoration: none; --framer-text-transform: none; }',
  ],
  $t = "framer-3fk2D";
function Y(a) {
  let { opacity: t, backgroundSize: e, borderRadius: i } = a;
  return jsx("div", {
    style: { ...Rt, opacity: t, backgroundSize: e, borderRadius: i },
  });
}
Y.defaultProps = { opacity: 0.5, backgroundSize: 128, radius: 0 };
addPropertyControls(Y, {
  backgroundSize: { title: "Size", type: ControlType.Number, min: 64, max: 256 },
  opacity: {
    title: "Opacity",
    type: ControlType.Number,
    step: 0.1,
    displayStepper: !0,
    max: 1,
    min: 0,
  },
  borderRadius: {
    title: "Radius",
    type: ControlType.Number,
    min: 0,
    max: 1e3,
    step: 1,
    displayStepper: !0,
  },
});
var Rt = {
  width: "100%",
  height: "100%",
  backgroundSize: "256px 256px",
  backgroundRepeat: "repeat",
  backgroundImage:
    "url('https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png')",
};
export {
  B as a,
  Y as addPropertyControls,
  Wt as window,
  Kt as d,
  At as e,
  Bt as ControlType,
  Jt as g,
  Zt as h,
  $t as i,
};
