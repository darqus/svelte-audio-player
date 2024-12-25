function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function to_number(value) {
    return value === '' ? null : +value;
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data === data)
        return;
    text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
        return;
    }
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        try {
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
        }
        catch (e) {
            // reset dirty state to not end up in a deadlocked state and then rethrow
            dirty_components.length = 0;
            flushidx = 0;
            throw e;
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 */
function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
    else if (callback) {
        callback();
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
            // if the component was destroyed immediately
            // it will update the `$$.on_destroy` reference to `null`.
            // the destructured on_destroy may still reference to the old array
            if (component.$$.on_destroy) {
                component.$$.on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        flush_render_callbacks($$.after_update);
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: [],
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        if (!is_function(callback)) {
            return noop;
        }
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

const paths = {
  volumeSpeaker:
    'M17.5091 24.6595C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9992 9.36923 19.9992H4.66667C4.29848 19.9992 4 19.7007 4 19.3325V12.6658C4 12.2976 4.29848 11.9992 4.66667 11.9992H9.37115C9.39967 11.9992 9.42745 11.99 9.45039 11.9731L16.4463 6.80363C16.8863 6.47845 17.5091 6.79262 17.5091 7.3398L17.5091 24.6595Z',
  volumeLeftLine:
    'M27.5091 9.33336C27.8773 9.33336 28.1758 9.63184 28.1758 10V22C28.1758 22.3682 27.8773 22.6667 27.5091 22.6667H26.1758C25.8076 22.6667 25.5091 22.3682 25.5091 22V10C25.5091 9.63184 25.8076 9.33336 26.1758 9.33336L27.5091 9.33336Z',
  volumeRightLine:
    'M22.1758 12C22.544 12 22.8424 12.2985 22.8424 12.6667V19.3334C22.8424 19.7016 22.544 20 22.1758 20H20.8424C20.4743 20 20.1758 19.7016 20.1758 19.3334V12.6667C20.1758 12.2985 20.4743 12 20.8424 12H22.1758Z',
  muteSpeaker:
    'M17.5091 24.6594C17.5091 25.2066 16.8864 25.5208 16.4463 25.1956L9.44847 20.0252C9.42553 20.0083 9.39776 19.9991 9.36923 19.9991H4.66667C4.29848 19.9991 4 19.7006 4 19.3325V12.6658C4 12.2976 4.29848 11.9991 4.66667 11.9991H9.37115C9.39967 11.9991 9.42745 11.99 9.45039 11.973L16.4463 6.8036C16.8863 6.47842 17.5091 6.79259 17.5091 7.33977L17.5091 24.6594Z',
  muteClose:
    'M28.8621 13.6422C29.1225 13.3818 29.1225 12.9597 28.8621 12.6994L27.9193 11.7566C27.659 11.4962 27.2368 11.4962 26.9765 11.7566L24.7134 14.0197C24.6613 14.0717 24.5769 14.0717 24.5248 14.0197L22.262 11.7568C22.0016 11.4964 21.5795 11.4964 21.3191 11.7568L20.3763 12.6996C20.116 12.9599 20.116 13.382 20.3763 13.6424L22.6392 15.9053C22.6913 15.9573 22.6913 16.0418 22.6392 16.0938L20.3768 18.3562C20.1165 18.6166 20.1165 19.0387 20.3768 19.299L21.3196 20.2419C21.58 20.5022 22.0021 20.5022 22.2624 20.2418L24.5248 17.9795C24.5769 17.9274 24.6613 17.9274 24.7134 17.9795L26.976 20.2421C27.2363 20.5024 27.6585 20.5024 27.9188 20.2421L28.8616 19.2992C29.122 19.0389 29.122 18.6168 28.8616 18.3564L26.599 16.0938C26.547 16.0418 26.547 15.9573 26.599 15.9053L28.8621 13.6422Z',
  play: 'M10.6666 6.6548C10.6666 6.10764 11.2894 5.79346 11.7295 6.11861L24.377 15.4634C24.7377 15.7298 24.7377 16.2692 24.377 16.5357L11.7295 25.8813C11.2894 26.2065 10.6666 25.8923 10.6666 25.3451L10.6666 6.6548Z',
  pauseLeft:
    'M8.66667 6.66667C8.29848 6.66667 8 6.96514 8 7.33333V24.6667C8 25.0349 8.29848 25.3333 8.66667 25.3333H12.6667C13.0349 25.3333 13.3333 25.0349 13.3333 24.6667V7.33333C13.3333 6.96514 13.0349 6.66667 12.6667 6.66667H8.66667Z',
  pauseRight:
    'M19.3333 6.66667C18.9651 6.66667 18.6667 6.96514 18.6667 7.33333V24.6667C18.6667 25.0349 18.9651 25.3333 19.3333 25.3333H23.3333C23.7015 25.3333 24 25.0349 24 24.6667V7.33333C24 6.96514 23.7015 6.66667 23.3333 6.66667H19.3333Z',
  previousLeft:
    'M25.1377 6.78532C25.5778 6.46017 26.2006 6.77434 26.2006 7.32151V24.6785C26.2006 25.2257 25.5778 25.5398 25.1377 25.2147L13.3924 16.5358C13.0318 16.2693 13.0318 15.7299 13.3924 15.4634L25.1377 6.78532Z',
  previousRight:
    'M8.00004 6.6667C8.36823 6.6667 8.66671 6.96518 8.66671 7.33337V24.6667C8.66671 25.0349 8.36823 25.3334 8.00004 25.3334H6.00004C5.63185 25.3334 5.33337 25.0349 5.33337 24.6667V7.33337C5.33337 6.96518 5.63185 6.6667 6.00004 6.6667H8.00004Z',
  nextLeft:
    'M6.39621 6.78532C5.95613 6.46017 5.33337 6.77434 5.33337 7.32151V24.6785C5.33337 25.2257 5.95616 25.5398 6.39623 25.2147L18.1415 16.5358C18.5022 16.2693 18.5022 15.7299 18.1415 15.4634L6.39621 6.78532Z',
  nextRight:
    'M23.5339 6.6667C23.1657 6.6667 22.8672 6.96518 22.8672 7.33337V24.6667C22.8672 25.0349 23.1657 25.3334 23.5339 25.3334H25.5339C25.9021 25.3334 26.2006 25.0349 26.2006 24.6667V7.33337C26.2006 6.96518 25.9021 6.6667 25.5339 6.6667H23.5339Z',
  shuffle:
    'M23.7295 5.65252C23.2895 5.32737 22.6667 5.64155 22.6667 6.18871V7.86672C22.6667 7.94036 22.607 8.00005 22.5334 8.00005H21.3334C18.6228 8.00005 16.2269 9.34843 14.7798 11.411C14.7251 11.489 14.6083 11.489 14.5536 11.411C13.1066 9.34843 10.7106 8.00005 8.00004 8.00005H6.00004C5.63185 8.00005 5.33337 8.29853 5.33337 8.66672V10.3998C5.33337 10.768 5.63185 11.0665 6.00004 11.0665H8.00004C10.724 11.0665 12.9336 13.2748 12.9336 16.0001C12.9336 18.7253 10.724 20.9336 8.00004 20.9336H6.00004C5.63185 20.9336 5.33337 21.2321 5.33337 21.6003V23.3334C5.33337 23.7016 5.63185 24.0001 6.00004 24.0001H8.00004C10.7106 24.0001 13.1066 22.6517 14.5536 20.5891C14.6083 20.5111 14.7251 20.5111 14.7798 20.5891C16.2269 22.6517 18.6228 24.0001 21.3334 24.0001H22.5334C22.607 24.0001 22.6667 24.0597 22.6667 24.1334V25.8113C22.6667 26.3585 23.2895 26.6727 23.7296 26.3475L28.2568 23.0022C28.6175 22.7357 28.6175 22.1963 28.2568 21.9298L23.7295 18.5848C23.2895 18.2597 22.6667 18.5738 22.6667 19.121V20.8003C22.6667 20.874 22.607 20.9336 22.5334 20.9336H21.3334C18.6094 20.9336 16.3998 18.7253 16.3998 16.0001C16.3998 13.2748 18.6094 11.0665 21.3334 11.0665H22.5334C22.607 11.0665 22.6667 11.1262 22.6667 11.1998V12.879C22.6667 13.4262 23.2895 13.7404 23.7296 13.4152L28.2568 10.0699C28.6175 9.8034 28.6175 9.26401 28.2568 8.99753L23.7295 5.65252Z',
  repeatLeft:
    'M22.1969 4.98846C21.7569 4.66331 21.1341 4.97748 21.1341 5.52465V7.20266C21.1341 7.27629 21.0744 7.33599 21.0008 7.33599H11.1341C8.18859 7.33599 5.80078 9.72381 5.80078 12.6693V14.6693C5.80078 15.0375 6.09925 15.336 6.46744 15.336H8.20078C8.56897 15.336 8.86744 15.0375 8.86744 14.6693V13.0691C8.86744 11.5963 10.0613 10.4024 11.5341 10.4024H21.0008C21.0744 10.4024 21.1341 10.4621 21.1341 10.5357V12.215C21.1341 12.7621 21.7569 13.0763 22.197 12.7511L26.7242 9.40583C27.0849 9.13934 27.0849 8.59995 26.7242 8.33347L22.1969 4.98846Z',
  repeatRight:
    'M10.8652 24.7975C10.8652 24.7238 10.9249 24.6641 10.9986 24.6641H20.8652C23.8108 24.6641 26.1986 22.2763 26.1986 19.3308V17.3308C26.1986 16.9626 25.9001 16.6641 25.5319 16.6641H23.7986C23.4304 16.6641 23.1319 16.9626 23.1319 17.3308V18.931C23.1319 20.4038 21.938 21.5977 20.4652 21.5977H10.9986C10.9249 21.5977 10.8652 21.538 10.8652 21.4644V19.7851C10.8652 19.238 10.2425 18.9238 9.80239 19.249L5.27512 22.5943C4.91447 22.8608 4.91448 23.4002 5.27514 23.6666L9.80241 27.0116C10.2425 27.3368 10.8652 27.0226 10.8652 26.4755V24.7975Z',
};

/* src/components/controls/TrackName.svelte generated by Svelte v3.59.2 */

function create_else_block(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.textContent = "No track available";
			attr(div, "class", "title");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

// (7:2) {#if tracks.length > 0}
function create_if_block$2(ctx) {
	let div0;
	let t0_value = /*currentTrackIndex*/ ctx[0] + 1 + "";
	let t0;
	let t1;
	let t2_value = /*tracks*/ ctx[1].length + "";
	let t2;
	let t3;
	let div1;
	let t4_value = /*tracks*/ ctx[1][/*currentTrackIndex*/ ctx[0]].author + "";
	let t4;
	let t5;
	let t6_value = /*tracks*/ ctx[1][/*currentTrackIndex*/ ctx[0]].title + "";
	let t6;
	let t7;

	return {
		c() {
			div0 = element("div");
			t0 = text(t0_value);
			t1 = text(" / ");
			t2 = text(t2_value);
			t3 = space();
			div1 = element("div");
			t4 = text(t4_value);
			t5 = text(" – «");
			t6 = text(t6_value);
			t7 = text("»");
			attr(div0, "class", "counter");
			attr(div1, "class", "title");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, t0);
			append(div0, t1);
			append(div0, t2);
			insert(target, t3, anchor);
			insert(target, div1, anchor);
			append(div1, t4);
			append(div1, t5);
			append(div1, t6);
			append(div1, t7);
		},
		p(ctx, dirty) {
			if (dirty & /*currentTrackIndex*/ 1 && t0_value !== (t0_value = /*currentTrackIndex*/ ctx[0] + 1 + "")) set_data(t0, t0_value);
			if (dirty & /*tracks*/ 2 && t2_value !== (t2_value = /*tracks*/ ctx[1].length + "")) set_data(t2, t2_value);
			if (dirty & /*tracks, currentTrackIndex*/ 3 && t4_value !== (t4_value = /*tracks*/ ctx[1][/*currentTrackIndex*/ ctx[0]].author + "")) set_data(t4, t4_value);
			if (dirty & /*tracks, currentTrackIndex*/ 3 && t6_value !== (t6_value = /*tracks*/ ctx[1][/*currentTrackIndex*/ ctx[0]].title + "")) set_data(t6, t6_value);
		},
		d(detaching) {
			if (detaching) detach(div0);
			if (detaching) detach(t3);
			if (detaching) detach(div1);
		}
	};
}

function create_fragment$4(ctx) {
	let div;

	function select_block_type(ctx, dirty) {
		if (/*tracks*/ ctx[1].length > 0) return create_if_block$2;
		return create_else_block;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	return {
		c() {
			div = element("div");
			if_block.c();
			attr(div, "class", "track-name");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if_block.m(div, null);
		},
		p(ctx, [dirty]) {
			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(div, null);
				}
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			if_block.d();
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { currentTrackIndex } = $$props;
	let { tracks } = $$props;

	$$self.$$set = $$props => {
		if ('currentTrackIndex' in $$props) $$invalidate(0, currentTrackIndex = $$props.currentTrackIndex);
		if ('tracks' in $$props) $$invalidate(1, tracks = $$props.tracks);
	};

	return [currentTrackIndex, tracks];
}

class TrackName extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { currentTrackIndex: 0, tracks: 1 });
	}
}

/* src/components/controls/ButtonSvg.svelte generated by Svelte v3.59.2 */

function create_if_block$1(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "d", /*pathRight*/ ctx[3]);
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*pathRight*/ 8) {
				attr(path, "d", /*pathRight*/ ctx[3]);
			}
		},
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment$3(ctx) {
	let button;
	let svg;
	let path;
	let mounted;
	let dispose;
	let if_block = /*pathRight*/ ctx[3] && create_if_block$1(ctx);

	return {
		c() {
			button = element("button");
			svg = svg_element("svg");
			path = svg_element("path");
			if (if_block) if_block.c();
			attr(path, "d", /*pathLeft*/ ctx[2]);
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "viewBox", "0 0 32 32");
			attr(button, "aria-label", /*ariaLabel*/ ctx[1]);
			attr(button, "class", /*className*/ ctx[4]);
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, svg);
			append(svg, path);
			if (if_block) if_block.m(svg, null);

			if (!mounted) {
				dispose = listen(button, "click", function () {
					if (is_function(/*onClick*/ ctx[0])) /*onClick*/ ctx[0].apply(this, arguments);
				});

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*pathLeft*/ 4) {
				attr(path, "d", /*pathLeft*/ ctx[2]);
			}

			if (/*pathRight*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(svg, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*ariaLabel*/ 2) {
				attr(button, "aria-label", /*ariaLabel*/ ctx[1]);
			}

			if (dirty & /*className*/ 16) {
				attr(button, "class", /*className*/ ctx[4]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(button);
			if (if_block) if_block.d();
			mounted = false;
			dispose();
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { onClick } = $$props;
	let { ariaLabel } = $$props;
	let { pathLeft } = $$props;
	let { pathRight = null } = $$props;
	let { className = '' } = $$props;

	$$self.$$set = $$props => {
		if ('onClick' in $$props) $$invalidate(0, onClick = $$props.onClick);
		if ('ariaLabel' in $$props) $$invalidate(1, ariaLabel = $$props.ariaLabel);
		if ('pathLeft' in $$props) $$invalidate(2, pathLeft = $$props.pathLeft);
		if ('pathRight' in $$props) $$invalidate(3, pathRight = $$props.pathRight);
		if ('className' in $$props) $$invalidate(4, className = $$props.className);
	};

	return [onClick, ariaLabel, pathLeft, pathRight, className];
}

class ButtonSvg extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			onClick: 0,
			ariaLabel: 1,
			pathLeft: 2,
			pathRight: 3,
			className: 4
		});
	}
}

