var Mn = Array.isArray, Nn = Array.from, Rn = Object.defineProperty, At = Object.getOwnPropertyDescriptor, xe = Object.getOwnPropertyDescriptors, Te = Object.getPrototypeOf;
function An(t) {
  return t();
}
function Ht(t) {
  for (var e = 0; e < t.length; e++)
    t[e]();
}
const M = 2, Se = 4, lt = 8, Ut = 16, N = 32, st = 64, Dt = 128, $ = 256, ht = 512, T = 1024, P = 2048, at = 4096, K = 8192, X = 16384, Hn = 32768, jt = 65536, Dn = 1 << 17, On = 1 << 19, ze = 1 << 20, Ot = Symbol("$state"), In = Symbol("legacy props"), Pn = Symbol("");
function Ve(t) {
  return t === this.v;
}
function Bn(t, e) {
  return t != t ? e == e : t !== e || t !== null && typeof t == "object" || typeof t == "function";
}
function Me(t) {
  return !Bn(t, this.v);
}
function Fn(t) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function qn() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Zn(t) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function $n() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Un(t) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function jn() {
  throw new Error("https://svelte.dev/e/state_unsafe_local_read");
}
function Yn() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
let J = !1;
function Wn() {
  J = !0;
}
const Gn = 1, Kn = 2, Xn = 8, Jn = 2, Qn = Symbol();
function Ne(t, e) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: t,
    reactions: null,
    equals: Ve,
    version: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function tr(t, e = !1) {
  var r;
  const n = Ne(t);
  return e || (n.equals = Me), J && y !== null && y.l !== null && ((r = y.l).s ?? (r.s = [])).push(n), n;
}
function O(t, e = !1) {
  return /* @__PURE__ */ er(/* @__PURE__ */ tr(t, e));
}
// @__NO_SIDE_EFFECTS__
function er(t) {
  return h !== null && h.f & M && (A === null ? yr([t]) : A.push(t)), t;
}
function b(t, e) {
  return h !== null && Kt() && h.f & (M | Ut) && // If the source was created locally within the current derived, then
  // we allow the mutation.
  (A === null || !A.includes(t)) && Yn(), nr(t, e);
}
function nr(t, e) {
  return t.equals(e) || (t.v = e, t.version = Ke(), Re(t, P), Kt() && p !== null && p.f & T && !(p.f & N) && (L !== null && L.includes(t) ? (D(p, P), Et(p)) : I === null ? Cr([t]) : I.push(t))), e;
}
function Re(t, e) {
  var n = t.reactions;
  if (n !== null)
    for (var r = Kt(), s = n.length, l = 0; l < s; l++) {
      var a = n[l], c = a.f;
      c & P || !r && a === p || (D(a, e), c & (T | $) && (c & M ? Re(
        /** @type {Derived} */
        a,
        at
      ) : Et(
        /** @type {Effect} */
        a
      )));
    }
}
let rr = !1;
var he, Ae, He;
function lr() {
  if (he === void 0) {
    he = window;
    var t = Element.prototype, e = Node.prototype;
    Ae = At(e, "firstChild").get, He = At(e, "nextSibling").get, t.__click = void 0, t.__className = "", t.__attributes = null, t.__styles = null, t.__e = void 0, Text.prototype.__t = void 0;
  }
}
function sr(t = "") {
  return document.createTextNode(t);
}
// @__NO_SIDE_EFFECTS__
function gt(t) {
  return Ae.call(t);
}
// @__NO_SIDE_EFFECTS__
function De(t) {
  return He.call(t);
}
function g(t, e) {
  return /* @__PURE__ */ gt(t);
}
function E(t, e = 1, n = !1) {
  let r = t;
  for (; e--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ De(r);
  return r;
}
// @__NO_SIDE_EFFECTS__
function Yt(t) {
  var e = M | P;
  p === null ? e |= $ : p.f |= ze;
  var n = h !== null && h.f & M ? (
    /** @type {Derived} */
    h
  ) : null;
  const r = {
    children: null,
    ctx: y,
    deps: null,
    equals: Ve,
    f: e,
    fn: t,
    reactions: null,
    v: (
      /** @type {V} */
      null
    ),
    version: 0,
    parent: n ?? p
  };
  return n !== null && (n.children ?? (n.children = [])).push(r), r;
}
// @__NO_SIDE_EFFECTS__
function ar(t) {
  const e = /* @__PURE__ */ Yt(t);
  return e.equals = Me, e;
}
function Oe(t) {
  var e = t.children;
  if (e !== null) {
    t.children = null;
    for (var n = 0; n < e.length; n += 1) {
      var r = e[n];
      r.f & M ? Wt(
        /** @type {Derived} */
        r
      ) : Z(
        /** @type {Effect} */
        r
      );
    }
  }
}
function ur(t) {
  for (var e = t.parent; e !== null; ) {
    if (!(e.f & M))
      return (
        /** @type {Effect} */
        e
      );
    e = e.parent;
  }
  return null;
}
function Ie(t) {
  var e, n = p;
  H(ur(t));
  try {
    Oe(t), e = Xe(t);
  } finally {
    H(n);
  }
  return e;
}
function Pe(t) {
  var e = Ie(t), n = (q || t.f & $) && t.deps !== null ? at : T;
  D(t, n), t.equals(e) || (t.v = e, t.version = Ke());
}
function Wt(t) {
  Oe(t), rt(t, 0), D(t, X), t.v = t.children = t.deps = t.ctx = t.reactions = null;
}
function Be(t) {
  p === null && h === null && Zn(), h !== null && h.f & $ && qn(), Gt && Fn();
}
function ir(t, e) {
  var n = e.last;
  n === null ? e.last = e.first = t : (n.next = t, t.prev = n, e.last = t);
}
function Q(t, e, n, r = !0) {
  var s = (t & st) !== 0, l = p, a = {
    ctx: y,
    deps: null,
    deriveds: null,
    nodes_start: null,
    nodes_end: null,
    f: t | P,
    first: null,
    fn: e,
    last: null,
    next: null,
    parent: s ? null : l,
    prev: null,
    teardown: null,
    transitions: null,
    version: 0
  };
  if (n) {
    var c = G;
    try {
      ye(!0), wt(a), a.f |= Hn;
    } catch (_) {
      throw Z(a), _;
    } finally {
      ye(c);
    }
  } else e !== null && Et(a);
  var o = n && a.deps === null && a.first === null && a.nodes_start === null && a.teardown === null && (a.f & ze) === 0;
  if (!o && !s && r && (l !== null && ir(a, l), h !== null && h.f & M)) {
    var v = (
      /** @type {Derived} */
      h
    );
    (v.children ?? (v.children = [])).push(a);
  }
  return a;
}
function or(t) {
  const e = Q(lt, null, !1);
  return D(e, T), e.teardown = t, e;
}
function It(t) {
  Be();
  var e = p !== null && (p.f & N) !== 0 && y !== null && !y.m;
  if (e) {
    var n = (
      /** @type {ComponentContext} */
      y
    );
    (n.e ?? (n.e = [])).push({
      fn: t,
      effect: p,
      reaction: h
    });
  } else {
    var r = Fe(t);
    return r;
  }
}
function fr(t) {
  return Be(), vr(t);
}
function cr(t) {
  const e = Q(st, t, !0);
  return (n = {}) => new Promise((r) => {
    n.outro ? Bt(e, () => {
      Z(e), r(void 0);
    }) : (Z(e), r(void 0));
  });
}
function Fe(t) {
  return Q(Se, t, !1);
}
function vr(t) {
  return Q(lt, t, !0);
}
function tt(t) {
  return qe(t);
}
function qe(t, e = 0) {
  return Q(lt | Ut | e, t, !0);
}
function Pt(t, e = !0) {
  return Q(lt | N, t, !0, e);
}
function Ze(t) {
  var e = t.teardown;
  if (e !== null) {
    const n = Gt, r = h;
    Ce(!0), B(null);
    try {
      e.call(null);
    } finally {
      Ce(n), B(r);
    }
  }
}
function $e(t) {
  var e = t.deriveds;
  if (e !== null) {
    t.deriveds = null;
    for (var n = 0; n < e.length; n += 1)
      Wt(e[n]);
  }
}
function Ue(t, e = !1) {
  var n = t.first;
  for (t.first = t.last = null; n !== null; ) {
    var r = n.next;
    Z(n, e), n = r;
  }
}
function _r(t) {
  for (var e = t.first; e !== null; ) {
    var n = e.next;
    e.f & N || Z(e), e = n;
  }
}
function Z(t, e = !0) {
  var n = !1;
  if ((e || t.f & On) && t.nodes_start !== null) {
    for (var r = t.nodes_start, s = t.nodes_end; r !== null; ) {
      var l = r === s ? null : (
        /** @type {TemplateNode} */
        /* @__PURE__ */ De(r)
      );
      r.remove(), r = l;
    }
    n = !0;
  }
  Ue(t, e && !n), $e(t), rt(t, 0), D(t, X);
  var a = t.transitions;
  if (a !== null)
    for (const o of a)
      o.stop();
  Ze(t);
  var c = t.parent;
  c !== null && c.first !== null && je(t), t.next = t.prev = t.teardown = t.ctx = t.deps = t.fn = t.nodes_start = t.nodes_end = null;
}
function je(t) {
  var e = t.parent, n = t.prev, r = t.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), e !== null && (e.first === t && (e.first = r), e.last === t && (e.last = n));
}
function Bt(t, e) {
  var n = [];
  Ye(t, n, !0), pr(n, () => {
    Z(t), e && e();
  });
}
function pr(t, e) {
  var n = t.length;
  if (n > 0) {
    var r = () => --n || e();
    for (var s of t)
      s.out(r);
  } else
    e();
}
function Ye(t, e, n) {
  if (!(t.f & K)) {
    if (t.f ^= K, t.transitions !== null)
      for (const a of t.transitions)
        (a.is_global || n) && e.push(a);
    for (var r = t.first; r !== null; ) {
      var s = r.next, l = (r.f & jt) !== 0 || (r.f & N) !== 0;
      Ye(r, e, l ? n : !1), r = s;
    }
  }
}
function ge(t) {
  We(t, !0);
}
function We(t, e) {
  if (t.f & K) {
    ut(t) && wt(t), t.f ^= K;
    for (var n = t.first; n !== null; ) {
      var r = n.next, s = (n.f & jt) !== 0 || (n.f & N) !== 0;
      We(n, s ? e : !1), n = r;
    }
    if (t.transitions !== null)
      for (const l of t.transitions)
        (l.is_global || e) && l.in();
  }
}
let Ft = !1, qt = [];
function dr() {
  Ft = !1;
  const t = qt.slice();
  qt = [], Ht(t);
}
function hr(t) {
  Ft || (Ft = !0, queueMicrotask(dr)), qt.push(t);
}
function gr(t) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
let dt = !1, yt = !1, Ct = null, G = !1, Gt = !1;
function ye(t) {
  G = t;
}
function Ce(t) {
  Gt = t;
}
let Zt = [], nt = 0;
let h = null;
function B(t) {
  h = t;
}
let p = null;
function H(t) {
  p = t;
}
let A = null;
function yr(t) {
  A = t;
}
let L = null, S = 0, I = null;
function Cr(t) {
  I = t;
}
let Ge = 1, q = !1, y = null;
function Ke() {
  return ++Ge;
}
function Kt() {
  return !J || y !== null && y.l === null;
}
function ut(t) {
  var a, c;
  var e = t.f;
  if (e & P)
    return !0;
  if (e & at) {
    var n = t.deps, r = (e & $) !== 0;
    if (n !== null) {
      var s;
      if (e & ht) {
        for (s = 0; s < n.length; s++)
          ((a = n[s]).reactions ?? (a.reactions = [])).push(t);
        t.f ^= ht;
      }
      for (s = 0; s < n.length; s++) {
        var l = n[s];
        if (ut(
          /** @type {Derived} */
          l
        ) && Pe(
          /** @type {Derived} */
          l
        ), r && p !== null && !q && !((c = l == null ? void 0 : l.reactions) != null && c.includes(t)) && (l.reactions ?? (l.reactions = [])).push(t), l.version > t.version)
          return !0;
      }
    }
    (!r || p !== null && !q) && D(t, T);
  }
  return !1;
}
function mr(t, e) {
  for (var n = e; n !== null; ) {
    if (n.f & Dt)
      try {
        n.fn(t);
        return;
      } catch {
        n.f ^= Dt;
      }
    n = n.parent;
  }
  throw dt = !1, t;
}
function wr(t) {
  return (t.f & X) === 0 && (t.parent === null || (t.parent.f & Dt) === 0);
}
function mt(t, e, n, r) {
  if (dt) {
    if (n === null && (dt = !1), wr(e))
      throw t;
    return;
  }
  n !== null && (dt = !0);
  {
    mr(t, e);
    return;
  }
}
function Xe(t) {
  var f;
  var e = L, n = S, r = I, s = h, l = q, a = A, c = y, o = t.f;
  L = /** @type {null | Value[]} */
  null, S = 0, I = null, h = o & (N | st) ? null : t, q = !G && (o & $) !== 0, A = null, y = t.ctx;
  try {
    var v = (
      /** @type {Function} */
      (0, t.fn)()
    ), _ = t.deps;
    if (L !== null) {
      var u;
      if (rt(t, S), _ !== null && S > 0)
        for (_.length = S + L.length, u = 0; u < L.length; u++)
          _[S + u] = L[u];
      else
        t.deps = _ = L;
      if (!q)
        for (u = S; u < _.length; u++)
          ((f = _[u]).reactions ?? (f.reactions = [])).push(t);
    } else _ !== null && S < _.length && (rt(t, S), _.length = S);
    return v;
  } finally {
    L = e, S = n, I = r, h = s, q = l, A = a, y = c;
  }
}
function Er(t, e) {
  let n = e.reactions;
  if (n !== null) {
    var r = n.indexOf(t);
    if (r !== -1) {
      var s = n.length - 1;
      s === 0 ? n = e.reactions = null : (n[r] = n[s], n.pop());
    }
  }
  n === null && e.f & M && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (L === null || !L.includes(e)) && (D(e, at), e.f & ($ | ht) || (e.f ^= ht), rt(
    /** @type {Derived} **/
    e,
    0
  ));
}
function rt(t, e) {
  var n = t.deps;
  if (n !== null)
    for (var r = e; r < n.length; r++)
      Er(t, n[r]);
}
function wt(t) {
  var e = t.f;
  if (!(e & X)) {
    D(t, T);
    var n = p, r = y;
    p = t;
    try {
      e & Ut ? _r(t) : Ue(t), $e(t), Ze(t);
      var s = Xe(t);
      t.teardown = typeof s == "function" ? s : null, t.version = Ge;
    } catch (l) {
      mt(l, t, n, r || t.ctx);
    } finally {
      p = n;
    }
  }
}
function br() {
  if (nt > 1e3) {
    nt = 0;
    try {
      $n();
    } catch (t) {
      if (Ct !== null)
        mt(t, Ct, null);
      else
        throw t;
    }
  }
  nt++;
}
function Lr(t) {
  var e = t.length;
  if (e !== 0) {
    br();
    var n = G;
    G = !0;
    try {
      for (var r = 0; r < e; r++) {
        var s = t[r];
        s.f & T || (s.f ^= T);
        var l = [];
        Je(s, l), kr(l);
      }
    } finally {
      G = n;
    }
  }
}
function kr(t) {
  var e = t.length;
  if (e !== 0)
    for (var n = 0; n < e; n++) {
      var r = t[n];
      if (!(r.f & (X | K)))
        try {
          ut(r) && (wt(r), r.deps === null && r.first === null && r.nodes_start === null && (r.teardown === null ? je(r) : r.fn = null));
        } catch (s) {
          mt(s, r, null, r.ctx);
        }
    }
}
function xr() {
  if (yt = !1, nt > 1001)
    return;
  const t = Zt;
  Zt = [], Lr(t), yt || (nt = 0, Ct = null);
}
function Et(t) {
  yt || (yt = !0, queueMicrotask(xr)), Ct = t;
  for (var e = t; e.parent !== null; ) {
    e = e.parent;
    var n = e.f;
    if (n & (st | N)) {
      if (!(n & T)) return;
      e.f ^= T;
    }
  }
  Zt.push(e);
}
function Je(t, e) {
  var n = t.first, r = [];
  t: for (; n !== null; ) {
    var s = n.f, l = (s & N) !== 0, a = l && (s & T) !== 0, c = n.next;
    if (!a && !(s & K))
      if (s & lt) {
        if (l)
          n.f ^= T;
        else
          try {
            ut(n) && wt(n);
          } catch (u) {
            mt(u, n, null, n.ctx);
          }
        var o = n.first;
        if (o !== null) {
          n = o;
          continue;
        }
      } else s & Se && r.push(n);
    if (c === null) {
      let u = n.parent;
      for (; u !== null; ) {
        if (t === u)
          break t;
        var v = u.next;
        if (v !== null) {
          n = v;
          continue t;
        }
        u = u.parent;
      }
    }
    n = c;
  }
  for (var _ = 0; _ < r.length; _++)
    o = r[_], e.push(o), Je(o, e);
}
function i(t) {
  var _;
  var e = t.f, n = (e & M) !== 0;
  if (n && e & X) {
    var r = Ie(
      /** @type {Derived} */
      t
    );
    return Wt(
      /** @type {Derived} */
      t
    ), r;
  }
  if (h !== null) {
    A !== null && A.includes(t) && jn();
    var s = h.deps;
    L === null && s !== null && s[S] === t ? S++ : L === null ? L = [t] : L.push(t), I !== null && p !== null && p.f & T && !(p.f & N) && I.includes(t) && (D(p, P), Et(p));
  } else if (n && /** @type {Derived} */
  t.deps === null)
    for (var l = (
      /** @type {Derived} */
      t
    ), a = l.parent, c = l; a !== null; )
      if (a.f & M) {
        var o = (
          /** @type {Derived} */
          a
        );
        c = o, a = o.parent;
      } else {
        var v = (
          /** @type {Effect} */
          a
        );
        (_ = v.deriveds) != null && _.includes(c) || (v.deriveds ?? (v.deriveds = [])).push(c);
        break;
      }
  return n && (l = /** @type {Derived} */
  t, ut(l) && Pe(l)), t.v;
}
function Xt(t) {
  const e = h;
  try {
    return h = null, t();
  } finally {
    h = e;
  }
}
const Tr = ~(P | at | T);
function D(t, e) {
  t.f = t.f & Tr | e;
}
function Qe(t, e = !1, n) {
  y = {
    p: y,
    c: null,
    e: null,
    m: !1,
    s: t,
    x: null,
    l: null
  }, J && !e && (y.l = {
    s: null,
    u: null,
    r1: [],
    r2: Ne(!1)
  });
}
function tn(t) {
  const e = y;
  if (e !== null) {
    const a = e.e;
    if (a !== null) {
      var n = p, r = h;
      e.e = null;
      try {
        for (var s = 0; s < a.length; s++) {
          var l = a[s];
          H(l.effect), B(l.reaction), Fe(l.fn);
        }
      } finally {
        H(n), B(r);
      }
    }
    y = e.p, e.m = !0;
  }
  return (
    /** @type {T} */
    {}
  );
}
function Sr(t) {
  if (!(typeof t != "object" || !t || t instanceof EventTarget)) {
    if (Ot in t)
      $t(t);
    else if (!Array.isArray(t))
      for (let e in t) {
        const n = t[e];
        typeof n == "object" && n && Ot in n && $t(n);
      }
  }
}
function $t(t, e = /* @__PURE__ */ new Set()) {
  if (typeof t == "object" && t !== null && // We don't want to traverse DOM elements
  !(t instanceof EventTarget) && !e.has(t)) {
    e.add(t), t instanceof Date && t.getTime();
    for (let r in t)
      try {
        $t(t[r], e);
      } catch {
      }
    const n = Te(t);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = xe(n);
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
const zr = ["touchstart", "touchmove"];
function Vr(t) {
  return zr.includes(t);
}
function Mr(t) {
  var e = h, n = p;
  B(null), H(null);
  try {
    return t();
  } finally {
    B(e), H(n);
  }
}
const Nr = /* @__PURE__ */ new Set(), me = /* @__PURE__ */ new Set();
function Rr(t, e, n, r) {
  function s(l) {
    if (r.capture || et.call(e, l), !l.cancelBubble)
      return Mr(() => n.call(this, l));
  }
  return t.startsWith("pointer") || t.startsWith("touch") || t === "wheel" ? hr(() => {
    e.addEventListener(t, s, r);
  }) : e.addEventListener(t, s, r), s;
}
function R(t, e, n, r, s) {
  var l = { capture: r, passive: s }, a = Rr(t, e, n, l);
  (e === document.body || e === window || e === document) && or(() => {
    e.removeEventListener(t, a, l);
  });
}
function et(t) {
  var it;
  var e = this, n = (
    /** @type {Node} */
    e.ownerDocument
  ), r = t.type, s = ((it = t.composedPath) == null ? void 0 : it.call(t)) || [], l = (
    /** @type {null | Element} */
    s[0] || t.target
  ), a = 0, c = t.__root;
  if (c) {
    var o = s.indexOf(c);
    if (o !== -1 && (e === document || e === /** @type {any} */
    window)) {
      t.__root = e;
      return;
    }
    var v = s.indexOf(e);
    if (v === -1)
      return;
    o <= v && (a = o);
  }
  if (l = /** @type {Element} */
  s[a] || t.target, l !== e) {
    Rn(t, "currentTarget", {
      configurable: !0,
      get() {
        return l || n;
      }
    });
    var _ = h, u = p;
    B(null), H(null);
    try {
      for (var f, C = []; l !== null; ) {
        var k = l.assignedSlot || l.parentNode || /** @type {any} */
        l.host || null;
        try {
          var z = l["__" + r];
          if (z !== void 0 && !/** @type {any} */
          l.disabled)
            if (Mn(z)) {
              var [V, ...w] = z;
              V.apply(l, [t, ...w]);
            } else
              z.call(l, t);
        } catch (U) {
          f ? C.push(U) : f = U;
        }
        if (t.cancelBubble || k === e || k === null)
          break;
        l = k;
      }
      if (f) {
        for (let U of C)
          queueMicrotask(() => {
            throw U;
          });
        throw f;
      }
    } finally {
      t.__root = e, delete t.currentTarget, B(_), H(u);
    }
  }
}
function en(t) {
  var e = document.createElement("template");
  return e.innerHTML = t, e.content;
}
function nn(t, e) {
  var n = (
    /** @type {Effect} */
    p
  );
  n.nodes_start === null && (n.nodes_start = t, n.nodes_end = e);
}
// @__NO_SIDE_EFFECTS__
function Ar(t, e) {
  var n = (e & Jn) !== 0, r, s = !t.startsWith("<!>");
  return () => {
    r === void 0 && (r = en(s ? t : "<!>" + t), r = /** @type {Node} */
    /* @__PURE__ */ gt(r));
    var l = (
      /** @type {TemplateNode} */
      n ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    return nn(l, l), l;
  };
}
// @__NO_SIDE_EFFECTS__
function rn(t, e, n = "svg") {
  var r = !t.startsWith("<!>"), s = `<${n}>${r ? t : "<!>" + t}</${n}>`, l;
  return () => {
    if (!l) {
      var a = (
        /** @type {DocumentFragment} */
        en(s)
      ), c = (
        /** @type {Element} */
        /* @__PURE__ */ gt(a)
      );
      l = /** @type {Element} */
      /* @__PURE__ */ gt(c);
    }
    var o = (
      /** @type {TemplateNode} */
      l.cloneNode(!0)
    );
    return nn(o, o), o;
  };
}
function Rt(t, e) {
  t !== null && t.before(
    /** @type {Node} */
    e
  );
}
function _t(t, e) {
  var n = e == null ? "" : typeof e == "object" ? e + "" : e;
  n !== (t.__t ?? (t.__t = t.nodeValue)) && (t.__t = n, t.nodeValue = n == null ? "" : n + "");
}
function Hr(t, e) {
  return Dr(t, e);
}
const W = /* @__PURE__ */ new Map();
function Dr(t, { target: e, anchor: n, props: r = {}, events: s, context: l, intro: a = !0 }) {
  lr();
  var c = /* @__PURE__ */ new Set(), o = (u) => {
    for (var f = 0; f < u.length; f++) {
      var C = u[f];
      if (!c.has(C)) {
        c.add(C);
        var k = Vr(C);
        e.addEventListener(C, et, { passive: k });
        var z = W.get(C);
        z === void 0 ? (document.addEventListener(C, et, { passive: k }), W.set(C, 1)) : W.set(C, z + 1);
      }
    }
  };
  o(Nn(Nr)), me.add(o);
  var v = void 0, _ = cr(() => {
    var u = n ?? e.appendChild(sr());
    return Pt(() => {
      if (l) {
        Qe({});
        var f = (
          /** @type {ComponentContext} */
          y
        );
        f.c = l;
      }
      s && (r.$$events = s), v = t(u, r) || {}, l && tn();
    }), () => {
      var k;
      for (var f of c) {
        e.removeEventListener(f, et);
        var C = (
          /** @type {number} */
          W.get(f)
        );
        --C === 0 ? (document.removeEventListener(f, et), W.delete(f)) : W.set(f, C);
      }
      me.delete(o), u !== n && ((k = u.parentNode) == null || k.removeChild(u));
    };
  });
  return Or.set(v, _), v;
}
let Or = /* @__PURE__ */ new WeakMap();
function we(t, e, n = !1) {
  var r = t, s = null, l = null, a = Qn, c = n ? jt : 0, o = !1;
  const v = (u, f = !0) => {
    o = !0, _(f, u);
  }, _ = (u, f) => {
    a !== (a = u) && (a ? (s ? ge(s) : f && (s = Pt(() => f(r))), l && Bt(l, () => {
      l = null;
    })) : (l ? ge(l) : f && (l = Pt(() => f(r))), s && Bt(s, () => {
      s = null;
    })));
  };
  qe(() => {
    o = !1, e(v), o || _(null, null);
  }, c);
}
function Ee(t, e) {
  var n = t.__attributes ?? (t.__attributes = {});
  n.value === (n.value = // treat null and undefined the same for the initial value
  e ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when its `0`
  t.value === e && (e !== 0 || t.nodeName !== "PROGRESS") || (t.value = e);
}
function d(t, e, n, r) {
  var s = t.__attributes ?? (t.__attributes = {});
  s[e] !== (s[e] = n) && (e === "style" && "__styles" in t && (t.__styles = {}), e === "loading" && (t[Pn] = n), n == null ? t.removeAttribute(e) : typeof n != "string" && Ir(t).includes(e) ? t[e] = n : t.setAttribute(e, n));
}
var be = /* @__PURE__ */ new Map();
function Ir(t) {
  var e = be.get(t.nodeName);
  if (e) return e;
  be.set(t.nodeName, e = []);
  for (var n, r = t, s = Element.prototype; s !== r; ) {
    n = xe(r);
    for (var l in n)
      n[l].set && e.push(l);
    r = Te(r);
  }
  return e;
}
function Le(t, e) {
  var n = t.__className, r = Pr(e);
  (n !== r || rr) && (e == null ? t.removeAttribute("class") : t.className = r, t.__className = r);
}
function Pr(t) {
  return t ?? "";
}
function Br(t = !1) {
  const e = (
    /** @type {ComponentContextLegacy} */
    y
  ), n = e.l.u;
  if (!n) return;
  let r = () => Sr(e.s);
  if (t) {
    let s = 0, l = (
      /** @type {Record<string, any>} */
      {}
    );
    const a = /* @__PURE__ */ Yt(() => {
      let c = !1;
      const o = e.s;
      for (const v in o)
        o[v] !== l[v] && (l[v] = o[v], c = !0);
      return c && s++, s;
    });
    r = () => i(a);
  }
  n.b.length && fr(() => {
    ke(e, r), Ht(n.b);
  }), It(() => {
    const s = Xt(() => n.m.map(An));
    return () => {
      for (const l of s)
        typeof l == "function" && l();
    };
  }), n.a.length && It(() => {
    ke(e, r), Ht(n.a);
  });
}
function ke(t, e) {
  if (t.l.s)
    for (const n of t.l.s) i(n);
  e();
}
let pt = !1;
function Fr(t) {
  var e = pt;
  try {
    return pt = !1, [t(), pt];
  } finally {
    pt = e;
  }
}
function qr(t) {
  for (var e = p, n = p; e !== null && !(e.f & (N | st)); )
    e = e.parent;
  try {
    return H(e), t();
  } finally {
    H(n);
  }
}
function Zr(t, e, n, r) {
  var V;
  var s = (n & Gn) !== 0, l = !J || (n & Kn) !== 0, a = (n & Xn) !== 0, c = !1, o;
  [o, c] = Fr(() => (
    /** @type {V} */
    t[e]
  ));
  var v = Ot in t || In in t, _ = ((V = At(t, e)) == null ? void 0 : V.set) ?? (v && a && e in t ? (w) => t[e] = w : void 0), u = (
    /** @type {V} */
    r
  ), f = !0, C = () => (f && (f = !1, u = Xt(
    /** @type {() => V} */
    r
  )), u);
  o === void 0 && r !== void 0 && (_ && l && Un(), o = C(), _ && _(o));
  var k;
  if (l)
    k = () => {
      var w = (
        /** @type {V} */
        t[e]
      );
      return w === void 0 ? C() : (f = !0, w);
    };
  else {
    var z = qr(
      () => (s ? Yt : ar)(() => (
        /** @type {V} */
        t[e]
      ))
    );
    z.f |= Dn, k = () => {
      var w = i(z);
      return w !== void 0 && (u = /** @type {V} */
      void 0), w === void 0 ? u : w;
    };
  }
  return k;
}
function $r(t) {
  y === null && gr(), J && y.l !== null ? Ur(y).m.push(t) : It(() => {
    const e = Xt(t);
    if (typeof e == "function") return (
      /** @type {() => void} */
      e
    );
  });
}
function Ur(t) {
  var e = (
    /** @type {ComponentContextLegacy} */
    t.l
  );
  return e.u ?? (e.u = { a: [], b: [], m: [] });
}
const jr = "5";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(jr);
Wn();
const x = {
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
var Yr = /* @__PURE__ */ rn('<path class="svelte-15c7ynz"></path>'), Wr = /* @__PURE__ */ rn('<path class="svelte-15c7ynz"></path>'), Gr = /* @__PURE__ */ Ar('<div class="svelte-audio-player svelte-15c7ynz"><div class="track-name svelte-15c7ynz"><strong class="svelte-15c7ynz"> </strong> <div class="title svelte-15c7ynz"> </div></div> <div class="track-info svelte-15c7ynz"><div class="buttons-control svelte-15c7ynz"><button aria-label="Previous Track" class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button> <button class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><!></svg></button> <button aria-label="Next Track" class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button> <button aria-label="Shuffle"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path></svg></button> <button aria-label="Repeat"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path></svg></button></div> <div class="track-ranges svelte-15c7ynz"><div class="progress-control svelte-15c7ynz"><div class="current-time svelte-15c7ynz"><span> </span></div> <input type="range" class="svelte-15c7ynz"> <div class="duration-time svelte-15c7ynz"><span role="button" tabindex="0"> </span></div></div> <div class="volume-control svelte-15c7ynz"><button class="svelte-15c7ynz"><svg class="svelte-15c7ynz"><path class="svelte-15c7ynz"></path><path class="svelte-15c7ynz"></path><!></svg></button> <input type="range" min="0" max="1" step="0.01" class="svelte-15c7ynz"></div></div></div></div>');
function Kr(t, e) {
  Qe(e, !1);
  let n = Zr(e, "tracks", 24, () => []), r, s = O(!1), l = O(!1), a = O(!1), c = O(!1), o = !1, v = O(0), _ = O(0), u = O(1), f = O(0), C = i(u);
  const k = 0, z = 0.01, V = "http://www.w3.org/2000/svg", w = "0 0 32 32";
  $r(() => {
    n().length > 0 && (r = new Audio(n()[i(f)].src), r.volume = i(u), r.addEventListener("timeupdate", U), r.addEventListener("loadedmetadata", ln), r.addEventListener("ended", on));
  });
  const it = () => {
    i(s) ? r.pause() : r.play(), b(s, !i(s));
  }, U = () => {
    b(v, r.currentTime);
  }, ln = () => {
    b(_, r.duration);
  }, sn = (m) => {
    r.currentTime = m.target.value, b(v, r.currentTime);
  }, an = (m) => {
    b(u, parseFloat(m.target.value)), r.volume = i(u), b(l, i(u) === 0);
  }, un = () => {
    b(l, !i(l)), i(l) ? (C = i(u), b(u, 0)) : b(u, C), r.muted = i(l), r.volume = i(u);
  }, Jt = () => {
    o = !o;
  }, on = () => {
    i(c) ? (r.currentTime = 0, r.play()) : Qt();
  }, Qt = () => {
    if (i(a)) {
      let m;
      do
        m = Math.floor(Math.random() * n().length);
      while (m === i(f));
      b(f, m);
    } else i(c) || b(f, (i(f) + 1) % n().length);
    r.src = n()[i(f)].src, r.play(), b(s, !0);
  }, fn = () => {
    b(f, (i(f) - 1 + n().length) % n().length), r.src = n()[i(f)].src, r.play(), b(s, !0);
  }, cn = () => {
    b(a, !i(a));
  }, vn = () => {
    b(c, !i(c));
  }, te = (m, F) => {
    if (isNaN(m)) return "0:00";
    const pe = (Y) => {
      const vt = Math.floor(Y / 60), de = Math.floor(Y % 60);
      return `${vt}:${de < 10 ? "0" : ""}${de}`;
    };
    if (F) {
      let Y = o ? i(_) - i(v) : i(_);
      Y < 0 && (Y = 0);
      const vt = pe(Y);
      return o ? `-${vt}` : vt;
    } else
      return pe(m);
  };
  Br();
  var ee = Gr(), ne = g(ee), re = g(ne), _n = g(re), pn = E(re, 2), dn = g(pn), hn = E(ne, 2), le = g(hn), bt = g(le), Lt = g(bt);
  d(Lt, "xmlns", V), d(Lt, "viewBox", w);
  var se = g(Lt), gn = E(se), ot = E(bt, 2), kt = g(ot);
  d(kt, "xmlns", V), d(kt, "viewBox", w);
  var ae = g(kt), yn = E(ae);
  {
    var Cn = (m) => {
      var F = Yr();
      tt(() => d(F, "d", x.pauseRight)), Rt(m, F);
    };
    we(yn, (m) => {
      i(s) && m(Cn);
    });
  }
  var xt = E(ot, 2), Tt = g(xt);
  d(Tt, "xmlns", V), d(Tt, "viewBox", w);
  var ue = g(Tt), mn = E(ue), ft = E(xt, 2), St = g(ft);
  d(St, "xmlns", V), d(St, "viewBox", w);
  var wn = g(St), zt = E(ft, 2), Vt = g(zt);
  d(Vt, "xmlns", V), d(Vt, "viewBox", w);
  var ie = g(Vt), En = E(ie), bn = E(le, 2), oe = g(bn), fe = g(oe), Ln = g(fe), kn = g(Ln);
  tt(() => _t(kn, te(i(v), !1)));
  var j = E(fe, 2);
  d(j, "min", k), d(j, "step", z);
  var xn = E(j, 2), Mt = g(xn), Tn = g(Mt);
  tt(() => _t(Tn, te(i(v), !0)));
  var Sn = E(oe, 2), ct = g(Sn), Nt = g(ct);
  d(Nt, "xmlns", V), d(Nt, "viewBox", w);
  var ce = g(Nt), ve = E(ce), zn = E(ve);
  {
    var Vn = (m) => {
      var F = Wr();
      tt(() => d(F, "d", x.volumeRightLine)), Rt(m, F);
    };
    we(zn, (m) => {
      !i(l) && i(u) != 0 && m(Vn);
    });
  }
  var _e = E(ct, 2);
  tt(() => {
    _t(_n, `${i(f) + 1} / ${n().length ?? ""}`), _t(dn, `${n()[i(f)].author ?? ""} – «${n()[i(f)].title ?? ""}»`), d(se, "d", x.previousLeft), d(gn, "d", x.previousRight), d(ot, "aria-label", i(s) ? "Pause" : "Play"), d(ae, "d", i(s) ? x.pauseLeft : x.play), d(ue, "d", x.nextLeft), d(mn, "d", x.nextRight), Le(ft, `${(i(a) ? "" : "shuffle") ?? ""} svelte-15c7ynz`), d(wn, "d", x.shuffle), Le(zt, `${(i(c) ? "" : "repeat") ?? ""} svelte-15c7ynz`), d(ie, "d", x.repeatLeft), d(En, "d", x.repeatRight), d(j, "max", i(_)), Ee(j, i(v)), d(ct, "aria-label", i(l) ? "Unmute" : "Mute"), d(ce, "d", i(l) || i(u) == 0 ? x.muteSpeaker : x.volumeSpeaker), d(ve, "d", i(l) || i(u) == 0 ? x.muteClose : x.volumeLeftLine), Ee(_e, i(u));
  }), R("click", bt, fn), R("click", ot, it), R("click", xt, Qt), R("click", ft, cn), R("click", zt, vn), R("input", j, sn), R("click", Mt, Jt), R("keydown", Mt, (m) => m.key === "Enter" && Jt()), R("click", ct, un), R("input", _e, an), Rt(t, ee), tn();
}
const Xr = Hr(Kr, {
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
        author: "ISB",
        title: "Who I Am"
      },
      {
        src: "https://muz-tv.ru/storage/files/chart-tracks/1594629860.mp3",
        author: "ЁЛКА X АНТ",
        title: "Комната"
      },
      {
        src: "https://muz-tv.ru/storage/files/chart-tracks/1601289714.mp3",
        author: "ЁЛМАРИ КРАЙМБРЕРИ",
        title: "Океан"
      },
      {
        src: "https://muz-tv.ru/storage/files/chart-tracks/1601027082.mp3",
        author: "ПОЛИНА ГАГАРИНА",
        title: "На Расстоянии"
      }
    ]
  }
});
export {
  Xr as default
};
//# sourceMappingURL=svelte-audio-player.js.map
