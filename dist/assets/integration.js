import { g as j, a as J, b as l1, E as i1, r as h2, c as g2, p as m2, L as c1, d as o1, e as v1, u as u1, f as K, h as I, i as Q, j as y2, k as n, l as f1, n as _1, o as V2, q as d1, s as p1, t as C1, B as h1, R as g1, v as L2, w as H2, S as m1, x as y1, y as L1, z as b1, A as z1, C as M, D as L, F as T1, G as d, H as z, I as c, J as _, K as P } from "./render.js";
const x1 = 1, E1 = 2, V1 = 8, H1 = 2, M1 = Symbol();
let k1 = !1;
function w1(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function M2(e) {
  var t = document.createElement("template");
  return t.innerHTML = e, t.content;
}
function k2(e, t) {
  var a = (
    /** @type {Effect} */
    J
  );
  a.nodes_start === null && (a.nodes_start = e, a.nodes_end = t);
}
// @__NO_SIDE_EFFECTS__
function R1(e, t) {
  var a = (t & H1) !== 0, s, l = !e.startsWith("<!>");
  return () => {
    s === void 0 && (s = M2(l ? e : "<!>" + e), s = /** @type {Node} */
    j(s));
    var r = (
      /** @type {TemplateNode} */
      a ? document.importNode(s, !0) : s.cloneNode(!0)
    );
    return k2(r, r), r;
  };
}
// @__NO_SIDE_EFFECTS__
function w2(e, t, a = "svg") {
  var s = !e.startsWith("<!>"), l = `<${a}>${s ? e : "<!>" + e}</${a}>`, r;
  return () => {
    if (!r) {
      var g = (
        /** @type {DocumentFragment} */
        M2(l)
      ), m = (
        /** @type {Element} */
        j(g)
      );
      r = /** @type {Element} */
      j(m);
    }
    var u = (
      /** @type {TemplateNode} */
      r.cloneNode(!0)
    );
    return k2(u, u), u;
  };
}
function W(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function b2(e, t, a = !1) {
  var s = e, l = null, r = null, g = M1, m = a ? i1 : 0, u = !1;
  const p = (v, o = !0) => {
    u = !0, y(o, v);
  }, y = (v, o) => {
    g !== (g = v) && (g ? (l ? h2(l) : o && (l = g2(() => o(s))), r && m2(r, () => {
      r = null;
    })) : (r ? h2(r) : o && (r = g2(() => o(s))), l && m2(l, () => {
      l = null;
    })));
  };
  l1(() => {
    u = !1, t(p), u || y(null, null);
  }, m);
}
function z2(e, t) {
  var a = e.__attributes ?? (e.__attributes = {});
  a.value === (a.value = // treat null and undefined the same for the initial value
  t ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when its `0`
  e.value === t && (t !== 0 || e.nodeName !== "PROGRESS") || (e.value = t);
}
function i(e, t, a, s) {
  var l = e.__attributes ?? (e.__attributes = {});
  l[t] !== (l[t] = a) && (t === "style" && "__styles" in e && (e.__styles = {}), t === "loading" && (e[c1] = a), a == null ? e.removeAttribute(t) : typeof a != "string" && N1(e).includes(t) ? e[t] = a : e.setAttribute(t, a));
}
var T2 = /* @__PURE__ */ new Map();
function N1(e) {
  var t = T2.get(e.nodeName);
  if (t) return t;
  T2.set(e.nodeName, t = []);
  for (var a, s = e, l = Element.prototype; l !== s; ) {
    a = v1(s);
    for (var r in a)
      a[r].set && t.push(r);
    s = o1(s);
  }
  return t;
}
function x2(e, t) {
  var a = e.__className, s = S1(t);
  (a !== s || k1) && (t == null ? e.removeAttribute("class") : e.className = s, e.__className = s);
}
function S1(e) {
  return e ?? "";
}
function P1(e = !1) {
  const t = (
    /** @type {ComponentContextLegacy} */
    I
  ), a = t.l.u;
  if (!a) return;
  let s = () => _1(t.s);
  if (e) {
    let l = 0, r = (
      /** @type {Record<string, any>} */
      {}
    );
    const g = V2(() => {
      let m = !1;
      const u = t.s;
      for (const p in u)
        u[p] !== r[p] && (r[p] = u[p], m = !0);
      return m && l++, l;
    });
    s = () => n(g);
  }
  a.b.length && u1(() => {
    E2(t, s), y2(a.b);
  }), K(() => {
    const l = Q(() => a.m.map(f1));
    return () => {
      for (const r of l)
        typeof r == "function" && r();
    };
  }), a.a.length && K(() => {
    E2(t, s), y2(a.a);
  });
}
function E2(e, t) {
  if (e.l.s)
    for (const a of e.l.s) n(a);
  t();
}
let A = !1;
function A1(e) {
  var t = A;
  try {
    return A = !1, [e(), A];
  } finally {
    A = t;
  }
}
function I1(e) {
  for (var t = J, a = J; t !== null && !(t.f & (h1 | g1)); )
    t = t.parent;
  try {
    return L2(t), e();
  } finally {
    L2(a);
  }
}
function B1(e, t, a, s) {
  var b;
  var l = (a & x1) !== 0, r = !H2 || (a & E1) !== 0, g = (a & V1) !== 0, m = !1, u;
  [u, m] = A1(() => (
    /** @type {V} */
    e[t]
  ));
  var p = m1 in e || y1 in e, y = ((b = d1(e, t)) == null ? void 0 : b.set) ?? (p && g && t in e ? (C) => e[t] = C : void 0), v = (
    /** @type {V} */
    s
  ), o = !0, V = () => (o && (o = !1, v = Q(
    /** @type {() => V} */
    s
  )), v);
  u === void 0 && s !== void 0 && (y && r && p1(), u = V(), y && y(u));
  var H;
  if (r)
    H = () => {
      var C = (
        /** @type {V} */
        e[t]
      );
      return C === void 0 ? V() : (o = !0, C);
    };
  else {
    var k = I1(
      () => (l ? V2 : L1)(() => (
        /** @type {V} */
        e[t]
      ))
    );
    k.f |= C1, H = () => {
      var C = n(k);
      return C !== void 0 && (v = /** @type {V} */
      void 0), C === void 0 ? v : C;
    };
  }
  return H;
}
function O1(e) {
  I === null && w1(), H2 && I.l !== null ? Z1(I).m.push(e) : K(() => {
    const t = Q(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function Z1(e) {
  var t = (
    /** @type {ComponentContextLegacy} */
    e.l
  );
  return t.u ?? (t.u = { a: [], b: [], m: [] });
}
const D1 = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(D1);
b1();
const h = {
  volumeSpeaker: "M17.5091 24.6595C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9992 9.36923 19.9992H4.66667C4.29848 19.9992 4 19.7007 4 19.3325V12.6658C4 12.2976 4.29848 11.9992 4.66667 11.9992H9.37115C9.39967 11.9992 9.42745 11.99 9.45039 11.9731L16.4463 6.80363C16.8863 6.47845 17.5091 6.79262 17.5091 7.3398L17.5091 24.6595Z",
  volumeLeftLine: "M27.5091 9.33336C27.8773 9.33336 28.1758 9.63184 28.1758 10V22C28.1758 22.3682 27.8773 22.6667 27.5091 22.6667H26.1758C25.8076 22.6667 25.5091 22.3682 25.5091 22V10C25.5091 9.63184 25.8076 9.33336 26.1758 9.33336L27.5091 9.33336Z",
  volumeRightLine: "M22.1758 12C22.544 12 22.8424 12.2985 22.8424 12.6667V19.3334C22.8424 19.7016 22.544 20 22.1758 20H20.8424C20.4743 20 20.1758 19.7016 20.1758 19.3334V12.6667C20.1758 12.2985 20.4743 12 20.8424 12H22.1758Z",
  muteSpeaker: "M17.5091 24.6594C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3325V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.8036C16.8863 6.47842 17.5091 6.79259 17.5091 7.33977L17.5091 24.6594Z",
  muteClose: "M28.8621 13.6422C29.1225 13.3818 29.1225 12.9597 28.8621 12.6994L27.9193 11.7566C27.659 11.4962 27.2368 11.4962 26.9765 11.7566L24.7134 14.0197C24.6613 14.0717 24.5769 14.0717 24.5248 14.0197L22.262 11.7568C22.0016 11.4964 21.5795 11.4964 21.3191 11.7568L20.3763 12.6996C20.116 12.9599 20.116 13.382 20.3763 13.6424L22.6392 15.9053C22.6913 15.9573 22.6913 16.0418 22.6392 16.0938L20.3768 18.3562C20.1165 18.6166 20.1165 19.0387 20.3768 19.299L21.3196 20.2419C21.58 20.5022 22.0021 20.5022 22.2624 20.2418L24.5248 17.9795C24.5769 17.9274 24.6613 17.9274 24.7134 17.9795L26.976 20.2421C27.2363 20.5024 27.6585 20.5024 27.9188 20.2421L28.8616 19.2992C29.122 19.0389 29.122 18.6168 28.8616 18.3564L26.599 16.0938C26.547 16.0418 26.547 15.9573 26.599 15.9053L28.8621 13.6422Z",
  play: "M10.6666 6.6548C10.6666 6.10764 11.2894 5.79346 11.7295 6.11861L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.377 16.5357L11.7295 25.8813C11.2894 26.2065 10.6666 25.8923 10.6666 25.3451L10.6666 6.6548Z",
  pauseLeft: "M8.66667 6.66667C8.29848 6.66667 8 6.96514 8 7.33333V24.6667C8 25.0349 8.29848 25.3333 8.66667 25.3333H12.6667C13.0349 25.3333 13.3333 25.0349 13.3333 24.6667V7.33333C13.3333 6.96514 13.0349 6.66667 12.6667 6.66667H8.66667Z",
  pauseRight: "M19.3333 6.66667C18.9651 6.66667 18.6667 6.96514 18.6667 7.33333V24.6667C18.6667 25.0349 18.9651 25.3333 19.3333 25.3333H23.3333C23.7015 25.3333 24 25.0349 24 24.6667V7.33333C24 6.96514 23.7015 6.66667 23.3333 6.66667H19.3333Z",
  previousLeft: "M25.1377 6.78532C25.5778 6.46017 26.2006 6.77434 26.2006 7.32151V24.6785C26.2006 25.2257 25.5778 25.5398 25.1377 25.2147L13.3924 16.5358C13.0318 16.2693 13.0318 15.7299 13.3924 15.4634L25.1377 6.78532Z",
  previousRight: "M8.00004 6.6667C8.36823 6.6667 8.66671 6.96518 8.66671 7.33337V24.6667C8.66671 25.0349 8.36823 25.3334 8.00004 25.3334H6.00004C5.63185 25.3334 5.33337 25.0349 5.33337 24.6667V7.33337C5.33337 6.96518 5.63185 6.6667 6.00004 6.6667H8.00004Z",
  nextLeft: "M6.39621 6.78532C5.95613 6.46017 5.33337 6.77434 5.33337 7.32151V24.6785C5.33337 25.2257 5.95616 25.5398 6.39623 25.2147L18.1415 16.5358C18.5022 16.2693 18.5022 15.7299 18.1415 15.4634L6.39621 6.78532Z",
  nextRight: "M23.5339 6.6667C23.1657 6.6667 22.8672 6.96518 22.8672 7.33337V24.6667C22.8672 25.0349 23.1657 25.3334 23.5339 25.3334H25.5339C25.9021 25.3334 26.2006 25.0349 26.2006 24.6667V7.33337C26.2006 6.96518 25.9021 6.6667 25.5339 6.6667H23.5339Z",
  shuffle: "M23.7295 5.65252C23.2895 5.32737 22.6667 5.64155 22.6667 6.18871V7.86672C22.6667 7.94036 22.607 8.00005 22.5334 8.00005H21.3334C18.6228 8.00005 16.2269 9.34843 14.7798 11.411C14.7251 11.489 14.6083 11.489 14.5536 11.411C13.1066 9.34843 10.7106 8.00005 8.00004 8.00005H6.00004C5.63185 8.00005 5.33337 8.29853 5.33337 8.66672V10.3998C5.33337 10.768 5.63185 11.0665 6.00004 11.0665H8.00004C10.724 11.0665 12.9336 13.2748 12.9336 16.0001C12.9336 18.7253 10.724 20.9336 8.00004 20.9336H6.00004C5.63185 20.9336 5.33337 21.2321 5.33337 21.6003V23.3334C5.33337 23.7016 5.63185 24.0001 6.00004 24.0001H8.00004C10.7106 24.0001 13.1066 22.6517 14.5536 20.5891C14.6083 20.5111 14.7251 20.5111 14.7798 20.5891C16.2269 22.6517 18.6228 24.0001 21.3334 24.0001H22.5334C22.607 24.0001 22.6667 24.0597 22.6667 24.1334V25.8113C22.6667 26.3585 23.2895 26.6727 23.7296 26.3475L28.2568 23.0022C28.6175 22.7357 28.6175 22.1963 28.2568 21.9298L23.7295 18.5848C23.2895 18.2597 22.6667 18.5738 22.6667 19.121V20.8003C22.6667 20.874 22.607 20.9336 22.5334 20.9336H21.3334C18.6094 20.9336 16.3998 18.7253 16.3998 16.0001C16.3998 13.2748 18.6094 11.0665 21.3334 11.0665H22.5334C22.607 11.0665 22.6667 11.1262 22.6667 11.1998V12.879C22.6667 13.4262 23.2895 13.7404 23.7296 13.4152L28.2568 10.0699C28.6175 9.8034 28.6175 9.26401 28.2568 8.99753L23.7295 5.65252Z",
  repeatLeft: "M22.1969 4.98846C21.7569 4.66331 21.1341 4.97748 21.1341 5.52465V7.20266C21.1341 7.27629 21.0744 7.33599 21.0008 7.33599H11.1341C8.18859 7.33599 5.80078 9.72381 5.80078 12.6693V14.6693C5.80078 15.0375 6.09925 15.336 6.46744 15.336H8.20078C8.56897 15.336 8.86744 15.0375 8.86744 14.6693V13.0691C8.86744 11.5963 10.0613 10.4024 11.5341 10.4024H21.0008C21.0744 10.4024 21.1341 10.4621 21.1341 10.5357V12.215C21.1341 12.7621 21.7569 13.0763 22.197 12.7511L26.7242 9.40583C27.0849 9.13934 27.0849 8.59995 26.7242 8.33347L22.1969 4.98846Z",
  repeatRight: "M10.8652 24.7975C10.8652 24.7238 10.9249 24.6641 10.9986 24.6641H20.8652C23.8108 24.6641 26.1986 22.2763 26.1986 19.3308V17.3308C26.1986 16.9626 25.9001 16.6641 25.5319 16.6641H23.7986C23.4304 16.6641 23.1319 16.9626 23.1319 17.3308V18.931C23.1319 20.4038 21.938 21.5977 20.4652 21.5977H10.9986C10.9249 21.5977 10.8652 21.538 10.8652 21.4644V19.7851C10.8652 19.238 10.2425 18.9238 9.80239 19.249L5.27512 22.5943C4.91447 22.8608 4.91448 23.4002 5.27514 23.6666L9.80241 27.0116C10.2425 27.3368 10.8652 27.0226 10.8652 26.4755V24.7975Z"
};
var $1 = /* @__PURE__ */ w2('<path class="svelte-15c7ynz"></path>'), F1 = /* @__PURE__ */ w2('<path class="svelte-15c7ynz"></path>'), U1 = /* @__PURE__ */ R1('<div class="svelte-audio-player svelte-15c7ynz"><div class="track-name svelte-15c7ynz"><strong class="svelte-15c7ynz"> </strong> <div class="title svelte-15c7ynz"> </div></div> <div class="track-info svelte-15c7ynz"><div class="buttons-control svelte-15c7ynz"><button aria-label="Previous Track" class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button> <button class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><!></svg></button> <button aria-label="Next Track" class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button> <button aria-label="Shuffle"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path></svg></button> <button aria-label="Repeat"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button></div> <div class="track-ranges svelte-15c7ynz"><div class="progress-control svelte-15c7ynz"><div class="current-time svelte-15c7ynz"><span> </span></div> <input type="range" class="svelte-15c7ynz"> <div class="duration-time svelte-15c7ynz"><span role="button" tabindex="0"> </span></div></div> <div class="volume-control svelte-15c7ynz"><button class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path><!></svg></button> <input type="range" min="0" max="1" step="0.01" class="svelte-15c7ynz"></div></div></div></div>');
function G1(e, t) {
  z1(t, !1);
  let a = B1(t, "tracks", 24, () => []), s, l = z(!1), r = z(!1), g = z(!1), m = z(!1), u = !1, p = z(0), y = z(0), v = z(1), o = z(0), V = n(v);
  const H = 0, k = 0.01, b = "http://www.w3.org/2000/svg", C = "0 0 32 32";
  O1(() => {
    a().length > 0 && (s = new Audio(a()[n(o)].src), s.volume = n(v), s.addEventListener("timeupdate", N2), s.addEventListener("loadedmetadata", S2), s.addEventListener("ended", B2));
  });
  const R2 = () => {
    n(l) ? s.pause() : s.play(), d(l, !n(l));
  }, N2 = () => {
    d(p, s.currentTime);
  }, S2 = () => {
    d(y, s.duration);
  }, P2 = (f) => {
    s.currentTime = f.target.value, d(p, s.currentTime);
  }, A2 = (f) => {
    d(v, parseFloat(f.target.value)), s.volume = n(v), d(r, n(v) === 0);
  }, I2 = () => {
    d(r, !n(r)), n(r) ? (V = n(v), d(v, 0)) : d(v, V), s.muted = n(r), s.volume = n(v);
  }, X = () => {
    u = !u;
  }, B2 = () => {
    n(m) ? (s.currentTime = 0, s.play()) : e2();
  }, e2 = () => {
    if (n(g)) {
      let f;
      do
        f = Math.floor(Math.random() * a().length);
      while (f === n(o));
      d(o, f);
    } else n(m) || d(o, (n(o) + 1) % a().length);
    s.src = a()[n(o)].src, s.play(), d(l, !0);
  }, O2 = () => {
    d(o, (n(o) - 1 + a().length) % a().length), s.src = a()[n(o)].src, s.play(), d(l, !0);
  }, Z2 = () => {
    d(g, !n(g));
  }, D2 = () => {
    d(m, !n(m));
  }, t2 = (f, T) => {
    if (isNaN(f)) return "0:00";
    const p2 = (E) => {
      const S = Math.floor(E / 60), C2 = Math.floor(E % 60);
      return `${S}:${C2 < 10 ? "0" : ""}${C2}`;
    };
    if (T) {
      let E = u ? n(y) - n(p) : n(y);
      E < 0 && (E = 0);
      const S = p2(E);
      return u ? `-${S}` : S;
    } else
      return p2(f);
  };
  P1();
  var a2 = U1(), s2 = c(a2), n2 = c(s2), $2 = c(n2), F2 = _(n2, 2), U2 = c(F2), G2 = _(s2, 2), r2 = c(G2), B = c(r2), O = c(B);
  i(O, "xmlns", b), i(O, "viewBox", C);
  var l2 = c(O), Y2 = _(l2), w = _(B, 2), Z = c(w);
  i(Z, "xmlns", b), i(Z, "viewBox", C);
  var i2 = c(Z), q2 = _(i2);
  {
    var W2 = (f) => {
      var T = $1();
      M(() => i(T, "d", h.pauseRight)), W(f, T);
    };
    b2(q2, (f) => {
      n(l) && f(W2);
    });
  }
  var D = _(w, 2), $ = c(D);
  i($, "xmlns", b), i($, "viewBox", C);
  var c2 = c($), j2 = _(c2), R = _(D, 2), F = c(R);
  i(F, "xmlns", b), i(F, "viewBox", C);
  var J2 = c(F), U = _(R, 2), G = c(U);
  i(G, "xmlns", b), i(G, "viewBox", C);
  var o2 = c(G), K2 = _(o2), Q2 = _(r2, 2), v2 = c(Q2), u2 = c(v2), X2 = c(u2), e1 = c(X2);
  M(() => P(e1, t2(n(p), !1)));
  var x = _(u2, 2);
  i(x, "min", H), i(x, "step", k);
  var t1 = _(x, 2), Y = c(t1), a1 = c(Y);
  M(() => P(a1, t2(n(p), !0)));
  var s1 = _(v2, 2), N = c(s1), q = c(N);
  i(q, "xmlns", b), i(q, "viewBox", C);
  var f2 = c(q), _2 = _(f2), n1 = _(_2);
  {
    var r1 = (f) => {
      var T = F1();
      M(() => i(T, "d", h.volumeRightLine)), W(f, T);
    };
    b2(n1, (f) => {
      !n(r) && n(v) != 0 && f(r1);
    });
  }
  var d2 = _(N, 2);
  M(() => {
    P($2, `${n(o) + 1} / ${a().length ?? ""}`), P(U2, `${a()[n(o)].author ?? ""} – «${a()[n(o)].title ?? ""}»`), i(l2, "d", h.previousLeft), i(Y2, "d", h.previousRight), i(w, "aria-label", n(l) ? "Pause" : "Play"), i(i2, "d", n(l) ? h.pauseLeft : h.play), i(c2, "d", h.nextLeft), i(j2, "d", h.nextRight), x2(R, `${(n(g) ? "" : "shuffle") ?? ""} svelte-15c7ynz`), i(J2, "d", h.shuffle), x2(U, `${(n(m) ? "" : "repeat") ?? ""} svelte-15c7ynz`), i(o2, "d", h.repeatLeft), i(K2, "d", h.repeatRight), i(x, "max", n(y)), z2(x, n(p)), i(N, "aria-label", n(r) ? "Unmute" : "Mute"), i(f2, "d", n(r) || n(v) == 0 ? h.muteSpeaker : h.volumeSpeaker), i(_2, "d", n(r) || n(v) == 0 ? h.muteClose : h.volumeLeftLine), z2(d2, n(v));
  }), L("click", B, O2), L("click", w, R2), L("click", D, e2), L("click", R, Z2), L("click", U, D2), L("input", x, P2), L("click", Y, X), L("keydown", Y, (f) => f.key === "Enter" && X()), L("click", N, I2), L("input", d2, A2), W(e, a2), T1();
}
const q1 = new G1({
  target: document.getElementById("svelte-audio-player"),
  props: {
    tracks: [
      {
        src: "https://muz-tv.ru/storage/files/chart-tracks/1594629860.mp3",
        author: "ЁЛКА",
        title: "Мне Легко"
      },
      {
        src: "https://muz-tv.ru/storage/files/chart-tracks/1601897430.mp3",
        author: "Artist Name",
        title: "Track Title"
      }
    ]
  }
});
export {
  q1 as default
};
