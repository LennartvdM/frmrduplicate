import {
  c as U,
  d as A,
  e as O,
  f as L,
  g as _,
  h as N,
  i as R,
} from "./chunk--framer-components.mjs";
import {
  M as t,
  P as W,
  Q as G,
  e as Y,
  g as V,
  i as f,
  l as q,
  m as v,
  n as I,
  q as k,
  t as F,
  y as Z,
} from "./chunk--react-and-framer-runtime.mjs";
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
  return k(Ce, { ...s });
}
function fe(e) {
  let s = G(),
    a = v(!1),
    c = V((i) => {
      if (!e.current) return;
      let u = (i === 1 ? 0.999 : i) * e.current.duration,
        m = Math.abs(e.current.currentTime - u) < 0.1;
      e.current.duration > 0 && !m && (e.current.currentTime = u);
    }, []),
    p = V(() => {
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
    l = V(() => {
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
  let [l] = I(() => e),
    [i, u] = I(!1);
  e !== l && !i && u(!0);
  let m = l && s && a && c && !p && !i,
    n;
  return (
    m ? (n = "on-viewport") : l ? (n = "on-mount") : (n = "no-autoplay"),
    n
  );
}
var Q = !1,
  Ce = Y(function (s) {
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
      o = v(),
      se = L(),
      w = v(null),
      j = v(null),
      y = _(),
      le = N(s),
      C = y
        ? "no-autoplay"
        : ye({
            playingProp: l,
            muted: i,
            loop: E,
            playsinline: u,
            controls: m,
          }),
      D = y ? !0 : Z(o),
      d = z === 100 ? 99.9 : z,
      { play: b, pause: M, setProgress: x } = fe(o);
    (f(() => {
      y || (l ? b() : M());
    }, [l]),
      f(() => {
        y || (C === "on-viewport" && (D ? b() : M()));
      }, [C, D]),
      f(() => {
        if (!Q) {
          Q = !0;
          return;
        }
        let r = F(n) ? n.get() : (n ?? 0) * 0.01;
        x((r ?? 0) || (d ?? 0) / 100);
      }, [d, c, p, n]),
      f(() => {
        if (F(n)) return n.on("change", (r) => x(r));
      }, [n]),
      A(() => {
        w.current !== null && o.current && ((!j && E) || !w.current) && b();
      }),
      O(() => {
        o.current &&
          ((j.current = o.current.ended), (w.current = o.current.paused), M());
      }));
    let ue = q(() => {
      let r = "";
      if (a === "URL") return p + r;
      if (a === "Upload") return c + r;
    }, [a, c, p, d]);
    return (
      f(() => {
        se && o.current && C === "on-mount" && setTimeout(() => b(), 50);
      }, []),
      f(() => {
        o.current && !i && (o.current.volume = (g ?? 0) / 100);
      }, [g]),
      k("video", {
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
    "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
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
W(B, {
  srcType: {
    type: t.Enum,
    displaySegmentedControl: !0,
    title: "Source",
    options: ["URL", "Upload"],
  },
  srcUrl: {
    type: t.String,
    title: "URL",
    placeholder: "../example.mp4",
    hidden(e) {
      return e.srcType === "Upload";
    },
    description:
      "Hosted video file URL. For YouTube, use the YouTube component.",
  },
  srcFile: {
    type: t.File,
    title: "File",
    allowedFileTypes: ["mp4", "webm"],
    hidden(e) {
      return e.srcType === "URL";
    },
  },
  playing: {
    type: t.Boolean,
    title: "Playing",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  posterEnabled: {
    type: t.Boolean,
    title: "Poster",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  poster: { type: t.Image, title: " ", hidden: ({ posterEnabled: e }) => !e },
  backgroundColor: { type: t.Color, title: "Background" },
  ...R,
  startTime: {
    title: "Start Time",
    type: t.Number,
    min: 0,
    max: 100,
    step: 0.1,
    unit: "%",
  },
  loop: {
    type: t.Boolean,
    title: "Loop",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  objectFit: {
    type: t.Enum,
    title: "Fit",
    options: X,
    optionTitles: X.map(ge),
  },
  controls: {
    type: t.Boolean,
    title: "Controls",
    enabledTitle: "Show",
    disabledTitle: "Hide",
  },
  muted: {
    type: t.Boolean,
    title: "Muted",
    enabledTitle: "Yes",
    disabledTitle: "No",
  },
  volume: {
    type: t.Number,
    max: 100,
    min: 0,
    unit: "%",
    hidden: ({ muted: e }) => e,
  },
  onEnd: { type: t.EventHandler },
  onSeeked: { type: t.EventHandler },
  onPause: { type: t.EventHandler },
  onPlay: { type: t.EventHandler },
  ...U,
});
export { B as a };
