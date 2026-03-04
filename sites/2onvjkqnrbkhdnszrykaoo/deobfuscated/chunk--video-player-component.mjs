import { mouseEventControls,
  useOnAppear,
  useOnDisappear,
  useIsSafari,
  useIsOnCanvas,
  useBorderRadius,
  borderRadiusControls } from "./chunk--framer-components.mjs";
import { ControlType,
  addPropertyControls,
  useIsOnFramerCanvas,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  jsx,
  isMotionValue,
  useInView } from "./chunk--react-and-framer-runtime.mjs";
var J;
(function (e) {
  ((e.Fill = "fill"),
    (e.Contain = "contain"),
    (e.Cover = "cover"),
    (e.None = "none"),
    (e.ScaleDown = "scale-down"));
})(J || (J = {}));
var K;
(function (e) {
  ((e.Video = "Upload"), (e.Url = "URL"));
})(K || (K = {}));
function me(e) {
  let {
    width: s,
    height: a,
    topLeft: c,
    topRight: p,
    bottomRight: l,
    bottomLeft: i,
    id: u,
    children: m,
    ...n
  } = e;
  return n;
}
function B(e) {
  let s = me(e);
  return jsx(Ce, { ...s });
}
function fe(e) {
  let s = useIsOnFramerCanvas(),
    a = useRef(!1),
    c = useCallback((i) => {
      if (!e.current) return;
      let u = (i === 1 ? 0.999 : i) * e.current.duration,
        m = Math.abs(e.current.currentTime - u) < 0.1;
      e.current.duration > 0 && !m && (e.current.currentTime = u);
    }, []),
    p = useCallback(() => {
      !(
        e.current.currentTime > 0 &&
        e.current.onplaying &&
        !e.current.paused &&
        !e.current.ended &&
        e.current.readyState > e.current.HAVE_CURRENT_DATA
      ) &&
        e.current &&
        !a.current &&
        s &&
        ((a.current = !0),
        e.current
          .play()
          .catch((u) => {})
          .finally(() => (a.current = !1)));
    }, []),
    l = useCallback(() => {
      !e.current || a.current || e.current.pause();
    }, []);
  return { play: p, pause: l, setProgress: c };
}
function ye({
  playingProp: e,
  muted: s,
  loop: a,
  playsinline: c,
  controls: p,
}) {
  let [l] = useState(() => e),
    [i, u] = useState(!1);
  e !== l && !i && u(!0);
  let m = l && s && a && c && !p && !i,
    n;
  return (
    m ? (n = "on-viewport") : l ? (n = "on-mount") : (n = "no-autoplay"),
    n
  );
}
var Q = !1,
  Ce = memo(function (s) {
    let {
        srcType: a,
        srcFile: c,
        srcUrl: p,
        playing: l,
        muted: i,
        playsinline: u,
        controls: m,
        progress: n,
        objectFit: $,
        backgroundColor: ee,
        onSeeked: h,
        onPause: T,
        onPlay: P,
        onEnd: S,
        onClick: H,
        onMouseEnter: te,
        onMouseLeave: ne,
        onMouseDown: re,
        onMouseUp: oe,
        poster: ae,
        posterEnabled: ie,
        startTime: z,
        volume: g,
        loop: E,
      } = s,
      o = useRef(),
      se = useIsSafari(),
      w = useRef(null),
      j = useRef(null),
      y = useIsOnCanvas(),
      le = useBorderRadius(s),
      C = y
        ? "no-autoplay"
        : ye({
            playingProp: l,
            muted: i,
            loop: E,
            playsinline: u,
            controls: m,
          }),
      D = y ? !0 : useInView(o),
      d = z === 100 ? 99.9 : z,
      { play: b, pause: M, setProgress: x } = fe(o);
    (useEffect(() => {
      y || (l ? b() : M());
    }, [l]),
      useEffect(() => {
        y || (C === "on-viewport" && (D ? b() : M()));
      }, [C, D]),
      useEffect(() => {
        if (!Q) {
          Q = !0;
          return;
        }
        let r = isMotionValue(n) ? n.get() : (n ?? 0) * 0.01;
        x((r ?? 0) || (d ?? 0) / 100);
      }, [d, c, p, n]),
      useEffect(() => {
        if (isMotionValue(n)) return n.on("change", (r) => x(r));
      }, [n]),
      useOnAppear(() => {
        w.current !== null && o.current && ((!j && E) || !w.current) && b();
      }),
      useOnDisappear(() => {
        o.current &&
          ((j.current = o.current.ended), (w.current = o.current.paused), M());
      }));
    let ue = useMemo(() => {
      let r = "";
      if (a === "URL") return p + r;
      if (a === "Upload") return c + r;
    }, [a, c, p, d]);
    return (
      useEffect(() => {
        se && o.current && C === "on-mount" && setTimeout(() => b(), 50);
      }, []),
      useEffect(() => {
        o.current && !i && (o.current.volume = (g ?? 0) / 100);
      }, [g]),
      jsx("video", {
        onClick: H,
        onMouseEnter: te,
        onMouseLeave: ne,
        onMouseDown: re,
        onMouseUp: oe,
        src: ue,
        loop: E,
        ref: o,
        onSeeked: (r) => h?.(r),
        onPause: (r) => T?.(r),
        onPlay: (r) => P?.(r),
        onEnded: (r) => S?.(r),
        autoPlay: C === "on-mount",
        poster: ie ? ae : void 0,
        onLoadedData: () => {
          o.current &&
            (o.current.currentTime < 0.3 && x((d ?? 0) * 0.01),
            C === "on-mount" && b());
        },
        controls: m,
        muted: y ? !0 : i,
        playsInline: u,
        style: {
          cursor: H ? "pointer" : "auto",
          width: "100%",
          height: "100%",
          borderRadius: le,
          display: "block",
          objectFit: $,
          backgroundColor: ee,
          objectPosition: "50% 50%",
        },
      })
    );
  });
