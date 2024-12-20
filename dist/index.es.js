const be = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(be);
let G = !1;
function Ee() {
  G = !0;
}
Ee();
const Le = 1, xe = 2, ke = 8, Te = 2, Re = Symbol(), Ve = !1;
var Me = Array.isArray, ze = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, bn = Object.getOwnPropertyDescriptors, En = Object.getPrototypeOf;
function Ne(t) {
  return t();
}
function St(t) {
  for (var n = 0; n < t.length; n++)
    t[n]();
}
const R = 2, Ln = 4, tt = 8, Ft = 16, V = 32, gt = 64, Nt = 128, Z = 256, _t = 512, x = 1024, I = 2048, nt = 4096, W = 8192, K = 16384, He = 32768, qt = 65536, Ae = 1 << 17, Oe = 1 << 19, xn = 1 << 20, Ht = Symbol("$state"), De = Symbol("legacy props"), Pe = Symbol("");
function kn(t) {
  return t === this.v;
}
function Ie(t, n) {
  return t != t ? n == n : t !== n || t !== null && typeof t == "object" || typeof t == "function";
}
function Tn(t) {
  return !Ie(t, this.v);
}
function Fe(t) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function qe() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Be(t) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Ze() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function $e(t) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function Ue() {
  throw new Error("https://svelte.dev/e/state_unsafe_local_read");
}
function je() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Rn(t, n) {
  var e = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: t,
    reactions: null,
    equals: kn,
    version: 0
  };
  return e;
}
// @__NO_SIDE_EFFECTS__
function Ye(t, n = !1) {
  var r;
  const e = Rn(t);
  return n || (e.equals = Tn), G && y !== null && y.l !== null && ((r = y.l).s ?? (r.s = [])).push(e), e;
}
function D(t, n = !1) {
  return /* @__PURE__ */ We(/* @__PURE__ */ Ye(t, n));
}
// @__NO_SIDE_EFFECTS__
function We(t) {
  return d !== null && d.f & R && (z === null ? fr([t]) : z.push(t)), t;
}
function b(t, n) {
  return d !== null && Ut() && d.f & (R | Ft) && // If the source was created locally within the current derived, then
  // we allow the mutation.
  (z === null || !z.includes(t)) && je(), Ge(t, n);
}
function Ge(t, n) {
  return t.equals(n) || (t.v = n, t.version = $n(), Vn(t, I), Ut() && _ !== null && _.f & x && !(_.f & V) && (E !== null && E.includes(t) ? (N(_, I), wt(_)) : P === null ? cr([t]) : P.push(t))), n;
}
function Vn(t, n) {
  var e = t.reactions;
  if (e !== null)
    for (var r = Ut(), s = e.length, l = 0; l < s; l++) {
      var a = e[l], f = a.f;
      f & I || !r && a === _ || (N(a, n), f & (x | Z) && (f & R ? Vn(
        /** @type {Derived} */
        a,
        nt
      ) : wt(
        /** @type {Effect} */
        a
      )));
    }
}
let Ke = !1;
var Je, Qe;
// @__NO_SIDE_EFFECTS__
function pt(t) {
  return Je.call(t);
}
// @__NO_SIDE_EFFECTS__
function Mn(t) {
  return Qe.call(t);
}
function g(t, n) {
  return /* @__PURE__ */ pt(t);
}
function m(t, n = 1, e = !1) {
  let r = t;
  for (; n--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ Mn(r);
  return r;
}
// @__NO_SIDE_EFFECTS__
function Bt(t) {
  var n = R | I;
  _ === null ? n |= Z : _.f |= xn;
  var e = d !== null && d.f & R ? (
    /** @type {Derived} */
    d
  ) : null;
  const r = {
    children: null,
    ctx: y,
    deps: null,
    equals: kn,
    f: n,
    fn: t,
    reactions: null,
    v: (
      /** @type {V} */
      null
    ),
    version: 0,
    parent: e ?? _
  };
  return e !== null && (e.children ?? (e.children = [])).push(r), r;
}
// @__NO_SIDE_EFFECTS__
function Xe(t) {
  const n = /* @__PURE__ */ Bt(t);
  return n.equals = Tn, n;
}
function zn(t) {
  var n = t.children;
  if (n !== null) {
    t.children = null;
    for (var e = 0; e < n.length; e += 1) {
      var r = n[e];
      r.f & R ? Zt(
        /** @type {Derived} */
        r
      ) : rt(
        /** @type {Effect} */
        r
      );
    }
  }
}
function tr(t) {
  for (var n = t.parent; n !== null; ) {
    if (!(n.f & R))
      return (
        /** @type {Effect} */
        n
      );
    n = n.parent;
  }
  return null;
}
function Sn(t) {
  var n, e = _;
  S(tr(t));
  try {
    zn(t), n = Un(t);
  } finally {
    S(e);
  }
  return n;
}
function Nn(t) {
  var n = Sn(t), e = (B || t.f & Z) && t.deps !== null ? nt : x;
  N(t, e), t.equals(n) || (t.v = n, t.version = $n());
}
function Zt(t) {
  zn(t), X(t, 0), N(t, K), t.v = t.children = t.deps = t.ctx = t.reactions = null;
}
function Hn(t) {
  _ === null && d === null && Be(), d !== null && d.f & Z && qe(), $t && Fe();
}
function nr(t, n) {
  var e = n.last;
  e === null ? n.last = n.first = t : (e.next = t, t.prev = e, n.last = t);
}
function et(t, n, e, r = !0) {
  var s = (t & gt) !== 0, l = _, a = {
    ctx: y,
    deps: null,
    deriveds: null,
    nodes_start: null,
    nodes_end: null,
    f: t | I,
    first: null,
    fn: n,
    last: null,
    next: null,
    parent: s ? null : l,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (e) {
    var f = Y;
    try {
      hn(!0), Ct(a), a.f |= He;
    } catch (v) {
      throw rt(a), v;
    } finally {
      hn(f);
    }
  } else n !== null && wt(a);
  var o = e && a.deps === null && a.first === null && a.nodes_start === null && a.teardown === null && (a.f & xn) === 0;
  if (!o && !s && r && (l !== null && nr(a, l), d !== null && d.f & R)) {
    var c = (
      /** @type {Derived} */
      d
    );
    (c.children ?? (c.children = [])).push(a);
  }
  return a;
}
function er(t) {
  const n = et(tt, null, !1);
  return N(n, x), n.teardown = t, n;
}
function At(t) {
  Hn();
  var n = _ !== null && (_.f & V) !== 0 && y !== null && !y.m;
  if (n) {
    var e = (
      /** @type {ComponentContext} */
      y
    );
    (e.e ?? (e.e = [])).push({
      fn: t,
      effect: _,
      reaction: d
    });
  } else {
    var r = An(t);
    return r;
  }
}
function rr(t) {
  return Hn(), lr(t);
}
function An(t) {
  return et(Ln, t, !1);
}
function lr(t) {
  return et(tt, t, !0);
}
function J(t) {
  return On(t);
}
function On(t, n = 0) {
  return et(tt | Ft | n, t, !0);
}
function vn(t, n = !0) {
  return et(tt | V, t, !0, n);
}
function Dn(t) {
  var n = t.teardown;
  if (n !== null) {
    const e = $t, r = d;
    dn(!0), F(null);
    try {
      n.call(null);
    } finally {
      dn(e), F(r);
    }
  }
}
function Pn(t) {
  var n = t.deriveds;
  if (n !== null) {
    t.deriveds = null;
    for (var e = 0; e < n.length; e += 1)
      Zt(n[e]);
  }
}
function In(t, n = !1) {
  var e = t.first;
  for (t.first = t.last = null; e !== null; ) {
    var r = e.next;
    rt(e, n), e = r;
  }
}
function sr(t) {
  for (var n = t.first; n !== null; ) {
    var e = n.next;
    n.f & V || rt(n), n = e;
  }
}
function rt(t, n = !0) {
  var e = !1;
  if ((n || t.f & Oe) && t.nodes_start !== null) {
    for (var r = t.nodes_start, s = t.nodes_end; r !== null; ) {
      var l = r === s ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Mn(r)
      );
      r.remove(), r = l;
    }
    e = !0;
  }
  In(t, n && !e), Pn(t), X(t, 0), N(t, K);
  var a = t.transitions;
  if (a !== null)
    for (const o of a)
      o.stop();
  Dn(t);
  var f = t.parent;
  f !== null && f.first !== null && Fn(t), t.next = t.prev = t.teardown = t.ctx = t.deps = t.fn = t.nodes_start = t.nodes_end = null;
}
function Fn(t) {
  var n = t.parent, e = t.prev, r = t.next;
  e !== null && (e.next = r), r !== null && (r.prev = e), n !== null && (n.first === t && (n.first = r), n.last === t && (n.last = e));
}
function _n(t, n) {
  var e = [];
  qn(t, e, !0), ar(e, () => {
    rt(t), n && n();
  });
}
function ar(t, n) {
  var e = t.length;
  if (e > 0) {
    var r = () => --e || n();
    for (var s of t)
      s.out(r);
  } else
    n();
}
function qn(t, n, e) {
  if (!(t.f & W)) {
    if (t.f ^= W, t.transitions !== null)
      for (const a of t.transitions)
        (a.is_global || e) && n.push(a);
    for (var r = t.first; r !== null; ) {
      var s = r.next, l = (r.f & qt) !== 0 || (r.f & V) !== 0;
      qn(r, n, l ? e : !1), r = s;
    }
  }
}
function pn(t) {
  Bn(t, !0);
}
function Bn(t, n) {
  if (t.f & W) {
    lt(t) && Ct(t), t.f ^= W;
    for (var e = t.first; e !== null; ) {
      var r = e.next, s = (e.f & qt) !== 0 || (e.f & V) !== 0;
      Bn(e, s ? n : !1), e = r;
    }
    if (t.transitions !== null)
      for (const l of t.transitions)
        (l.is_global || n) && l.in();
  }
}
let Ot = !1, Dt = [];
function ur() {
  Ot = !1;
  const t = Dt.slice();
  Dt = [], St(t);
}
function ir(t) {
  Ot || (Ot = !0, queueMicrotask(ur)), Dt.push(t);
}
function or(t) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
let vt = !1, ht = !1, dt = null, Y = !1, $t = !1;
function hn(t) {
  Y = t;
}
function dn(t) {
  $t = t;
}
let Pt = [], Q = 0;
let d = null;
function F(t) {
  d = t;
}
let _ = null;
function S(t) {
  _ = t;
}
let z = null;
function fr(t) {
  z = t;
}
let E = null, k = 0, P = null;
function cr(t) {
  P = t;
}
let Zn = 1, B = !1, y = null;
function $n() {
  return ++Zn;
}
function Ut() {
  return !G || y !== null && y.l === null;
}
function lt(t) {
  var a, f;
  var n = t.f;
  if (n & I)
    return !0;
  if (n & nt) {
    var e = t.deps, r = (n & Z) !== 0;
    if (e !== null) {
      var s;
      if (n & _t) {
        for (s = 0; s < e.length; s++)
          ((a = e[s]).reactions ?? (a.reactions = [])).push(t);
        t.f ^= _t;
      }
      for (s = 0; s < e.length; s++) {
        var l = e[s];
        if (lt(
          /** @type {Derived} */
          l
        ) && Nn(
          /** @type {Derived} */
          l
        ), r && _ !== null && !B && !((f = l == null ? void 0 : l.reactions) != null && f.includes(t)) && (l.reactions ?? (l.reactions = [])).push(t), l.version > t.version)
          return !0;
      }
    }
    (!r || _ !== null && !B) && N(t, x);
  }
  return !1;
}
function vr(t, n) {
  for (var e = n; e !== null; ) {
    if (e.f & Nt)
      try {
        e.fn(t);
        return;
      } catch {
        e.f ^= Nt;
      }
    e = e.parent;
  }
  throw vt = !1, t;
}
function _r(t) {
  return (t.f & K) === 0 && (t.parent === null || (t.parent.f & Nt) === 0);
}
function yt(t, n, e, r) {
  if (vt) {
    if (e === null && (vt = !1), _r(n))
      throw t;
    return;
  }
  e !== null && (vt = !0);
  {
    vr(t, n);
    return;
  }
}
function Un(t) {
  var p;
  var n = E, e = k, r = P, s = d, l = B, a = z, f = y, o = t.f;
  E = /** @type {null | Value[]} */
  null, k = 0, P = null, d = o & (V | gt) ? null : t, B = !Y && (o & Z) !== 0, z = null, y = t.ctx;
  try {
    var c = (
      /** @type {Function} */
      (0, t.fn)()
    ), v = t.deps;
    if (E !== null) {
      var i;
      if (X(t, k), v !== null && k > 0)
        for (v.length = k + E.length, i = 0; i < E.length; i++)
          v[k + i] = E[i];
      else
        t.deps = v = E;
      if (!B)
        for (i = k; i < v.length; i++)
          ((p = v[i]).reactions ?? (p.reactions = [])).push(t);
    } else v !== null && k < v.length && (X(t, k), v.length = k);
    return c;
  } finally {
    E = n, k = e, P = r, d = s, B = l, z = a, y = f;
  }
}
function pr(t, n) {
  let e = n.reactions;
  if (e !== null) {
    var r = e.indexOf(t);
    if (r !== -1) {
      var s = e.length - 1;
      s === 0 ? e = n.reactions = null : (e[r] = e[s], e.pop());
    }
  }
  e === null && n.f & R && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (E === null || !E.includes(n)) && (N(n, nt), n.f & (Z | _t) || (n.f ^= _t), X(
    /** @type {Derived} **/
    n,
    0
  ));
}
function X(t, n) {
  var e = t.deps;
  if (e !== null)
    for (var r = n; r < e.length; r++)
      pr(t, e[r]);
}
function Ct(t) {
  var n = t.f;
  if (!(n & K)) {
    N(t, x);
    var e = _, r = y;
    _ = t;
    try {
      n & Ft ? sr(t) : In(t), Pn(t), Dn(t);
      var s = Un(t);
      t.teardown = typeof s == "function" ? s : null, t.version = Zn;
    } catch (l) {
      yt(l, t, e, r || t.ctx);
    } finally {
      _ = e;
    }
  }
}
function hr() {
  if (Q > 1e3) {
    Q = 0;
    try {
      Ze();
    } catch (t) {
      if (dt !== null)
        yt(t, dt, null);
      else
        throw t;
    }
  }
  Q++;
}
function dr(t) {
  var n = t.length;
  if (n !== 0) {
    hr();
    var e = Y;
    Y = !0;
    try {
      for (var r = 0; r < n; r++) {
        var s = t[r];
        s.f & x || (s.f ^= x);
        var l = [];
        jn(s, l), gr(l);
      }
    } finally {
      Y = e;
    }
  }
}
function gr(t) {
  var n = t.length;
  if (n !== 0)
    for (var e = 0; e < n; e++) {
      var r = t[e];
      if (!(r.f & (K | W)))
        try {
          lt(r) && (Ct(r), r.deps === null && r.first === null && r.nodes_start === null && (r.teardown === null ? Fn(r) : r.fn = null));
        } catch (s) {
          yt(s, r, null, r.ctx);
        }
    }
}
function yr() {
  if (ht = !1, Q > 1001)
    return;
  const t = Pt;
  Pt = [], dr(t), ht || (Q = 0, dt = null);
}
function wt(t) {
  ht || (ht = !0, queueMicrotask(yr)), dt = t;
  for (var n = t; n.parent !== null; ) {
    n = n.parent;
    var e = n.f;
    if (e & (gt | V)) {
      if (!(e & x)) return;
      n.f ^= x;
    }
  }
  Pt.push(n);
}
function jn(t, n) {
  var e = t.first, r = [];
  t: for (; e !== null; ) {
    var s = e.f, l = (s & V) !== 0, a = l && (s & x) !== 0, f = e.next;
    if (!a && !(s & W))
      if (s & tt) {
        if (l)
          e.f ^= x;
        else
          try {
            lt(e) && Ct(e);
          } catch (i) {
            yt(i, e, null, e.ctx);
          }
        var o = e.first;
        if (o !== null) {
          e = o;
          continue;
        }
      } else s & Ln && r.push(e);
    if (f === null) {
      let i = e.parent;
      for (; i !== null; ) {
        if (t === i)
          break t;
        var c = i.next;
        if (c !== null) {
          e = c;
          continue t;
        }
        i = i.parent;
      }
    }
    e = f;
  }
  for (var v = 0; v < r.length; v++)
    o = r[v], n.push(o), jn(o, n);
}
function u(t) {
  var v;
  var n = t.f, e = (n & R) !== 0;
  if (e && n & K) {
    var r = Sn(
      /** @type {Derived} */
      t
    );
    return Zt(
      /** @type {Derived} */
      t
    ), r;
  }
  if (d !== null) {
    z !== null && z.includes(t) && Ue();
    var s = d.deps;
    E === null && s !== null && s[k] === t ? k++ : E === null ? E = [t] : E.push(t), P !== null && _ !== null && _.f & x && !(_.f & V) && P.includes(t) && (N(_, I), wt(_));
  } else if (e && /** @type {Derived} */
  t.deps === null)
    for (var l = (
      /** @type {Derived} */
      t
    ), a = l.parent, f = l; a !== null; )
      if (a.f & R) {
        var o = (
          /** @type {Derived} */
          a
        );
        f = o, a = o.parent;
      } else {
        var c = (
          /** @type {Effect} */
          a
        );
        (v = c.deriveds) != null && v.includes(f) || (c.deriveds ?? (c.deriveds = [])).push(f);
        break;
      }
  return e && (l = /** @type {Derived} */
  t, lt(l) && Nn(l)), t.v;
}
function jt(t) {
  const n = d;
  try {
    return d = null, t();
  } finally {
    d = n;
  }
}
const Cr = ~(I | nt | x);
function N(t, n) {
  t.f = t.f & Cr | n;
}
function wr(t, n = !1, e) {
  y = {
    p: y,
    c: null,
    e: null,
    m: !1,
    s: t,
    x: null,
    l: null
  }, G && !n && (y.l = {
    s: null,
    u: null,
    r1: [],
    r2: Rn(!1)
  });
}
function mr(t) {
  const n = y;
  if (n !== null) {
    const a = n.e;
    if (a !== null) {
      var e = _, r = d;
      n.e = null;
      try {
        for (var s = 0; s < a.length; s++) {
          var l = a[s];
          S(l.effect), F(l.reaction), An(l.fn);
        }
      } finally {
        S(e), F(r);
      }
    }
    y = n.p, n.m = !0;
  }
  return (
    /** @type {T} */
    {}
  );
}
function br(t) {
  if (!(typeof t != "object" || !t || t instanceof EventTarget)) {
    if (Ht in t)
      It(t);
    else if (!Array.isArray(t))
      for (let n in t) {
        const e = t[n];
        typeof e == "object" && e && Ht in e && It(e);
      }
  }
}
function It(t, n = /* @__PURE__ */ new Set()) {
  if (typeof t == "object" && t !== null && // We don't want to traverse DOM elements
  !(t instanceof EventTarget) && !n.has(t)) {
    n.add(t), t instanceof Date && t.getTime();
    for (let r in t)
      try {
        It(t[r], n);
      } catch {
      }
    const e = En(t);
    if (e !== Object.prototype && e !== Array.prototype && e !== Map.prototype && e !== Set.prototype && e !== Date.prototype) {
      const r = bn(e);
      for (let s in r) {
        const l = r[s].get;
        if (l)
          try {
            l.call(t);
          } catch {
          }
      }
    }
  }
}
function Er(t) {
  var n = d, e = _;
  F(null), S(null);
  try {
    return t();
  } finally {
    F(n), S(e);
  }
}
function Lr(t, n, e, r) {
  function s(l) {
    if (r.capture || xr.call(n, l), !l.cancelBubble)
      return Er(() => e.call(this, l));
  }
  return t.startsWith("pointer") || t.startsWith("touch") || t === "wheel" ? ir(() => {
    n.addEventListener(t, s, r);
  }) : n.addEventListener(t, s, r), s;
}
function M(t, n, e, r, s) {
  var l = { capture: r, passive: s }, a = Lr(t, n, e, l);
  (n === document.body || n === window || n === document) && er(() => {
    n.removeEventListener(t, a, l);
  });
}
function xr(t) {
  var st;
  var n = this, e = (
    /** @type {Node} */
    n.ownerDocument
  ), r = t.type, s = ((st = t.composedPath) == null ? void 0 : st.call(t)) || [], l = (
    /** @type {null | Element} */
    s[0] || t.target
  ), a = 0, f = t.__root;
  if (f) {
    var o = s.indexOf(f);
    if (o !== -1 && (n === document || n === /** @type {any} */
    window)) {
      t.__root = n;
      return;
    }
    var c = s.indexOf(n);
    if (c === -1)
      return;
    o <= c && (a = o);
  }
  if (l = /** @type {Element} */
  s[a] || t.target, l !== n) {
    ze(t, "currentTarget", {
      configurable: !0,
      get() {
        return l || e;
      }
    });
    var v = d, i = _;
    F(null), S(null);
    try {
      for (var p, O = []; l !== null; ) {
        var H = l.assignedSlot || l.parentNode || /** @type {any} */
        l.host || null;
        try {
          var A = l["__" + r];
          if (A !== void 0 && !/** @type {any} */
          l.disabled)
            if (Me(A)) {
              var [T, ...w] = A;
              T.apply(l, [t, ...w]);
            } else
              A.call(l, t);
        } catch ($) {
          p ? O.push($) : p = $;
        }
        if (t.cancelBubble || H === n || H === null)
          break;
        l = H;
      }
      if (p) {
        for (let $ of O)
          queueMicrotask(() => {
            throw $;
          });
        throw p;
      }
    } finally {
      t.__root = n, delete t.currentTarget, F(v), S(i);
    }
  }
}
function Yn(t) {
  var n = document.createElement("template");
  return n.innerHTML = t, n.content;
}
function Wn(t, n) {
  var e = (
    /** @type {Effect} */
    _
  );
  e.nodes_start === null && (e.nodes_start = t, e.nodes_end = n);
}
// @__NO_SIDE_EFFECTS__
function kr(t, n) {
  var e = (n & Te) !== 0, r, s = !t.startsWith("<!>");
  return () => {
    r === void 0 && (r = Yn(s ? t : "<!>" + t), r = /** @type {Node} */
    /* @__PURE__ */ pt(r));
    var l = (
      /** @type {TemplateNode} */
      e ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    return Wn(l, l), l;
  };
}
// @__NO_SIDE_EFFECTS__
function Gn(t, n, e = "svg") {
  var r = !t.startsWith("<!>"), s = `<${e}>${r ? t : "<!>" + t}</${e}>`, l;
  return () => {
    if (!l) {
      var a = (
        /** @type {DocumentFragment} */
        Yn(s)
      ), f = (
        /** @type {Element} */
        /* @__PURE__ */ pt(a)
      );
      l = /** @type {Element} */
      /* @__PURE__ */ pt(f);
    }
    var o = (
      /** @type {TemplateNode} */
      l.cloneNode(!0)
    );
    return Wn(o, o), o;
  };
}
function zt(t, n) {
  t !== null && t.before(
    /** @type {Node} */
    n
  );
}
function ft(t, n) {
  var e = n == null ? "" : typeof n == "object" ? n + "" : n;
  e !== (t.__t ?? (t.__t = t.nodeValue)) && (t.__t = e, t.nodeValue = e == null ? "" : e + "");
}
function gn(t, n, e = !1) {
  var r = t, s = null, l = null, a = Re, f = e ? qt : 0, o = !1;
  const c = (i, p = !0) => {
    o = !0, v(p, i);
  }, v = (i, p) => {
    a !== (a = i) && (a ? (s ? pn(s) : p && (s = vn(() => p(r))), l && _n(l, () => {
      l = null;
    })) : (l ? pn(l) : p && (l = vn(() => p(r))), s && _n(s, () => {
      s = null;
    })));
  };
  On(() => {
    o = !1, n(c), o || v(null, null);
  }, f);
}
function yn(t, n) {
  var e = t.__attributes ?? (t.__attributes = {});
  e.value === (e.value = // treat null and undefined the same for the initial value
  n ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when its `0`
  t.value === n && (n !== 0 || t.nodeName !== "PROGRESS") || (t.value = n);
}
function h(t, n, e, r) {
  var s = t.__attributes ?? (t.__attributes = {});
  s[n] !== (s[n] = e) && (n === "style" && "__styles" in t && (t.__styles = {}), n === "loading" && (t[Pe] = e), e == null ? t.removeAttribute(n) : typeof e != "string" && Tr(t).includes(n) ? t[n] = e : t.setAttribute(n, e));
}
var Cn = /* @__PURE__ */ new Map();
function Tr(t) {
  var n = Cn.get(t.nodeName);
  if (n) return n;
  Cn.set(t.nodeName, n = []);
  for (var e, r = t, s = Element.prototype; s !== r; ) {
    e = bn(r);
    for (var l in e)
      e[l].set && n.push(l);
    r = En(r);
  }
  return n;
}
function wn(t, n) {
  var e = t.__className, r = Rr(n);
  (e !== r || Ke) && (n == null ? t.removeAttribute("class") : t.className = r, t.__className = r);
}
function Rr(t) {
  return t ?? "";
}
function Vr(t = !1) {
  const n = (
    /** @type {ComponentContextLegacy} */
    y
  ), e = n.l.u;
  if (!e) return;
  let r = () => br(n.s);
  if (t) {
    let s = 0, l = (
      /** @type {Record<string, any>} */
      {}
    );
    const a = /* @__PURE__ */ Bt(() => {
      let f = !1;
      const o = n.s;
      for (const c in o)
        o[c] !== l[c] && (l[c] = o[c], f = !0);
      return f && s++, s;
    });
    r = () => u(a);
  }
  e.b.length && rr(() => {
    mn(n, r), St(e.b);
  }), At(() => {
    const s = jt(() => e.m.map(Ne));
    return () => {
      for (const l of s)
        typeof l == "function" && l();
    };
  }), e.a.length && At(() => {
    mn(n, r), St(e.a);
  });
}
function mn(t, n) {
  if (t.l.s)
    for (const e of t.l.s) u(e);
  n();
}
function Mr(t) {
  y === null && or(), G && y.l !== null ? zr(y).m.push(t) : At(() => {
    const n = jt(t);
    if (typeof n == "function") return (
      /** @type {() => void} */
      n
    );
  });
}
function zr(t) {
  var n = (
    /** @type {ComponentContextLegacy} */
    t.l
  );
  return n.u ?? (n.u = { a: [], b: [], m: [] });
}
let ct = !1;
function Sr(t) {
  var n = ct;
  try {
    return ct = !1, [t(), ct];
  } finally {
    ct = n;
  }
}
function Nr(t) {
  for (var n = _, e = _; n !== null && !(n.f & (V | gt)); )
    n = n.parent;
  try {
    return S(n), t();
  } finally {
    S(e);
  }
}
function Hr(t, n, e, r) {
  var T;
  var s = (e & Le) !== 0, l = !G || (e & xe) !== 0, a = (e & ke) !== 0, f = !1, o;
  [o, f] = Sr(() => (
    /** @type {V} */
    t[n]
  ));
  var c = Ht in t || De in t, v = ((T = Se(t, n)) == null ? void 0 : T.set) ?? (c && a && n in t ? (w) => t[n] = w : void 0), i = (
    /** @type {V} */
    r
  ), p = !0, O = () => (p && (p = !1, i = jt(
    /** @type {() => V} */
    r
  )), i);
  o === void 0 && r !== void 0 && (v && l && $e(), o = O(), v && v(o));
  var H;
  if (l)
    H = () => {
      var w = (
        /** @type {V} */
        t[n]
      );
      return w === void 0 ? O() : (p = !0, w);
    };
  else {
    var A = Nr(
      () => (s ? Bt : Xe)(() => (
        /** @type {V} */
        t[n]
      ))
    );
    A.f |= Ae, H = () => {
      var w = u(A);
      return w !== void 0 && (i = /** @type {V} */
      void 0), w === void 0 ? i : w;
    };
  }
  return H;
}
const L = {
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
var Ar = /* @__PURE__ */ Gn('<path class="svelte-15c7ynz"></path>'), Or = /* @__PURE__ */ Gn('<path class="svelte-15c7ynz"></path>'), Dr = /* @__PURE__ */ kr('<div class="svelte-audio-player svelte-15c7ynz"><div class="track-name svelte-15c7ynz"><strong class="svelte-15c7ynz"> </strong> <div class="title svelte-15c7ynz"> </div></div> <div class="track-info svelte-15c7ynz"><div class="buttons-control svelte-15c7ynz"><button aria-label="Previous Track" class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button> <button class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><!></svg></button> <button aria-label="Next Track" class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button> <button aria-label="Shuffle"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path></svg></button> <button aria-label="Repeat"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button></div> <div class="track-ranges svelte-15c7ynz"><div class="progress-control svelte-15c7ynz"><div class="current-time svelte-15c7ynz"><span> </span></div> <input type="range" class="svelte-15c7ynz"> <div class="duration-time svelte-15c7ynz"><span role="button" tabindex="0"> </span></div></div> <div class="volume-control svelte-15c7ynz"><button class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path><!></svg></button> <input type="range" min="0" max="1" step="0.01" class="svelte-15c7ynz"></div></div></div></div>');
function Pr(t, n) {
  wr(n, !1);
  let e = Hr(n, "tracks", 24, () => []), r, s = D(!1), l = D(!1), a = D(!1), f = D(!1), o = !1, c = D(0), v = D(0), i = D(1), p = D(0), O = u(i);
  const H = 0, A = 0.01, T = "http://www.w3.org/2000/svg", w = "0 0 32 32";
  Mr(() => {
    e().length > 0 && (r = new Audio(e()[u(p)].src), r.volume = u(i), r.addEventListener("timeupdate", $), r.addEventListener("loadedmetadata", Kn), r.addEventListener("ended", te));
  });
  const st = () => {
    u(s) ? r.pause() : r.play(), b(s, !u(s));
  }, $ = () => {
    b(c, r.currentTime);
  }, Kn = () => {
    b(v, r.duration);
  }, Jn = (C) => {
    r.currentTime = C.target.value, b(c, r.currentTime);
  }, Qn = (C) => {
    b(i, parseFloat(C.target.value)), r.volume = u(i), b(l, u(i) === 0);
  }, Xn = () => {
    b(l, !u(l)), u(l) ? (O = u(i), b(i, 0)) : b(i, O), r.muted = u(l), r.volume = u(i);
  }, Yt = () => {
    o = !o;
  }, te = () => {
    u(f) ? (r.currentTime = 0, r.play()) : Wt();
  }, Wt = () => {
    if (u(a)) {
      let C;
      do
        C = Math.floor(Math.random() * e().length);
      while (C === u(p));
      b(p, C);
    } else u(f) || b(p, (u(p) + 1) % e().length);
    r.src = e()[u(p)].src, r.play(), b(s, !0);
  }, ne = () => {
    b(p, (u(p) - 1 + e().length) % e().length), r.src = e()[u(p)].src, r.play(), b(s, !0);
  }, ee = () => {
    b(a, !u(a));
  }, re = () => {
    b(f, !u(f));
  }, Gt = (C, q) => {
    if (isNaN(C)) return "0:00";
    const fn = (j) => {
      const ot = Math.floor(j / 60), cn = Math.floor(j % 60);
      return `${ot}:${cn < 10 ? "0" : ""}${cn}`;
    };
    if (q) {
      let j = o ? u(v) - u(c) : u(v);
      j < 0 && (j = 0);
      const ot = fn(j);
      return o ? `-${ot}` : ot;
    } else
      return fn(C);
  };
  Vr();
  var Kt = Dr(), Jt = g(Kt), Qt = g(Jt), le = g(Qt), se = m(Qt, 2), ae = g(se), ue = m(Jt, 2), Xt = g(ue), mt = g(Xt), bt = g(mt);
  h(bt, "xmlns", T), h(bt, "viewBox", w);
  var tn = g(bt), ie = m(tn), at = m(mt, 2), Et = g(at);
  h(Et, "xmlns", T), h(Et, "viewBox", w);
  var nn = g(Et), oe = m(nn);
  {
    var fe = (C) => {
      var q = Ar();
      J(() => h(q, "d", L.pauseRight)), zt(C, q);
    };
    gn(oe, (C) => {
      u(s) && C(fe);
    });
  }
  var Lt = m(at, 2), xt = g(Lt);
  h(xt, "xmlns", T), h(xt, "viewBox", w);
  var en = g(xt), ce = m(en), ut = m(Lt, 2), kt = g(ut);
  h(kt, "xmlns", T), h(kt, "viewBox", w);
  var ve = g(kt), Tt = m(ut, 2), Rt = g(Tt);
  h(Rt, "xmlns", T), h(Rt, "viewBox", w);
  var rn = g(Rt), _e = m(rn), pe = m(Xt, 2), ln = g(pe), sn = g(ln), he = g(sn), de = g(he);
  J(() => ft(de, Gt(u(c), !1)));
  var U = m(sn, 2);
  h(U, "min", H), h(U, "step", A);
  var ge = m(U, 2), Vt = g(ge), ye = g(Vt);
  J(() => ft(ye, Gt(u(c), !0)));
  var Ce = m(ln, 2), it = g(Ce), Mt = g(it);
  h(Mt, "xmlns", T), h(Mt, "viewBox", w);
  var an = g(Mt), un = m(an), we = m(un);
  {
    var me = (C) => {
      var q = Or();
      J(() => h(q, "d", L.volumeRightLine)), zt(C, q);
    };
    gn(we, (C) => {
      !u(l) && u(i) != 0 && C(me);
    });
  }
  var on = m(it, 2);
  J(() => {
    ft(le, `${u(p) + 1} / ${e().length ?? ""}`), ft(ae, `${e()[u(p)].author ?? ""} – «${e()[u(p)].title ?? ""}»`), h(tn, "d", L.previousLeft), h(ie, "d", L.previousRight), h(at, "aria-label", u(s) ? "Pause" : "Play"), h(nn, "d", u(s) ? L.pauseLeft : L.play), h(en, "d", L.nextLeft), h(ce, "d", L.nextRight), wn(ut, `${(u(a) ? "" : "shuffle") ?? ""} svelte-15c7ynz`), h(ve, "d", L.shuffle), wn(Tt, `${(u(f) ? "" : "repeat") ?? ""} svelte-15c7ynz`), h(rn, "d", L.repeatLeft), h(_e, "d", L.repeatRight), h(U, "max", u(v)), yn(U, u(c)), h(it, "aria-label", u(l) ? "Unmute" : "Mute"), h(an, "d", u(l) || u(i) == 0 ? L.muteSpeaker : L.volumeSpeaker), h(un, "d", u(l) || u(i) == 0 ? L.muteClose : L.volumeLeftLine), yn(on, u(i));
  }), M("click", mt, ne), M("click", at, st), M("click", Lt, Wt), M("click", ut, ee), M("click", Tt, re), M("input", U, Jn), M("click", Vt, Yt), M("keydown", Vt, (C) => C.key === "Enter" && Yt()), M("click", it, Xn), M("input", on, Qn), zt(t, Kt), mr();
}
export {
  Pr as default
};