/* src/components/controls/RangeDuration.svelte generated by Svelte v3.59.2 */

function create_fragment$2(ctx) {
	let div2;
	let div0;
	let span0;
	let t0_value = /*formatTime*/ ctx[4](/*currentTime*/ ctx[1], false) + "";
	let t0;
	let t1;
	let input;
	let t2;
	let div1;
	let span1;
	let t3_value = /*formatTime*/ ctx[4](/*currentTime*/ ctx[1], true) + "";
	let t3;
	let mounted;
	let dispose;

	return {
		c() {
			div2 = element("div");
			div0 = element("div");
			span0 = element("span");
			t0 = text(t0_value);
			t1 = space();
			input = element("input");
			t2 = space();
			div1 = element("div");
			span1 = element("span");
			t3 = text(t3_value);
			attr(div0, "class", "current-time");
			attr(input, "type", "range");
			attr(input, "min", "0");
			attr(input, "max", "1");
			attr(input, "step", "0.01");
			attr(span1, "role", "button");
			attr(span1, "tabindex", "0");
			attr(div1, "class", "duration-time");
			attr(div2, "class", "progress-control");
		},
		m(target, anchor) {
			insert(target, div2, anchor);
			append(div2, div0);
			append(div0, span0);
			append(span0, t0);
			append(div2, t1);
			append(div2, input);
			set_input_value(input, /*position*/ ctx[0]);
			append(div2, t2);
			append(div2, div1);
			append(div1, span1);
			append(span1, t3);

			if (!mounted) {
				dispose = [
					listen(input, "change", /*input_change_input_handler*/ ctx[7]),
					listen(input, "input", /*input_change_input_handler*/ ctx[7]),
					listen(input, "input", function () {
						if (is_function(/*onInput*/ ctx[2])) /*onInput*/ ctx[2].apply(this, arguments);
					}),
					listen(span1, "click", function () {
						if (is_function(/*onToggleTimeDisplay*/ ctx[3])) /*onToggleTimeDisplay*/ ctx[3].apply(this, arguments);
					}),
					listen(span1, "keydown", /*keydown_handler*/ ctx[8])
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;
			if (dirty & /*currentTime*/ 2 && t0_value !== (t0_value = /*formatTime*/ ctx[4](/*currentTime*/ ctx[1], false) + "")) set_data(t0, t0_value);

			if (dirty & /*position*/ 1) {
				set_input_value(input, /*position*/ ctx[0]);
			}

			if (dirty & /*currentTime*/ 2 && t3_value !== (t3_value = /*formatTime*/ ctx[4](/*currentTime*/ ctx[1], true) + "")) set_data(t3, t3_value);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div2);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { currentTime } = $$props;
	let { duration } = $$props;
	let { position } = $$props;
	let { showElapsedTime } = $$props;
	let { onInput } = $$props;
	let { onToggleTimeDisplay } = $$props;

	const formatTime = (seconds, isElapsedTime) => {
		if (isNaN(seconds)) return '0:00';

		const format = time => {
			const minutes = Math.floor(time / 60);
			const secs = Math.floor(time % 60);
			return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
		};

		if (isElapsedTime) {
			let elapsed = showElapsedTime ? duration - currentTime : duration;
			if (elapsed < 0) elapsed = 0;
			const time = format(elapsed);
			return showElapsedTime ? `-${time}` : time;
		} else {
			return format(seconds);
		}
	};

	function input_change_input_handler() {
		position = to_number(this.value);
		$$invalidate(0, position);
	}

	const keydown_handler = e => e.key === 'Enter' && onToggleTimeDisplay();

	$$self.$$set = $$props => {
		if ('currentTime' in $$props) $$invalidate(1, currentTime = $$props.currentTime);
		if ('duration' in $$props) $$invalidate(5, duration = $$props.duration);
		if ('position' in $$props) $$invalidate(0, position = $$props.position);
		if ('showElapsedTime' in $$props) $$invalidate(6, showElapsedTime = $$props.showElapsedTime);
		if ('onInput' in $$props) $$invalidate(2, onInput = $$props.onInput);
		if ('onToggleTimeDisplay' in $$props) $$invalidate(3, onToggleTimeDisplay = $$props.onToggleTimeDisplay);
	};

	return [
		position,
		currentTime,
		onInput,
		onToggleTimeDisplay,
		formatTime,
		duration,
		showElapsedTime,
		input_change_input_handler,
		keydown_handler
	];
}

class RangeDuration extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			currentTime: 1,
			duration: 5,
			position: 0,
			showElapsedTime: 6,
			onInput: 2,
			onToggleTimeDisplay: 3
		});
	}
}