B.displayName = "Video";
B.defaultProps = {
  srcType: "URL",
  srcUrl:
    "./assets/mixkit-clouds-sky.mp4",
  srcFile: "",
  posterEnabled: !1,
  controls: !1,
  playing: !0,
  loop: !0,
  muted: !0,
  playsinline: !0,
  restartOnEnter: !1,
  objectFit: "cover",
  backgroundColor: "rgba(0,0,0,0)",
  radius: 0,
  volume: 25,
  startTime: 0,
};
var be = /[A-Z]{2,}|[A-Z][a-z]+|[a-z]+|[A-Z]|\d+/gu;
function ve(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
function ge(e) {
  return (e.match(be) || []).map(ve).join(" ");
}
var X = ["cover", "fill", "contain", "scale-down", "none"];
addPropertyControls(B, {
  srcType: {
    type: ControlType.Enum,
    displaySegmentedControl: !0,
    title: "Source",
    options: ["URL", "Upload"],
  },
  srcUrl: {
    type: ControlType.String,
    title: "URL",
    placeholder: "../example.mp4",
    hidden(e) {
      return e.srcType === "Upload";
    },
    description:
      "Hosted video file URL. For YouTube, use the YouTube component.",
  },
  srcFile: {
    type: ControlType.File,
    title: "File",
    allowedFileTypes: ["mp4", "webm"],
    hidden(e) {
      return e.srcType === "URL";
    },
  },
  playing: {
    type: ControlType.Boolean,
    title: "Playing",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  posterEnabled: {
    type: ControlType.Boolean,
    title: "Poster",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  poster: { type: ControlType.Image, title: " ", hidden: ({ posterEnabled: e }) => !e },
  backgroundColor: { type: ControlType.Color, title: "Background" },
  ...borderRadiusControls,
  startTime: {
    title: "Start Time",
    type: ControlType.Number,
    min: 0,
    max: 100,
    step: 0.1,
    unit: "%",
  },
  loop: {
    type: ControlType.Boolean,
    title: "Loop",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  objectFit: {
    type: ControlType.Enum,
    title: "Fit",
    options: X,
    optionTitles: X.map(ge),
  },
  controls: {
    type: ControlType.Boolean,
    title: "Controls",
    enabledTitle: "Show",
    disabledTitle: "Hide",
  },
  muted: {
    type: ControlType.Boolean,
    title: "Muted",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  volume: {
    type: ControlType.Number,
    max: 100,
    min: 0,
    unit: "%",
    hidden: ({ muted: e }) => e,
  },
  onEnd: { type: ControlType.EventHandler },
  onSeeked: { type: ControlType.EventHandler },
  onPause: { type: ControlType.EventHandler },
  onPlay: { type: ControlType.EventHandler },
  ...mouseEventControls,
});
export { B as a };
