var AudioPlayer=function(){"use strict";var lr=Array.isArray,sr=Array.from,ar=Object.defineProperty,Et=Object.getOwnPropertyDescriptor,Jt=Object.getOwnPropertyDescriptors,Qt=Object.getPrototypeOf;function ir(t){return t()}function bt(t){for(var e=0;e<t.length;e++)t[e]()}const V=2,te=4,tt=8,Lt=16,M=32,et=64,kt=128,F=256,ut=512,T=1024,O=2048,rt=4096,U=8192,j=16384,ur=32768,Tt=65536,or=1<<17,fr=1<<19,ee=1<<20,St=Symbol("$state"),cr=Symbol("legacy props"),vr=Symbol("");function re(t){return t===this.v}function _r(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function ne(t){return!_r(t,this.v)}function pr(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function dr(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function hr(t){throw new Error("https://svelte.dev/e/effect_orphan")}function gr(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Cr(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function mr(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function wr(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let Y=!1;function xr(){Y=!0}const yr=1,Er=2,br=8,Lr=2,kr=Symbol();function le(t,e){var r={f:0,v:t,reactions:null,equals:re,version:0};return r}function Tr(t,e=!1){var n;const r=le(t);return e||(r.equals=ne),Y&&C!==null&&C.l!==null&&((n=C.l).s??(n.s=[])).push(r),r}function P(t,e=!1){return Sr(Tr(t,e))}function Sr(t){return h!==null&&h.f&V&&(A===null?Ur([t]):A.push(t)),t}function E(t,e){return h!==null&&Pt()&&h.f&(V|Lt)&&(A===null||!A.includes(t))&&wr(),zr(t,e)}function zr(t,e){return t.equals(e)||(t.v=e,t.version=ke(),se(t,O),Pt()&&p!==null&&p.f&T&&!(p.f&M)&&(b!==null&&b.includes(t)?(H(p,O),dt(p)):B===null?jr([t]):B.push(t))),e}function se(t,e){var r=t.reactions;if(r!==null)for(var n=Pt(),s=r.length,l=0;l<s;l++){var a=r[l],c=a.f;c&O||!n&&a===p||(H(a,e),c&(T|F)&&(c&V?se(a,rt):dt(a)))}}let Vr=!1;var ae,ie,ue;function Mr(){if(ae===void 0){ae=window;var t=Element.prototype,e=Node.prototype;ie=Et(e,"firstChild").get,ue=Et(e,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function Nr(t=""){return document.createTextNode(t)}function ot(t){return ie.call(t)}function oe(t){return ue.call(t)}function g(t,e){return ot(t)}function x(t,e=1,r=!1){let n=t;for(;e--;)n=oe(n);return n}function zt(t){var e=V|O;p===null?e|=F:p.f|=ee;var r=h!==null&&h.f&V?h:null;const n={children:null,ctx:C,deps:null,equals:re,f:e,fn:t,reactions:null,v:null,version:0,parent:r??p};return r!==null&&(r.children??(r.children=[])).push(n),n}function Rr(t){const e=zt(t);return e.equals=ne,e}function fe(t){var e=t.children;if(e!==null){t.children=null;for(var r=0;r<e.length;r+=1){var n=e[r];n.f&V?Vt(n):q(n)}}}function Ar(t){for(var e=t.parent;e!==null;){if(!(e.f&V))return e;e=e.parent}return null}function ce(t){var e,r=p;R(Ar(t));try{fe(t),e=Te(t)}finally{R(r)}return e}function ve(t){var e=ce(t),r=(Z||t.f&F)&&t.deps!==null?rt:T;H(t,r),t.equals(e)||(t.v=e,t.version=ke())}function Vt(t){fe(t),at(t,0),H(t,j),t.v=t.children=t.deps=t.ctx=t.reactions=null}function _e(t){p===null&&h===null&&hr(),h!==null&&h.f&F&&dr(),Dt&&pr()}function Hr(t,e){var r=e.last;r===null?e.last=e.first=t:(r.next=t,t.prev=r,e.last=t)}function W(t,e,r,n=!0){var s=(t&et)!==0,l=p,a={ctx:C,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|O,first:null,fn:e,last:null,next:null,parent:s?null:l,prev:null,teardown:null,transitions:null,version:0};if(r){var c=G;try{Ee(!0),pt(a),a.f|=ur}catch(_){throw q(a),_}finally{Ee(c)}}else e!==null&&dt(a);var o=r&&a.deps===null&&a.first===null&&a.nodes_start===null&&a.teardown===null&&(a.f&ee)===0;if(!o&&!s&&n&&(l!==null&&Hr(a,l),h!==null&&h.f&V)){var v=h;(v.children??(v.children=[])).push(a)}return a}function Dr(t){const e=W(tt,null,!1);return H(e,T),e.teardown=t,e}function Mt(t){_e();var e=p!==null&&(p.f&M)!==0&&C!==null&&!C.m;if(e){var r=C;(r.e??(r.e=[])).push({fn:t,effect:p,reaction:h})}else{var n=pe(t);return n}}function Or(t){return _e(),Ir(t)}function Pr(t){const e=W(et,t,!0);return(r={})=>new Promise(n=>{r.outro?Rt(e,()=>{q(e),n(void 0)}):(q(e),n(void 0))})}function pe(t){return W(te,t,!1)}function Ir(t){return W(tt,t,!0)}function nt(t){return de(t)}function de(t,e=0){return W(tt|Lt|e,t,!0)}function Nt(t,e=!0){return W(tt|M,t,!0,e)}function he(t){var e=t.teardown;if(e!==null){const r=Dt,n=h;be(!0),I(null);try{e.call(null)}finally{be(r),I(n)}}}function ge(t){var e=t.deriveds;if(e!==null){t.deriveds=null;for(var r=0;r<e.length;r+=1)Vt(e[r])}}function Ce(t,e=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var n=r.next;q(r,e),r=n}}function Br(t){for(var e=t.first;e!==null;){var r=e.next;e.f&M||q(e),e=r}}function q(t,e=!0){var r=!1;if((e||t.f&fr)&&t.nodes_start!==null){for(var n=t.nodes_start,s=t.nodes_end;n!==null;){var l=n===s?null:oe(n);n.remove(),n=l}r=!0}Ce(t,e&&!r),ge(t),at(t,0),H(t,j);var a=t.transitions;if(a!==null)for(const o of a)o.stop();he(t);var c=t.parent;c!==null&&c.first!==null&&me(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function me(t){var e=t.parent,r=t.prev,n=t.next;r!==null&&(r.next=n),n!==null&&(n.prev=r),e!==null&&(e.first===t&&(e.first=n),e.last===t&&(e.last=r))}function Rt(t,e){var r=[];we(t,r,!0),Fr(r,()=>{q(t),e&&e()})}function Fr(t,e){var r=t.length;if(r>0){var n=()=>--r||e();for(var s of t)s.out(n)}else e()}function we(t,e,r){if(!(t.f&U)){if(t.f^=U,t.transitions!==null)for(const a of t.transitions)(a.is_global||r)&&e.push(a);for(var n=t.first;n!==null;){var s=n.next,l=(n.f&Tt)!==0||(n.f&M)!==0;we(n,e,l?r:!1),n=s}}}function xe(t){ye(t,!0)}function ye(t,e){if(t.f&U){st(t)&&pt(t),t.f^=U;for(var r=t.first;r!==null;){var n=r.next,s=(r.f&Tt)!==0||(r.f&M)!==0;ye(r,s?e:!1),r=n}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||e)&&l.in()}}let At=!1,Ht=[];function qr(){At=!1;const t=Ht.slice();Ht=[],bt(t)}function Zr(t){At||(At=!0,queueMicrotask(qr)),Ht.push(t)}function $r(t){throw new Error("https://svelte.dev/e/lifecycle_outside_component")}let ft=!1,ct=!1,vt=null,G=!1,Dt=!1;function Ee(t){G=t}function be(t){Dt=t}let Ot=[],lt=0,Jn=[],h=null;function I(t){h=t}let p=null;function R(t){p=t}let A=null;function Ur(t){A=t}let b=null,S=0,B=null;function jr(t){B=t}let Le=1,Z=!1,C=null;function ke(){return++Le}function Pt(){return!Y||C!==null&&C.l===null}function st(t){var a,c;var e=t.f;if(e&O)return!0;if(e&rt){var r=t.deps,n=(e&F)!==0;if(r!==null){var s;if(e&ut){for(s=0;s<r.length;s++)((a=r[s]).reactions??(a.reactions=[])).push(t);t.f^=ut}for(s=0;s<r.length;s++){var l=r[s];if(st(l)&&ve(l),n&&p!==null&&!Z&&!((c=l==null?void 0:l.reactions)!=null&&c.includes(t))&&(l.reactions??(l.reactions=[])).push(t),l.version>t.version)return!0}}(!n||p!==null&&!Z)&&H(t,T)}return!1}function Yr(t,e){for(var r=e;r!==null;){if(r.f&kt)try{r.fn(t);return}catch{r.f^=kt}r=r.parent}throw ft=!1,t}function Wr(t){return(t.f&j)===0&&(t.parent===null||(t.parent.f&kt)===0)}function _t(t,e,r,n){if(ft){if(r===null&&(ft=!1),Wr(e))throw t;return}r!==null&&(ft=!0);{Yr(t,e);return}}function Te(t){var f;var e=b,r=S,n=B,s=h,l=Z,a=A,c=C,o=t.f;b=null,S=0,B=null,h=o&(M|et)?null:t,Z=!G&&(o&F)!==0,A=null,C=t.ctx;try{var v=(0,t.fn)(),_=t.deps;if(b!==null){var i;if(at(t,S),_!==null&&S>0)for(_.length=S+b.length,i=0;i<b.length;i++)_[S+i]=b[i];else t.deps=_=b;if(!Z)for(i=S;i<_.length;i++)((f=_[i]).reactions??(f.reactions=[])).push(t)}else _!==null&&S<_.length&&(at(t,S),_.length=S);return v}finally{b=e,S=r,B=n,h=s,Z=l,A=a,C=c}}function Gr(t,e){let r=e.reactions;if(r!==null){var n=r.indexOf(t);if(n!==-1){var s=r.length-1;s===0?r=e.reactions=null:(r[n]=r[s],r.pop())}}r===null&&e.f&V&&(b===null||!b.includes(e))&&(H(e,rt),e.f&(F|ut)||(e.f^=ut),at(e,0))}function at(t,e){var r=t.deps;if(r!==null)for(var n=e;n<r.length;n++)Gr(t,r[n])}function pt(t){var e=t.f;if(!(e&j)){H(t,T);var r=p,n=C;p=t;try{e&Lt?Br(t):Ce(t),ge(t),he(t);var s=Te(t);t.teardown=typeof s=="function"?s:null,t.version=Le}catch(l){_t(l,t,r,n||t.ctx)}finally{p=r}}}function Kr(){if(lt>1e3){lt=0;try{gr()}catch(t){if(vt!==null)_t(t,vt,null);else throw t}}lt++}function Xr(t){var e=t.length;if(e!==0){Kr();var r=G;G=!0;try{for(var n=0;n<e;n++){var s=t[n];s.f&T||(s.f^=T);var l=[];Se(s,l),Jr(l)}}finally{G=r}}}function Jr(t){var e=t.length;if(e!==0)for(var r=0;r<e;r++){var n=t[r];if(!(n.f&(j|U)))try{st(n)&&(pt(n),n.deps===null&&n.first===null&&n.nodes_start===null&&(n.teardown===null?me(n):n.fn=null))}catch(s){_t(s,n,null,n.ctx)}}}function Qr(){if(ct=!1,lt>1001)return;const t=Ot;Ot=[],Xr(t),ct||(lt=0,vt=null)}function dt(t){ct||(ct=!0,queueMicrotask(Qr)),vt=t;for(var e=t;e.parent!==null;){e=e.parent;var r=e.f;if(r&(et|M)){if(!(r&T))return;e.f^=T}}Ot.push(e)}function Se(t,e){var r=t.first,n=[];t:for(;r!==null;){var s=r.f,l=(s&M)!==0,a=l&&(s&T)!==0,c=r.next;if(!a&&!(s&U))if(s&tt){if(l)r.f^=T;else try{st(r)&&pt(r)}catch(i){_t(i,r,null,r.ctx)}var o=r.first;if(o!==null){r=o;continue}}else s&te&&n.push(r);if(c===null){let i=r.parent;for(;i!==null;){if(t===i)break t;var v=i.next;if(v!==null){r=v;continue t}i=i.parent}}r=c}for(var _=0;_<n.length;_++)o=n[_],e.push(o),Se(o,e)}function u(t){var _;var e=t.f,r=(e&V)!==0;if(r&&e&j){var n=ce(t);return Vt(t),n}if(h!==null){A!==null&&A.includes(t)&&mr();var s=h.deps;b===null&&s!==null&&s[S]===t?S++:b===null?b=[t]:b.push(t),B!==null&&p!==null&&p.f&T&&!(p.f&M)&&B.includes(t)&&(H(p,O),dt(p))}else if(r&&t.deps===null)for(var l=t,a=l.parent,c=l;a!==null;)if(a.f&V){var o=a;c=o,a=o.parent}else{var v=a;(_=v.deriveds)!=null&&_.includes(c)||(v.deriveds??(v.deriveds=[])).push(c);break}return r&&(l=t,st(l)&&ve(l)),t.v}function It(t){const e=h;try{return h=null,t()}finally{h=e}}const tn=~(O|rt|T);function H(t,e){t.f=t.f&tn|e}function ze(t,e=!1,r){C={p:C,c:null,e:null,m:!1,s:t,x:null,l:null},Y&&!e&&(C.l={s:null,u:null,r1:[],r2:le(!1)})}function Ve(t){const e=C;if(e!==null){const a=e.e;if(a!==null){var r=p,n=h;e.e=null;try{for(var s=0;s<a.length;s++){var l=a[s];R(l.effect),I(l.reaction),pe(l.fn)}}finally{R(r),I(n)}}C=e.p,e.m=!0}return{}}function en(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(St in t)Bt(t);else if(!Array.isArray(t))for(let e in t){const r=t[e];typeof r=="object"&&r&&St in r&&Bt(r)}}}function Bt(t,e=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!e.has(t)){e.add(t),t instanceof Date&&t.getTime();for(let n in t)try{Bt(t[n],e)}catch{}const r=Qt(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const n=Jt(r);for(let s in n){const l=n[s].get;if(l)try{l.call(t)}catch{}}}}}const rn=["touchstart","touchmove"];function nn(t){return rn.includes(t)}function ln(t){var e=h,r=p;I(null),R(null);try{return t()}finally{I(e),R(r)}}const sn=new Set,Me=new Set;function an(t,e,r,n){function s(l){if(n.capture||it.call(e,l),!l.cancelBubble)return ln(()=>r.call(this,l))}return t.startsWith("pointer")||t.startsWith("touch")||t==="wheel"?Zr(()=>{e.addEventListener(t,s,n)}):e.addEventListener(t,s,n),s}function D(t,e,r,n,s){var l={capture:n,passive:s},a=an(t,e,r,l);(e===document.body||e===window||e===document)&&Dr(()=>{e.removeEventListener(t,a,l)})}function it(t){var Ct;var e=this,r=e.ownerDocument,n=t.type,s=((Ct=t.composedPath)==null?void 0:Ct.call(t))||[],l=s[0]||t.target,a=0,c=t.__root;if(c){var o=s.indexOf(c);if(o!==-1&&(e===document||e===window)){t.__root=e;return}var v=s.indexOf(e);if(v===-1)return;o<=v&&(a=o)}if(l=s[a]||t.target,l!==e){ar(t,"currentTarget",{configurable:!0,get(){return l||r}});var _=h,i=p;I(null),R(null);try{for(var f,m=[];l!==null;){var k=l.assignedSlot||l.parentNode||l.host||null;try{var z=l["__"+n];if(z!==void 0&&!l.disabled)if(lr(z)){var[N,...y]=z;N.apply(l,[t,...y])}else z.call(l,t)}catch(X){f?m.push(X):f=X}if(t.cancelBubble||k===e||k===null)break;l=k}if(f){for(let X of m)queueMicrotask(()=>{throw X});throw f}}finally{t.__root=e,delete t.currentTarget,I(_),R(i)}}}function Ne(t){var e=document.createElement("template");return e.innerHTML=t,e.content}function Re(t,e){var r=p;r.nodes_start===null&&(r.nodes_start=t,r.nodes_end=e)}function un(t,e){var r=(e&Lr)!==0,n,s=!t.startsWith("<!>");return()=>{n===void 0&&(n=Ne(s?t:"<!>"+t),n=ot(n));var l=r?document.importNode(n,!0):n.cloneNode(!0);return Re(l,l),l}}function Ae(t,e,r="svg"){var n=!t.startsWith("<!>"),s=`<${r}>${n?t:"<!>"+t}</${r}>`,l;return()=>{if(!l){var a=Ne(s),c=ot(a);l=ot(c)}var o=l.cloneNode(!0);return Re(o,o),o}}function Ft(t,e){t!==null&&t.before(e)}function ht(t,e){var r=e==null?"":typeof e=="object"?e+"":e;r!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=r,t.nodeValue=r==null?"":r+"")}function on(t,e){return fn(t,e)}const K=new Map;function fn(t,{target:e,anchor:r,props:n={},events:s,context:l,intro:a=!0}){Mr();var c=new Set,o=i=>{for(var f=0;f<i.length;f++){var m=i[f];if(!c.has(m)){c.add(m);var k=nn(m);e.addEventListener(m,it,{passive:k});var z=K.get(m);z===void 0?(document.addEventListener(m,it,{passive:k}),K.set(m,1)):K.set(m,z+1)}}};o(sr(sn)),Me.add(o);var v=void 0,_=Pr(()=>{var i=r??e.appendChild(Nr());return Nt(()=>{if(l){ze({});var f=C;f.c=l}s&&(n.$$events=s),v=t(i,n)||{},l&&Ve()}),()=>{var k;for(var f of c){e.removeEventListener(f,it);var m=K.get(f);--m===0?(document.removeEventListener(f,it),K.delete(f)):K.set(f,m)}Me.delete(o),i!==r&&((k=i.parentNode)==null||k.removeChild(i))}});return cn.set(v,_),v}let cn=new WeakMap;function He(t,e,r=!1){var n=t,s=null,l=null,a=kr,c=r?Tt:0,o=!1;const v=(i,f=!0)=>{o=!0,_(f,i)},_=(i,f)=>{a!==(a=i)&&(a?(s?xe(s):f&&(s=Nt(()=>f(n))),l&&Rt(l,()=>{l=null})):(l?xe(l):f&&(l=Nt(()=>f(n))),s&&Rt(s,()=>{s=null})))};de(()=>{o=!1,e(v),o||_(null,null)},c)}function De(t,e){var r=t.__attributes??(t.__attributes={});r.value===(r.value=e??void 0)||t.value===e&&(e!==0||t.nodeName!=="PROGRESS")||(t.value=e)}function d(t,e,r,n){var s=t.__attributes??(t.__attributes={});s[e]!==(s[e]=r)&&(e==="style"&&"__styles"in t&&(t.__styles={}),e==="loading"&&(t[vr]=r),r==null?t.removeAttribute(e):typeof r!="string"&&vn(t).includes(e)?t[e]=r:t.setAttribute(e,r))}var Oe=new Map;function vn(t){var e=Oe.get(t.nodeName);if(e)return e;Oe.set(t.nodeName,e=[]);for(var r,n=t,s=Element.prototype;s!==n;){r=Jt(n);for(var l in r)r[l].set&&e.push(l);n=Qt(n)}return e}function Pe(t,e){var r=t.__className,n=_n(e);(r!==n||Vr)&&(e==null?t.removeAttribute("class"):t.className=n,t.__className=n)}function _n(t){return t??""}function pn(t=!1){const e=C,r=e.l.u;if(!r)return;let n=()=>en(e.s);if(t){let s=0,l={};const a=zt(()=>{let c=!1;const o=e.s;for(const v in o)o[v]!==l[v]&&(l[v]=o[v],c=!0);return c&&s++,s});n=()=>u(a)}r.b.length&&Or(()=>{Ie(e,n),bt(r.b)}),Mt(()=>{const s=It(()=>r.m.map(ir));return()=>{for(const l of s)typeof l=="function"&&l()}}),r.a.length&&Mt(()=>{Ie(e,n),bt(r.a)})}function Ie(t,e){if(t.l.s)for(const r of t.l.s)u(r);e()}let gt=!1;function dn(t){var e=gt;try{return gt=!1,[t(),gt]}finally{gt=e}}function hn(t){for(var e=p,r=p;e!==null&&!(e.f&(M|et));)e=e.parent;try{return R(e),t()}finally{R(r)}}function gn(t,e,r,n){var N;var s=(r&yr)!==0,l=!Y||(r&Er)!==0,a=(r&br)!==0,c=!1,o;[o,c]=dn(()=>t[e]);var v=St in t||cr in t,_=((N=Et(t,e))==null?void 0:N.set)??(v&&a&&e in t?y=>t[e]=y:void 0),i=n,f=!0,m=()=>(f&&(f=!1,i=It(n)),i);o===void 0&&n!==void 0&&(_&&l&&Cr(),o=m(),_&&_(o));var k;if(l)k=()=>{var y=t[e];return y===void 0?m():(f=!0,y)};else{var z=hn(()=>(s?zt:Rr)(()=>t[e]));z.f|=or,k=()=>{var y=u(z);return y!==void 0&&(i=void 0),y===void 0?i:y}}return k}function Cn(t){C===null&&$r(),Y&&C.l!==null?mn(C).m.push(t):Mt(()=>{const e=It(t);if(typeof e=="function")return e})}function mn(t){var e=t.l;return e.u??(e.u={a:[],b:[],m:[]})}const wn="5";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(wn),xr();const L={volumeSpeaker:"M17.5091 24.6595C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9992 9.36923 19.9992H4.66667C4.29848 19.9992 4 19.7007 4 19.3325V12.6658C4 12.2976 4.29848 11.9992 4.66667 11.9992H9.37115C9.39967 11.9992 9.42745 11.99 9.45039 11.9731L16.4463 6.80363C16.8863 6.47845 17.5091 6.79262 17.5091 7.3398L17.5091 24.6595Z",volumeLeftLine:"M27.5091 9.33336C27.8773 9.33336 28.1758 9.63184 28.1758 10V22C28.1758 22.3682 27.8773 22.6667 27.5091 22.6667H26.1758C25.8076 22.6667 25.5091 22.3682 25.5091 22V10C25.5091 9.63184 25.8076 9.33336 26.1758 9.33336L27.5091 9.33336Z",volumeRightLine:"M22.1758 12C22.544 12 22.8424 12.2985 22.8424 12.6667V19.3334C22.8424 19.7016 22.544 20 22.1758 20H20.8424C20.4743 20 20.1758 19.7016 20.1758 19.3334V12.6667C20.1758 12.2985 20.4743 12 20.8424 12H22.1758Z",muteSpeaker:"M17.5091 24.6594C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3325V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.8036C16.8863 6.47842 17.5091 6.79259 17.5091 7.33977L17.5091 24.6594Z",muteClose:"M28.8621 13.6422C29.1225 13.3818 29.1225 12.9597 28.8621 12.6994L27.9193 11.7566C27.659 11.4962 27.2368 11.4962 26.9765 11.7566L24.7134 14.0197C24.6613 14.0717 24.5769 14.0717 24.5248 14.0197L22.262 11.7568C22.0016 11.4964 21.5795 11.4964 21.3191 11.7568L20.3763 12.6996C20.116 12.9599 20.116 13.382 20.3763 13.6424L22.6392 15.9053C22.6913 15.9573 22.6913 16.0418 22.6392 16.0938L20.3768 18.3562C20.1165 18.6166 20.1165 19.0387 20.3768 19.299L21.3196 20.2419C21.58 20.5022 22.0021 20.5022 22.2624 20.2418L24.5248 17.9795C24.5769 17.9274 24.6613 17.9274 24.7134 17.9795L26.976 20.2421C27.2363 20.5024 27.6585 20.5024 27.9188 20.2421L28.8616 19.2992C29.122 19.0389 29.122 18.6168 28.8616 18.3564L26.599 16.0938C26.547 16.0418 26.547 15.9573 26.599 15.9053L28.8621 13.6422Z",play:"M10.6666 6.6548C10.6666 6.10764 11.2894 5.79346 11.7295 6.11861L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.377 16.5357L11.7295 25.8813C11.2894 26.2065 10.6666 25.8923 10.6666 25.3451L10.6666 6.6548Z",pauseLeft:"M8.66667 6.66667C8.29848 6.66667 8 6.96514 8 7.33333V24.6667C8 25.0349 8.29848 25.3333 8.66667 25.3333H12.6667C13.0349 25.3333 13.3333 25.0349 13.3333 24.6667V7.33333C13.3333 6.96514 13.0349 6.66667 12.6667 6.66667H8.66667Z",pauseRight:"M19.3333 6.66667C18.9651 6.66667 18.6667 6.96514 18.6667 7.33333V24.6667C18.6667 25.0349 18.9651 25.3333 19.3333 25.3333H23.3333C23.7015 25.3333 24 25.0349 24 24.6667V7.33333C24 6.96514 23.7015 6.66667 23.3333 6.66667H19.3333Z",previousLeft:"M25.1377 6.78532C25.5778 6.46017 26.2006 6.77434 26.2006 7.32151V24.6785C26.2006 25.2257 25.5778 25.5398 25.1377 25.2147L13.3924 16.5358C13.0318 16.2693 13.0318 15.7299 13.3924 15.4634L25.1377 6.78532Z",previousRight:"M8.00004 6.6667C8.36823 6.6667 8.66671 6.96518 8.66671 7.33337V24.6667C8.66671 25.0349 8.36823 25.3334 8.00004 25.3334H6.00004C5.63185 25.3334 5.33337 25.0349 5.33337 24.6667V7.33337C5.33337 6.96518 5.63185 6.6667 6.00004 6.6667H8.00004Z",nextLeft:"M6.39621 6.78532C5.95613 6.46017 5.33337 6.77434 5.33337 7.32151V24.6785C5.33337 25.2257 5.95616 25.5398 6.39623 25.2147L18.1415 16.5358C18.5022 16.2693 18.5022 15.7299 18.1415 15.4634L6.39621 6.78532Z",nextRight:"M23.5339 6.6667C23.1657 6.6667 22.8672 6.96518 22.8672 7.33337V24.6667C22.8672 25.0349 23.1657 25.3334 23.5339 25.3334H25.5339C25.9021 25.3334 26.2006 25.0349 26.2006 24.6667V7.33337C26.2006 6.96518 25.9021 6.6667 25.5339 6.6667H23.5339Z",shuffle:"M23.7295 5.65252C23.2895 5.32737 22.6667 5.64155 22.6667 6.18871V7.86672C22.6667 7.94036 22.607 8.00005 22.5334 8.00005H21.3334C18.6228 8.00005 16.2269 9.34843 14.7798 11.411C14.7251 11.489 14.6083 11.489 14.5536 11.411C13.1066 9.34843 10.7106 8.00005 8.00004 8.00005H6.00004C5.63185 8.00005 5.33337 8.29853 5.33337 8.66672V10.3998C5.33337 10.768 5.63185 11.0665 6.00004 11.0665H8.00004C10.724 11.0665 12.9336 13.2748 12.9336 16.0001C12.9336 18.7253 10.724 20.9336 8.00004 20.9336H6.00004C5.63185 20.9336 5.33337 21.2321 5.33337 21.6003V23.3334C5.33337 23.7016 5.63185 24.0001 6.00004 24.0001H8.00004C10.7106 24.0001 13.1066 22.6517 14.5536 20.5891C14.6083 20.5111 14.7251 20.5111 14.7798 20.5891C16.2269 22.6517 18.6228 24.0001 21.3334 24.0001H22.5334C22.607 24.0001 22.6667 24.0597 22.6667 24.1334V25.8113C22.6667 26.3585 23.2895 26.6727 23.7296 26.3475L28.2568 23.0022C28.6175 22.7357 28.6175 22.1963 28.2568 21.9298L23.7295 18.5848C23.2895 18.2597 22.6667 18.5738 22.6667 19.121V20.8003C22.6667 20.874 22.607 20.9336 22.5334 20.9336H21.3334C18.6094 20.9336 16.3998 18.7253 16.3998 16.0001C16.3998 13.2748 18.6094 11.0665 21.3334 11.0665H22.5334C22.607 11.0665 22.6667 11.1262 22.6667 11.1998V12.879C22.6667 13.4262 23.2895 13.7404 23.7296 13.4152L28.2568 10.0699C28.6175 9.8034 28.6175 9.26401 28.2568 8.99753L23.7295 5.65252Z",repeatLeft:"M22.1969 4.98846C21.7569 4.66331 21.1341 4.97748 21.1341 5.52465V7.20266C21.1341 7.27629 21.0744 7.33599 21.0008 7.33599H11.1341C8.18859 7.33599 5.80078 9.72381 5.80078 12.6693V14.6693C5.80078 15.0375 6.09925 15.336 6.46744 15.336H8.20078C8.56897 15.336 8.86744 15.0375 8.86744 14.6693V13.0691C8.86744 11.5963 10.0613 10.4024 11.5341 10.4024H21.0008C21.0744 10.4024 21.1341 10.4621 21.1341 10.5357V12.215C21.1341 12.7621 21.7569 13.0763 22.197 12.7511L26.7242 9.40583C27.0849 9.13934 27.0849 8.59995 26.7242 8.33347L22.1969 4.98846Z",repeatRight:"M10.8652 24.7975C10.8652 24.7238 10.9249 24.6641 10.9986 24.6641H20.8652C23.8108 24.6641 26.1986 22.2763 26.1986 19.3308V17.3308C26.1986 16.9626 25.9001 16.6641 25.5319 16.6641H23.7986C23.4304 16.6641 23.1319 16.9626 23.1319 17.3308V18.931C23.1319 20.4038 21.938 21.5977 20.4652 21.5977H10.9986C10.9249 21.5977 10.8652 21.538 10.8652 21.4644V19.7851C10.8652 19.238 10.2425 18.9238 9.80239 19.249L5.27512 22.5943C4.91447 22.8608 4.91448 23.4002 5.27514 23.6666L9.80241 27.0116C10.2425 27.3368 10.8652 27.0226 10.8652 26.4755V24.7975Z"};var xn=Ae('<path class="svelte-fx15zi"></path>'),yn=Ae('<path class="svelte-fx15zi"></path>'),En=un('<div class="svelte-audio-player svelte-fx15zi"><div class="track-name svelte-fx15zi"><div class="counter svelte-fx15zi"> </div> <div class="title svelte-fx15zi"> </div></div> <div class="track-info svelte-fx15zi"><div class="buttons-control svelte-fx15zi"><button aria-label="Previous Track" class="svelte-fx15zi"><svg class="svelte-fx15zi"><path class="svelte-fx15zi"></path><path class="svelte-fx15zi"></path></svg></button> <button class="svelte-fx15zi"><svg class="svelte-fx15zi"><path class="svelte-fx15zi"></path><!></svg></button> <button aria-label="Next Track" class="svelte-fx15zi"><svg class="svelte-fx15zi"><path class="svelte-fx15zi"></path><path class="svelte-fx15zi"></path></svg></button> <button aria-label="Shuffle"><svg class="svelte-fx15zi"><path class="svelte-fx15zi"></path></svg></button> <button aria-label="Repeat"><svg class="svelte-fx15zi"><path class="svelte-fx15zi"></path><path class="svelte-fx15zi"></path></svg></button></div> <div class="track-ranges svelte-fx15zi"><div class="progress-control svelte-fx15zi"><div class="current-time svelte-fx15zi"><span> </span></div> <input type="range" class="svelte-fx15zi"> <div class="duration-time svelte-fx15zi"><span role="button" tabindex="0"> </span></div></div> <div class="volume-control svelte-fx15zi"><button class="svelte-fx15zi"><svg class="svelte-fx15zi"><path class="svelte-fx15zi"></path><path class="svelte-fx15zi"></path><!></svg></button> <input type="range" min="0" max="1" step="0.01" class="svelte-fx15zi"></div></div></div></div>');function bn(t,e){ze(e,!1);let r=gn(e,"tracks",24,()=>[]),n,s=P(!1),l=P(!1),a=P(!1),c=P(!1),o=!1,v=P(0),_=P(0),i=P(1),f=P(0),m=u(i);const k=0,z=.01,N="http://www.w3.org/2000/svg",y="0 0 32 32";Cn(()=>{r().length>0&&(n=new Audio(r()[u(f)].src),n.volume=u(i),n.addEventListener("timeupdate",X),n.addEventListener("loadedmetadata",Ln),n.addEventListener("ended",zn))});const Ct=()=>{u(s)?n.pause():n.play(),E(s,!u(s))},X=()=>{E(v,n.currentTime)},Ln=()=>{E(_,n.duration)},kn=w=>{n.currentTime=w.target.value,E(v,n.currentTime)},Tn=w=>{E(i,parseFloat(w.target.value)),n.volume=u(i),E(l,u(i)===0)},Sn=()=>{E(l,!u(l)),u(l)?(m=u(i),E(i,0)):E(i,m),n.muted=u(l),n.volume=u(i)},Be=()=>{o=!o},zn=()=>{u(c)?(n.currentTime=0,n.play()):Fe()},Fe=()=>{if(u(a)){let w;do w=Math.floor(Math.random()*r().length);while(w===u(f));E(f,w)}else u(c)||E(f,(u(f)+1)%r().length);n.src=r()[u(f)].src,n.play(),E(s,!0)},Vn=()=>{E(f,(u(f)-1+r().length)%r().length),n.src=r()[u(f)].src,n.play(),E(s,!0)},Mn=()=>{E(a,!u(a))},Nn=()=>{E(c,!u(c))},qe=(w,$)=>{if(isNaN(w))return"0:00";const rr=Q=>{const yt=Math.floor(Q/60),nr=Math.floor(Q%60);return`${yt}:${nr<10?"0":""}${nr}`};if($){let Q=o?u(_)-u(v):u(_);Q<0&&(Q=0);const yt=rr(Q);return o?`-${yt}`:yt}else return rr(w)};pn();var Ze=En(),$e=g(Ze),Ue=g($e),Rn=g(Ue),An=x(Ue,2),Hn=g(An),Dn=x($e,2),je=g(Dn),qt=g(je),Zt=g(qt);d(Zt,"xmlns",N),d(Zt,"viewBox",y);var Ye=g(Zt),On=x(Ye),mt=x(qt,2),$t=g(mt);d($t,"xmlns",N),d($t,"viewBox",y);var We=g($t),Pn=x(We);{var In=w=>{var $=xn();nt(()=>d($,"d",L.pauseRight)),Ft(w,$)};He(Pn,w=>{u(s)&&w(In)})}var Ut=x(mt,2),jt=g(Ut);d(jt,"xmlns",N),d(jt,"viewBox",y);var Ge=g(jt),Bn=x(Ge),wt=x(Ut,2),Yt=g(wt);d(Yt,"xmlns",N),d(Yt,"viewBox",y);var Fn=g(Yt),Wt=x(wt,2),Gt=g(Wt);d(Gt,"xmlns",N),d(Gt,"viewBox",y);var Ke=g(Gt),qn=x(Ke),Zn=x(je,2),Xe=g(Zn),Je=g(Xe),$n=g(Je),Un=g($n);nt(()=>ht(Un,qe(u(v),!1)));var J=x(Je,2);d(J,"min",k),d(J,"step",z);var jn=x(J,2),Kt=g(jn),Yn=g(Kt);nt(()=>ht(Yn,qe(u(v),!0)));var Wn=x(Xe,2),xt=g(Wn),Xt=g(xt);d(Xt,"xmlns",N),d(Xt,"viewBox",y);var Qe=g(Xt),tr=x(Qe),Gn=x(tr);{var Kn=w=>{var $=yn();nt(()=>d($,"d",L.volumeRightLine)),Ft(w,$)};He(Gn,w=>{!u(l)&&u(i)!=0&&w(Kn)})}var er=x(xt,2);nt(()=>{ht(Rn,`${u(f)+1} / ${r().length??""}`),ht(Hn,`${r()[u(f)].author??""} – «${r()[u(f)].title??""}»`),d(Ye,"d",L.previousLeft),d(On,"d",L.previousRight),d(mt,"aria-label",u(s)?"Pause":"Play"),d(We,"d",u(s)?L.pauseLeft:L.play),d(Ge,"d",L.nextLeft),d(Bn,"d",L.nextRight),Pe(wt,`${(u(a)?"":"shuffle")??""} svelte-fx15zi`),d(Fn,"d",L.shuffle),Pe(Wt,`${(u(c)?"":"repeat")??""} svelte-fx15zi`),d(Ke,"d",L.repeatLeft),d(qn,"d",L.repeatRight),d(J,"max",u(_)),De(J,u(v)),d(xt,"aria-label",u(l)?"Unmute":"Mute"),d(Qe,"d",u(l)||u(i)==0?L.muteSpeaker:L.volumeSpeaker),d(tr,"d",u(l)||u(i)==0?L.muteClose:L.volumeLeftLine),De(er,u(i))}),D("click",qt,Vn),D("click",mt,Ct),D("click",Ut,Fe),D("click",wt,Mn),D("click",Wt,Nn),D("input",J,kn),D("click",Kt,Be),D("keydown",Kt,w=>w.key==="Enter"&&Be()),D("click",xt,Sn),D("input",er,Tn),Ft(t,Ze),Ve()}return on(bn,{target:document.getElementById("svelte-audio-player"),props:{tracks:[{src:"https://muz-tv.ru/storage/files/chart-tracks/1594629860.mp3",author:"ЁЛКА",title:"Мне Легко"},{src:"https://muz-tv.ru/storage/files/chart-tracks/1601897430.mp3",author:"ISB",title:"Who I Am"},{src:"https://muz-tv.ru/storage/files/chart-tracks/1594629860.mp3",author:"ЁЛКА X АНТ",title:"Комната"},{src:"https://muz-tv.ru/storage/files/chart-tracks/1601289714.mp3",author:"ЁЛМАРИ КРАЙМБРЕРИ",title:"Океан"},{src:"https://muz-tv.ru/storage/files/chart-tracks/1601027082.mp3",author:"ПОЛИНА ГАГАРИНА",title:"На Расстоянии"}]}})}();