/* src/components/controls/RangeVolume.svelte generated by Svelte v3.59.2 */

function create_if_block(ctx) {
	let path;

	return {
		c() {
			path = svg_element("path");
			attr(path, "d", paths.volumeRightLine);
		},
		m(target, anchor) {
			insert(target, path, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) detach(path);
		}
	};
}

function create_fragment$1(ctx) {
	let div;
	let button;
	let svg;
	let path0;
	let path0_d_value;
	let path1;
	let path1_d_value;
	let button_aria_label_value;
	let t;
	let input;
	let mounted;
	let dispose;
	let if_block = !/*isMuted*/ ctx[1] && /*volume*/ ctx[0] != 0 && create_if_block();

	return {
		c() {
			div = element("div");
			button = element("button");
			svg = svg_element("svg");
			path0 = svg_element("path");
			path1 = svg_element("path");
			if (if_block) if_block.c();
			t = space();
			input = element("input");

			attr(path0, "d", path0_d_value = /*isMuted*/ ctx[1] || /*volume*/ ctx[0] == 0
			? paths.muteSpeaker
			: paths.volumeSpeaker);

			attr(path1, "d", path1_d_value = /*isMuted*/ ctx[1] || /*volume*/ ctx[0] == 0
			? paths.muteClose
			: paths.volumeLeftLine);

			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "viewBox", "0 0 32 32");
			attr(button, "aria-label", button_aria_label_value = /*isMuted*/ ctx[1] ? 'Unmute' : 'Mute');
			attr(input, "type", "range");
			attr(input, "min", "0");
			attr(input, "max", "1");
			attr(input, "step", "0.01");
			attr(div, "class", "volume-control");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, button);
			append(button, svg);
			append(svg, path0);
			append(svg, path1);
			if (if_block) if_block.m(svg, null);
			append(div, t);
			append(div, input);
			set_input_value(input, /*volume*/ ctx[0]);

			if (!mounted) {
				dispose = [
					listen(button, "click", function () {
						if (is_function(/*onToggleMute*/ ctx[3])) /*onToggleMute*/ ctx[3].apply(this, arguments);
					}),
					listen(input, "change", /*input_change_input_handler*/ ctx[4]),
					listen(input, "input", /*input_change_input_handler*/ ctx[4]),
					listen(input, "input", function () {
						if (is_function(/*onInput*/ ctx[2])) /*onInput*/ ctx[2].apply(this, arguments);
					})
				];

				mounted = true;
			}
		},
		p(new_ctx, [dirty]) {
			ctx = new_ctx;

			if (dirty & /*isMuted, volume*/ 3 && path0_d_value !== (path0_d_value = /*isMuted*/ ctx[1] || /*volume*/ ctx[0] == 0
			? paths.muteSpeaker
			: paths.volumeSpeaker)) {
				attr(path0, "d", path0_d_value);
			}

			if (dirty & /*isMuted, volume*/ 3 && path1_d_value !== (path1_d_value = /*isMuted*/ ctx[1] || /*volume*/ ctx[0] == 0
			? paths.muteClose
			: paths.volumeLeftLine)) {
				attr(path1, "d", path1_d_value);
			}

			if (!/*isMuted*/ ctx[1] && /*volume*/ ctx[0] != 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block();
					if_block.c();
					if_block.m(svg, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*isMuted*/ 2 && button_aria_label_value !== (button_aria_label_value = /*isMuted*/ ctx[1] ? 'Unmute' : 'Mute')) {
				attr(button, "aria-label", button_aria_label_value);
			}

			if (dirty & /*volume*/ 1) {
				set_input_value(input, /*volume*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { volume } = $$props;
	let { isMuted } = $$props;
	let { onInput } = $$props;
	let { onToggleMute } = $$props;

	function input_change_input_handler() {
		volume = to_number(this.value);
		$$invalidate(0, volume);
	}

	$$self.$$set = $$props => {
		if ('volume' in $$props) $$invalidate(0, volume = $$props.volume);
		if ('isMuted' in $$props) $$invalidate(1, isMuted = $$props.isMuted);
		if ('onInput' in $$props) $$invalidate(2, onInput = $$props.onInput);
		if ('onToggleMute' in $$props) $$invalidate(3, onToggleMute = $$props.onToggleMute);
	};

	return [volume, isMuted, onInput, onToggleMute, input_change_input_handler];
}

class RangeVolume extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			volume: 0,
			isMuted: 1,
			onInput: 2,
			onToggleMute: 3
		});
	}
}

/* src/components/AudioPlayer.svelte generated by Svelte v3.59.2 */

function create_fragment(ctx) {
	let div3;
	let trackname;
	let t0;
	let div2;
	let div0;
	let buttonsvg0;
	let t1;
	let buttonsvg1;
	let t2;
	let buttonsvg2;
	let t3;
	let buttonsvg3;
	let t4;
	let buttonsvg4;
	let t5;
	let div1;
	let rangeduration;
	let t6;
	let rangevolume;
	let current;

	trackname = new TrackName({
			props: {
				currentTrackIndex: /*currentTrackIndex*/ ctx[8],
				tracks: /*tracks*/ ctx[0]
			}
		});

	buttonsvg0 = new ButtonSvg({
			props: {
				onClick: /*prevTrack*/ ctx[17],
				ariaLabel: "Previous Track",
				pathLeft: paths.previousLeft,
				pathRight: paths.previousRight
			}
		});

	buttonsvg1 = new ButtonSvg({
			props: {
				onClick: /*playPause*/ ctx[11],
				ariaLabel: /*isPlaying*/ ctx[9] ? 'Pause' : 'Play',
				pathLeft: /*isPlaying*/ ctx[9] ? paths.pauseLeft : paths.play,
				pathRight: /*isPlaying*/ ctx[9] ? paths.pauseRight : null
			}
		});

	buttonsvg2 = new ButtonSvg({
			props: {
				onClick: /*nextTrack*/ ctx[16],
				ariaLabel: "Next Track",
				pathLeft: paths.nextLeft,
				pathRight: paths.nextRight
			}
		});

	buttonsvg3 = new ButtonSvg({
			props: {
				onClick: /*toggleShuffle*/ ctx[18],
				className: /*shuffle*/ ctx[2] ? '' : 'shuffle',
				ariaLabel: "Shuffle",
				pathLeft: paths.shuffle
			}
		});

	buttonsvg4 = new ButtonSvg({
			props: {
				onClick: /*toggleRepeat*/ ctx[19],
				className: /*repeat*/ ctx[3] ? '' : 'repeat',
				ariaLabel: "Repeat",
				pathLeft: paths.repeatLeft,
				pathRight: paths.repeatRight
			}
		});

	rangeduration = new RangeDuration({
			props: {
				currentTime: /*currentTime*/ ctx[5],
				duration: /*duration*/ ctx[6],
				position: /*position*/ ctx[10],
				showElapsedTime: /*showElapsedTime*/ ctx[4],
				onInput: /*changeDuration*/ ctx[12],
				onToggleTimeDisplay: /*toggleTimeDisplay*/ ctx[15]
			}
		});

	rangevolume = new RangeVolume({
			props: {
				volume: /*volume*/ ctx[7],
				isMuted: /*isMuted*/ ctx[1],
				onInput: /*changeVolume*/ ctx[13],
				onToggleMute: /*toggleMute*/ ctx[14]
			}
		});

	return {
		c() {
			div3 = element("div");
			create_component(trackname.$$.fragment);
			t0 = space();
			div2 = element("div");
			div0 = element("div");
			create_component(buttonsvg0.$$.fragment);
			t1 = space();
			create_component(buttonsvg1.$$.fragment);
			t2 = space();
			create_component(buttonsvg2.$$.fragment);
			t3 = space();
			create_component(buttonsvg3.$$.fragment);
			t4 = space();
			create_component(buttonsvg4.$$.fragment);
			t5 = space();
			div1 = element("div");
			create_component(rangeduration.$$.fragment);
			t6 = space();
			create_component(rangevolume.$$.fragment);
			attr(div0, "class", "buttons-control");
			attr(div1, "class", "track-ranges");
			attr(div2, "class", "track-info");
			attr(div3, "class", "svelte-audio-player");
		},
		m(target, anchor) {
			insert(target, div3, anchor);
			mount_component(trackname, div3, null);
			append(div3, t0);
			append(div3, div2);
			append(div2, div0);
			mount_component(buttonsvg0, div0, null);
			append(div0, t1);
			mount_component(buttonsvg1, div0, null);
			append(div0, t2);
			mount_component(buttonsvg2, div0, null);
			append(div0, t3);
			mount_component(buttonsvg3, div0, null);
			append(div0, t4);
			mount_component(buttonsvg4, div0, null);
			append(div2, t5);
			append(div2, div1);
			mount_component(rangeduration, div1, null);
			append(div1, t6);
			mount_component(rangevolume, div1, null);
			current = true;
		},
		p(ctx, [dirty]) {
			const trackname_changes = {};
			if (dirty & /*currentTrackIndex*/ 256) trackname_changes.currentTrackIndex = /*currentTrackIndex*/ ctx[8];
			if (dirty & /*tracks*/ 1) trackname_changes.tracks = /*tracks*/ ctx[0];
			trackname.$set(trackname_changes);
			const buttonsvg1_changes = {};
			if (dirty & /*isPlaying*/ 512) buttonsvg1_changes.ariaLabel = /*isPlaying*/ ctx[9] ? 'Pause' : 'Play';
			if (dirty & /*isPlaying*/ 512) buttonsvg1_changes.pathLeft = /*isPlaying*/ ctx[9] ? paths.pauseLeft : paths.play;
			if (dirty & /*isPlaying*/ 512) buttonsvg1_changes.pathRight = /*isPlaying*/ ctx[9] ? paths.pauseRight : null;
			buttonsvg1.$set(buttonsvg1_changes);
			const buttonsvg3_changes = {};
			if (dirty & /*shuffle*/ 4) buttonsvg3_changes.className = /*shuffle*/ ctx[2] ? '' : 'shuffle';
			buttonsvg3.$set(buttonsvg3_changes);
			const buttonsvg4_changes = {};
			if (dirty & /*repeat*/ 8) buttonsvg4_changes.className = /*repeat*/ ctx[3] ? '' : 'repeat';
			buttonsvg4.$set(buttonsvg4_changes);
			const rangeduration_changes = {};
			if (dirty & /*currentTime*/ 32) rangeduration_changes.currentTime = /*currentTime*/ ctx[5];
			if (dirty & /*duration*/ 64) rangeduration_changes.duration = /*duration*/ ctx[6];
			if (dirty & /*position*/ 1024) rangeduration_changes.position = /*position*/ ctx[10];
			if (dirty & /*showElapsedTime*/ 16) rangeduration_changes.showElapsedTime = /*showElapsedTime*/ ctx[4];
			rangeduration.$set(rangeduration_changes);
			const rangevolume_changes = {};
			if (dirty & /*volume*/ 128) rangevolume_changes.volume = /*volume*/ ctx[7];
			if (dirty & /*isMuted*/ 2) rangevolume_changes.isMuted = /*isMuted*/ ctx[1];
			rangevolume.$set(rangevolume_changes);
		},
		i(local) {
			if (current) return;
			transition_in(trackname.$$.fragment, local);
			transition_in(buttonsvg0.$$.fragment, local);
			transition_in(buttonsvg1.$$.fragment, local);
			transition_in(buttonsvg2.$$.fragment, local);
			transition_in(buttonsvg3.$$.fragment, local);
			transition_in(buttonsvg4.$$.fragment, local);
			transition_in(rangeduration.$$.fragment, local);
			transition_in(rangevolume.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(trackname.$$.fragment, local);
			transition_out(buttonsvg0.$$.fragment, local);
			transition_out(buttonsvg1.$$.fragment, local);
			transition_out(buttonsvg2.$$.fragment, local);
			transition_out(buttonsvg3.$$.fragment, local);
			transition_out(buttonsvg4.$$.fragment, local);
			transition_out(rangeduration.$$.fragment, local);
			transition_out(rangevolume.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div3);
			destroy_component(trackname);
			destroy_component(buttonsvg0);
			destroy_component(buttonsvg1);
			destroy_component(buttonsvg2);
			destroy_component(buttonsvg3);
			destroy_component(buttonsvg4);
			destroy_component(rangeduration);
			destroy_component(rangevolume);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let position;
	let { tracks = [] } = $$props;

	const LS_KEYS = {
		isPlaying: 'svelte-audio-player-isPlaying',
		volume: 'svelte-audio-player-volume',
		cachedVolume: 'svelte-audio-player-cachedVolume',
		shuffle: 'svelte-audio-player-shuffle',
		repeat: 'svelte-audio-player-repeat',
		showElapsedTime: 'svelte-audio-player-showElapsedTime',
		currentTrackIndex: 'svelte-audio-player-currentTrackIndex',
		currentTime: 'svelte-audio-player-currentTime',
		isMuted: 'svelte-audio-player-isMuted'
	};

	const getItem = (key, defaultValue) => {
		const value = localStorage.getItem(key);
		return value !== null ? JSON.parse(value) : defaultValue;
	};

	let audio;
	let isPlaying = false;
	let isMuted = getItem(LS_KEYS.isMuted, false);
	let shuffle = getItem(LS_KEYS.shuffle, false);
	let repeat = getItem(LS_KEYS.repeat, false);
	let showElapsedTime = getItem(LS_KEYS.showElapsedTime, false);
	let currentTime = parseFloat(localStorage.getItem(LS_KEYS.currentTime)) || 0;
	let duration = 0;
	let volume = parseFloat(localStorage.getItem(LS_KEYS.volume)) || 1;
	let currentTrackIndex = parseInt(localStorage.getItem(LS_KEYS.currentTrackIndex)) || 0;
	let cachedVolume = parseFloat(localStorage.getItem(LS_KEYS.cachedVolume)) || volume;

	// let preset = 'full' // 'minimal', 'normal', 'full'
	onMount(() => {
		if (tracks.length > 0) {
			audio = new Audio(tracks[currentTrackIndex].src);
			audio.volume = volume;
			audio.addEventListener('timeupdate', updateTime);

			audio.addEventListener('loadedmetadata', () => {
				updateDuration();
				audio.currentTime = currentTime; // Restore currentTime here
				$$invalidate(5, currentTime = audio.currentTime); // Ensure state is updated
			});

			audio.addEventListener('ended', handleTrackEnd);
		}

		// Initialize and sync LS_KEYS from localStorage
		const settings = [
			{
				key: LS_KEYS.volume,
				handler: value => {
					$$invalidate(7, volume = parseFloat(value));
					if (audio) audio.volume = volume;
				}
			},
			{
				key: LS_KEYS.cachedVolume,
				handler: value => {
					$$invalidate(20, cachedVolume = parseFloat(value));
				}
			},
			{
				key: LS_KEYS.shuffle,
				handler: value => {
					$$invalidate(2, shuffle = JSON.parse(value));
				}
			},
			{
				key: LS_KEYS.repeat,
				handler: value => {
					$$invalidate(3, repeat = JSON.parse(value));
				}
			},
			{
				key: LS_KEYS.showElapsedTime,
				handler: value => {
					$$invalidate(4, showElapsedTime = JSON.parse(value));
				}
			},
			{
				key: LS_KEYS.currentTrackIndex,
				handler: value => {
					$$invalidate(8, currentTrackIndex = parseInt(value));
				}
			},
			{
				key: LS_KEYS.currentTime,
				handler: value => {
					$$invalidate(5, currentTime = parseFloat(value));

					if (audio) {
						audio.currentTime = currentTime;
					}
				}
			},
			{
				key: LS_KEYS.isMuted,
				handler: value => {
					$$invalidate(1, isMuted = JSON.parse(value));
					if (audio) audio.muted = isMuted;
				}
			}
		];

		settings.forEach(({ key, handler }) => {
			const savedValue = localStorage.getItem(key);

			if (savedValue !== null) {
				handler(savedValue);
			} else {
				// Set default value in localStorage
				const defaultValues = {
					[LS_KEYS.volume]: volume,
					[LS_KEYS.cachedVolume]: cachedVolume,
					[LS_KEYS.shuffle]: shuffle,
					[LS_KEYS.repeat]: repeat,
					[LS_KEYS.showElapsedTime]: showElapsedTime,
					[LS_KEYS.currentTrackIndex]: currentTrackIndex,
					[LS_KEYS.currentTime]: currentTime,
					[LS_KEYS.isMuted]: isMuted
				};

				localStorage.setItem(key, JSON.stringify(defaultValues[key]));
			}
		});
	});

	const playPause = () => {
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}

		$$invalidate(9, isPlaying = !isPlaying);
	};

	const updateTime = () => {
		$$invalidate(5, currentTime = audio.currentTime);
	};

	const updateDuration = () => {
		$$invalidate(6, duration = audio.duration);
	};

	const changeDuration = event => {
		audio.currentTime = event.target.value * duration;
		$$invalidate(5, currentTime = audio.currentTime);
	};

	const changeVolume = event => {
		$$invalidate(7, volume = parseFloat(event.target.value));
		audio.volume = volume;
		$$invalidate(1, isMuted = volume === 0);
	};

	const toggleMute = () => {
		$$invalidate(1, isMuted = !isMuted);

		if (isMuted) {
			$$invalidate(20, cachedVolume = volume);
			$$invalidate(7, volume = 0);
		} else {
			$$invalidate(7, volume = cachedVolume);
		}

		audio.muted = isMuted;
		audio.volume = volume;
	};

	const toggleTimeDisplay = () => {
		$$invalidate(4, showElapsedTime = !showElapsedTime);
	};

	const handleTrackEnd = () => {
		if (repeat) {
			audio.currentTime = 0;
			audio.play();
		} else {
			nextTrack();
		}
	};

	const nextTrack = () => {
		if (shuffle) {
			let newIndex;

			do {
				newIndex = Math.floor(Math.random() * tracks.length);
			} while (newIndex === currentTrackIndex);

			$$invalidate(8, currentTrackIndex = newIndex);
		} else if (!repeat) {
			$$invalidate(8, currentTrackIndex = (currentTrackIndex + 1) % tracks.length);
		}

		audio.src = tracks[currentTrackIndex].src;
		audio.play();
		$$invalidate(9, isPlaying = true);
	};

	const prevTrack = () => {
		$$invalidate(8, currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length);
		audio.src = tracks[currentTrackIndex].src;
		audio.play();
		$$invalidate(9, isPlaying = true);
	};

	const toggleShuffle = () => {
		$$invalidate(2, shuffle = !shuffle);
	};

	const toggleRepeat = () => {
		$$invalidate(3, repeat = !repeat);
	};

	$$self.$$set = $$props => {
		if ('tracks' in $$props) $$invalidate(0, tracks = $$props.tracks);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*volume*/ 128) {
			// Sync state changes to localStorage
			localStorage.setItem(LS_KEYS.volume, JSON.stringify(volume));
		}

		if ($$self.$$.dirty & /*cachedVolume*/ 1048576) {
			localStorage.setItem(LS_KEYS.cachedVolume, JSON.stringify(cachedVolume));
		}

		if ($$self.$$.dirty & /*shuffle*/ 4) {
			localStorage.setItem(LS_KEYS.shuffle, JSON.stringify(shuffle));
		}

		if ($$self.$$.dirty & /*repeat*/ 8) {
			localStorage.setItem(LS_KEYS.repeat, JSON.stringify(repeat));
		}

		if ($$self.$$.dirty & /*showElapsedTime*/ 16) {
			localStorage.setItem(LS_KEYS.showElapsedTime, JSON.stringify(showElapsedTime));
		}

		if ($$self.$$.dirty & /*currentTrackIndex*/ 256) {
			localStorage.setItem(LS_KEYS.currentTrackIndex, JSON.stringify(currentTrackIndex));
		}

		if ($$self.$$.dirty & /*currentTime*/ 32) {
			localStorage.setItem(LS_KEYS.currentTime, JSON.stringify(currentTime));
		}

		if ($$self.$$.dirty & /*isMuted*/ 2) {
			localStorage.setItem(LS_KEYS.isMuted, JSON.stringify(isMuted));
		}

		if ($$self.$$.dirty & /*duration, currentTime*/ 96) {
			// Calculate position
			$$invalidate(10, position = duration ? currentTime / duration : 0);
		}
	};

	return [
		tracks,
		isMuted,
		shuffle,
		repeat,
		showElapsedTime,
		currentTime,
		duration,
		volume,
		currentTrackIndex,
		isPlaying,
		position,
		playPause,
		changeDuration,
		changeVolume,
		toggleMute,
		toggleTimeDisplay,
		nextTrack,
		prevTrack,
		toggleShuffle,
		toggleRepeat,
		cachedVolume
	];
}

class AudioPlayer extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { tracks: 0 });
	}
}

export { AudioPlayer as default };
//# sourceMappingURL=bundle.js.map
