var app = (function () {
    'use strict';

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
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        text.data = data;
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

    /* src/components/AudioPlayer.svelte generated by Svelte v3.59.2 */

    function create_if_block_1(ctx) {
    	let path;

    	return {
    		c() {
    			path = svg_element("path");
    			attr(path, "d", paths.pauseRight);
    			attr(path, "class", "svelte-p8eto0");
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

    // (228:12) {#if !isMuted && volume != 0}
    function create_if_block(ctx) {
    	let path;

    	return {
    		c() {
    			path = svg_element("path");
    			attr(path, "d", paths.volumeRightLine);
    			attr(path, "class", "svelte-p8eto0");
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
    	let div8;
    	let div0;
    	let button0;
    	let svg0;
    	let path0;
    	let path1;
    	let t0;
    	let button1;
    	let svg1;
    	let path2;
    	let path2_d_value;
    	let t1;
    	let button2;
    	let svg2;
    	let path3;
    	let path4;
    	let t2;
    	let button3;
    	let svg3;
    	let path5;
    	let button3_class_value;
    	let t3;
    	let button4;
    	let svg4;
    	let path6;
    	let path7;
    	let button4_class_value;
    	let t4;
    	let div7;
    	let div1;
    	let strong;
    	let t5_value = /*currentTrackIndex*/ ctx[8] + 1 + "";
    	let t5;
    	let t6;
    	let t7_value = /*tracks*/ ctx[0].length + "";
    	let t7;
    	let t8;
    	let t9;
    	let marquee;
    	let t10_value = /*tracks*/ ctx[0][/*currentTrackIndex*/ ctx[8]].title + "";
    	let t10;
    	let t11;
    	let div6;
    	let div4;
    	let div2;
    	let span0;
    	let t12_value = /*formatTime*/ ctx[17](/*currentTime*/ ctx[5]) + "";
    	let t12;
    	let t13;
    	let input0;
    	let t14;
    	let div3;
    	let span1;
    	let t15_value = /*formatTime*/ ctx[17](/*duration*/ ctx[6]) + "";
    	let t15;
    	let t16;
    	let div5;
    	let button5;
    	let svg5;
    	let path8;
    	let path8_d_value;
    	let path9;
    	let path9_d_value;
    	let t17;
    	let input1;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isPlaying*/ ctx[1] && create_if_block_1();
    	let if_block1 = !/*isMuted*/ ctx[2] && /*volume*/ ctx[7] != 0 && create_if_block();

    	return {
    		c() {
    			div8 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t0 = space();
    			button1 = element("button");
    			svg1 = svg_element("svg");
    			path2 = svg_element("path");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			button2 = element("button");
    			svg2 = svg_element("svg");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			t2 = space();
    			button3 = element("button");
    			svg3 = svg_element("svg");
    			path5 = svg_element("path");
    			t3 = space();
    			button4 = element("button");
    			svg4 = svg_element("svg");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			t4 = space();
    			div7 = element("div");
    			div1 = element("div");
    			strong = element("strong");
    			t5 = text(t5_value);
    			t6 = text(" [");
    			t7 = text(t7_value);
    			t8 = text("]");
    			t9 = space();
    			marquee = element("marquee");
    			t10 = text(t10_value);
    			t11 = space();
    			div6 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			span0 = element("span");
    			t12 = text(t12_value);
    			t13 = space();
    			input0 = element("input");
    			t14 = space();
    			div3 = element("div");
    			span1 = element("span");
    			t15 = text(t15_value);
    			t16 = space();
    			div5 = element("div");
    			button5 = element("button");
    			svg5 = svg_element("svg");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			if (if_block1) if_block1.c();
    			t17 = space();
    			input1 = element("input");
    			attr(path0, "d", paths.previousLeft);
    			attr(path0, "class", "svelte-p8eto0");
    			attr(path1, "d", paths.previousRight);
    			attr(path1, "class", "svelte-p8eto0");
    			attr(svg0, "xmlns", XMLNS);
    			attr(svg0, "viewBox", viewBox);
    			attr(button0, "class", "svelte-p8eto0");
    			attr(path2, "d", path2_d_value = /*isPlaying*/ ctx[1] ? paths.pauseLeft : paths.play);
    			attr(path2, "class", "svelte-p8eto0");
    			attr(svg1, "xmlns", XMLNS);
    			attr(svg1, "viewBox", viewBox);
    			attr(button1, "class", "svelte-p8eto0");
    			attr(path3, "d", paths.nextLeft);
    			attr(path3, "class", "svelte-p8eto0");
    			attr(path4, "d", paths.nextRight);
    			attr(path4, "class", "svelte-p8eto0");
    			attr(svg2, "xmlns", XMLNS);
    			attr(svg2, "viewBox", viewBox);
    			attr(button2, "class", "svelte-p8eto0");
    			attr(path5, "d", paths.shuffle);
    			attr(path5, "class", "svelte-p8eto0");
    			attr(svg3, "xmlns", XMLNS);
    			attr(svg3, "viewBox", viewBox);
    			attr(button3, "class", button3_class_value = "" + (null_to_empty(/*shuffle*/ ctx[3] ? '' : 'shuffle') + " svelte-p8eto0"));
    			attr(path6, "d", paths.repeatLeft);
    			attr(path6, "class", "svelte-p8eto0");
    			attr(path7, "d", paths.repeatRight);
    			attr(path7, "class", "svelte-p8eto0");
    			attr(svg4, "xmlns", XMLNS);
    			attr(svg4, "viewBox", viewBox);
    			attr(button4, "class", button4_class_value = "" + (null_to_empty(/*repeat*/ ctx[4] ? '' : 'repeat') + " svelte-p8eto0"));
    			attr(div0, "class", "buttons-control svelte-p8eto0");
    			attr(strong, "class", "svelte-p8eto0");
    			attr(marquee, "behavior", "scroll");
    			attr(marquee, "direction", "left");
    			attr(marquee, "scrollamount", "2");
    			attr(marquee, "class", "svelte-p8eto0");
    			attr(div1, "class", "track-name svelte-p8eto0");
    			attr(div2, "class", "current-time svelte-p8eto0");
    			attr(input0, "type", "range");
    			attr(input0, "min", MIN_DURATION);
    			attr(input0, "max", /*duration*/ ctx[6]);
    			attr(input0, "step", STEP_DURATION);
    			input0.value = /*currentTime*/ ctx[5];
    			attr(div3, "class", "duration-time svelte-p8eto0");
    			attr(div4, "class", "progress-control svelte-p8eto0");

    			attr(path8, "d", path8_d_value = /*isMuted*/ ctx[2] || /*volume*/ ctx[7] == 0
    			? paths.muteSpeaker
    			: paths.volumeSpeaker);

    			attr(path8, "class", "svelte-p8eto0");

    			attr(path9, "d", path9_d_value = /*isMuted*/ ctx[2] || /*volume*/ ctx[7] == 0
    			? paths.muteClose
    			: paths.volumeLeftLine);

    			attr(path9, "class", "svelte-p8eto0");
    			attr(svg5, "xmlns", XMLNS);
    			attr(svg5, "viewBox", viewBox);
    			attr(button5, "class", "svelte-p8eto0");
    			attr(input1, "type", "range");
    			attr(input1, "min", "0");
    			attr(input1, "max", "1");
    			attr(input1, "step", "0.01");
    			input1.value = /*volume*/ ctx[7];
    			attr(input1, "class", "svelte-p8eto0");
    			attr(div5, "class", "volume-control svelte-p8eto0");
    			attr(div6, "class", "track-ranges svelte-p8eto0");
    			attr(div7, "class", "track-info svelte-p8eto0");
    			attr(div8, "class", "audio-player svelte-p8eto0");
    		},
    		m(target, anchor) {
    			insert(target, div8, anchor);
    			append(div8, div0);
    			append(div0, button0);
    			append(button0, svg0);
    			append(svg0, path0);
    			append(svg0, path1);
    			append(div0, t0);
    			append(div0, button1);
    			append(button1, svg1);
    			append(svg1, path2);
    			if (if_block0) if_block0.m(svg1, null);
    			append(div0, t1);
    			append(div0, button2);
    			append(button2, svg2);
    			append(svg2, path3);
    			append(svg2, path4);
    			append(div0, t2);
    			append(div0, button3);
    			append(button3, svg3);
    			append(svg3, path5);
    			append(div0, t3);
    			append(div0, button4);
    			append(button4, svg4);
    			append(svg4, path6);
    			append(svg4, path7);
    			append(div8, t4);
    			append(div8, div7);
    			append(div7, div1);
    			append(div1, strong);
    			append(strong, t5);
    			append(strong, t6);
    			append(strong, t7);
    			append(strong, t8);
    			append(div1, t9);
    			append(div1, marquee);
    			append(marquee, t10);
    			append(div7, t11);
    			append(div7, div6);
    			append(div6, div4);
    			append(div4, div2);
    			append(div2, span0);
    			append(span0, t12);
    			append(div4, t13);
    			append(div4, input0);
    			append(div4, t14);
    			append(div4, div3);
    			append(div3, span1);
    			append(span1, t15);
    			append(div6, t16);
    			append(div6, div5);
    			append(div5, button5);
    			append(button5, svg5);
    			append(svg5, path8);
    			append(svg5, path9);
    			if (if_block1) if_block1.m(svg5, null);
    			append(div5, t17);
    			append(div5, input1);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*prevTrack*/ ctx[14]),
    					listen(button1, "click", /*playPause*/ ctx[9]),
    					listen(button2, "click", /*nextTrack*/ ctx[13]),
    					listen(button3, "click", /*toggleShuffle*/ ctx[15]),
    					listen(button4, "click", /*toggleRepeat*/ ctx[16]),
    					listen(input0, "input", /*changeDuration*/ ctx[10]),
    					listen(button5, "click", /*toggleMute*/ ctx[12]),
    					listen(input1, "input", /*changeVolume*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*isPlaying*/ 2 && path2_d_value !== (path2_d_value = /*isPlaying*/ ctx[1] ? paths.pauseLeft : paths.play)) {
    				attr(path2, "d", path2_d_value);
    			}

    			if (/*isPlaying*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1();
    					if_block0.c();
    					if_block0.m(svg1, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*shuffle*/ 8 && button3_class_value !== (button3_class_value = "" + (null_to_empty(/*shuffle*/ ctx[3] ? '' : 'shuffle') + " svelte-p8eto0"))) {
    				attr(button3, "class", button3_class_value);
    			}

    			if (dirty & /*repeat*/ 16 && button4_class_value !== (button4_class_value = "" + (null_to_empty(/*repeat*/ ctx[4] ? '' : 'repeat') + " svelte-p8eto0"))) {
    				attr(button4, "class", button4_class_value);
    			}

    			if (dirty & /*currentTrackIndex*/ 256 && t5_value !== (t5_value = /*currentTrackIndex*/ ctx[8] + 1 + "")) set_data(t5, t5_value);
    			if (dirty & /*tracks*/ 1 && t7_value !== (t7_value = /*tracks*/ ctx[0].length + "")) set_data(t7, t7_value);
    			if (dirty & /*tracks, currentTrackIndex*/ 257 && t10_value !== (t10_value = /*tracks*/ ctx[0][/*currentTrackIndex*/ ctx[8]].title + "")) set_data(t10, t10_value);
    			if (dirty & /*currentTime*/ 32 && t12_value !== (t12_value = /*formatTime*/ ctx[17](/*currentTime*/ ctx[5]) + "")) set_data(t12, t12_value);

    			if (dirty & /*duration*/ 64) {
    				attr(input0, "max", /*duration*/ ctx[6]);
    			}

    			if (dirty & /*currentTime*/ 32) {
    				input0.value = /*currentTime*/ ctx[5];
    			}

    			if (dirty & /*duration*/ 64 && t15_value !== (t15_value = /*formatTime*/ ctx[17](/*duration*/ ctx[6]) + "")) set_data(t15, t15_value);

    			if (dirty & /*isMuted, volume*/ 132 && path8_d_value !== (path8_d_value = /*isMuted*/ ctx[2] || /*volume*/ ctx[7] == 0
    			? paths.muteSpeaker
    			: paths.volumeSpeaker)) {
    				attr(path8, "d", path8_d_value);
    			}

    			if (dirty & /*isMuted, volume*/ 132 && path9_d_value !== (path9_d_value = /*isMuted*/ ctx[2] || /*volume*/ ctx[7] == 0
    			? paths.muteClose
    			: paths.volumeLeftLine)) {
    				attr(path9, "d", path9_d_value);
    			}

    			if (!/*isMuted*/ ctx[2] && /*volume*/ ctx[7] != 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block();
    					if_block1.c();
    					if_block1.m(svg5, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*volume*/ 128) {
    				input1.value = /*volume*/ ctx[7];
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div8);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    const MIN_DURATION = 0;
    const STEP_DURATION = 0.01;
    const XMLNS = 'http://www.w3.org/2000/svg';
    const viewBox = '0 0 32 32';

    function instance$1($$self, $$props, $$invalidate) {
    	let { tracks = [] } = $$props;
    	let audio;
    	let isPlaying = false;
    	let isMuted = false;
    	let shuffle = false;
    	let repeat = false;
    	let currentTime = 0;
    	let duration = 0;
    	let volume = 1;
    	let currentTrackIndex = 0;
    	let cachedVolume = volume;

    	onMount(() => {
    		if (tracks.length > 0) {
    			audio = new Audio(tracks[currentTrackIndex].src);
    			audio.volume = volume;
    			audio.addEventListener('timeupdate', updateTime);
    			audio.addEventListener('loadedmetadata', updateDuration);
    			audio.addEventListener('ended', handleTrackEnd);
    		}
    	});

    	const playPause = () => {
    		if (isPlaying) {
    			audio.pause();
    		} else {
    			audio.play();
    		}

    		$$invalidate(1, isPlaying = !isPlaying);
    	};

    	const updateTime = () => {
    		$$invalidate(5, currentTime = audio.currentTime);
    	};

    	const updateDuration = () => {
    		$$invalidate(6, duration = audio.duration);
    	};

    	const changeDuration = event => {
    		audio.currentTime = event.target.value;
    		$$invalidate(5, currentTime = audio.currentTime);
    	};

    	const changeVolume = event => {
    		$$invalidate(7, volume = parseFloat(event.target.value));
    		audio.volume = volume;
    		$$invalidate(2, isMuted = volume === 0);
    	};

    	const toggleMute = () => {
    		$$invalidate(2, isMuted = !isMuted);

    		if (isMuted) {
    			cachedVolume = volume;
    			$$invalidate(7, volume = 0);
    		} else {
    			$$invalidate(7, volume = cachedVolume);
    		}

    		audio.muted = isMuted;
    		audio.volume = volume;
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
    		$$invalidate(1, isPlaying = true);
    	};

    	const prevTrack = () => {
    		$$invalidate(8, currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length);
    		audio.src = tracks[currentTrackIndex].src;
    		audio.play();
    		$$invalidate(1, isPlaying = true);
    	};

    	const toggleShuffle = () => {
    		$$invalidate(3, shuffle = !shuffle);
    	};

    	const toggleRepeat = () => {
    		$$invalidate(4, repeat = !repeat);
    	};

    	const formatTime = seconds => {
    		const minutes = Math.floor(seconds / 60);
    		const secs = Math.floor(seconds % 60);
    		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    	};

    	$$self.$$set = $$props => {
    		if ('tracks' in $$props) $$invalidate(0, tracks = $$props.tracks);
    	};

    	return [
    		tracks,
    		isPlaying,
    		isMuted,
    		shuffle,
    		repeat,
    		currentTime,
    		duration,
    		volume,
    		currentTrackIndex,
    		playPause,
    		changeDuration,
    		changeVolume,
    		toggleMute,
    		nextTrack,
    		prevTrack,
    		toggleShuffle,
    		toggleRepeat,
    		formatTime
    	];
    }

    class AudioPlayer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { tracks: 0 });
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    function create_fragment(ctx) {
    	let audioplayer;
    	let current;
    	audioplayer = new AudioPlayer({ props: { tracks: /*tracks*/ ctx[0] } });

    	return {
    		c() {
    			create_component(audioplayer.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(audioplayer, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const audioplayer_changes = {};
    			if (dirty & /*tracks*/ 1) audioplayer_changes.tracks = /*tracks*/ ctx[0];
    			audioplayer.$set(audioplayer_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(audioplayer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(audioplayer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(audioplayer, detaching);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let { tracks = [] } = $$props;

    	$$self.$$set = $$props => {
    		if ('tracks' in $$props) $$invalidate(0, tracks = $$props.tracks);
    	};

    	return [tracks];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, { tracks: 0 });
    	}
    }

    const app = new App({
      target: document.getElementById('app'),
      props: {
        tracks: [
          { src: 'tracks/01. NWO.mp3', title: '01. NWO' },
          { src: 'tracks/02. Just One Fix.mp3', title: '02. Just One Fix' },
          {
            src: 'tracks/01. Antonyo feat. Bradley - Supernatural Lover (Original Mix).mp3',
            title: '01. Antonyo feat. Bradley - Supernatural Lover (Original Mix)',
          },
          {
            src: 'tracks/02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal).mp3',
            title: '02. Mark Picchiotti, Kenyata - Rumors (Mark Picchiotti Vocal)',
          },
        ],
      },
    });

    return app;

})();
