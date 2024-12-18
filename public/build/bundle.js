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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
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

    /* src/components/AudioPlayer.svelte generated by Svelte v3.59.2 */

    function create_fragment$1(ctx) {
    	let div5;
    	let div1;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let img1_alt_value;
    	let t1;
    	let button2;
    	let img2;
    	let img2_src_value;
    	let t2;
    	let button3;
    	let img3;
    	let img3_src_value;
    	let t3;
    	let button4;
    	let img4;
    	let img4_src_value;
    	let t4;
    	let div0;
    	let button5;
    	let img5;
    	let img5_src_value;
    	let img5_alt_value;
    	let t5;
    	let input;
    	let t6;
    	let div3;
    	let div2;
    	let t7;
    	let div4;
    	let span0;
    	let t8_value = /*formatTime*/ ctx[13](/*currentTime*/ ctx[0]) + "";
    	let t8;
    	let t9;
    	let span1;
    	let t10_value = /*formatTime*/ ctx[13](/*duration*/ ctx[1]) + "";
    	let t10;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			div5 = element("div");
    			div1 = element("div");
    			button0 = element("button");
    			img0 = element("img");
    			t0 = space();
    			button1 = element("button");
    			img1 = element("img");
    			t1 = space();
    			button2 = element("button");
    			img2 = element("img");
    			t2 = space();
    			button3 = element("button");
    			img3 = element("img");
    			t3 = space();
    			button4 = element("button");
    			img4 = element("img");
    			t4 = space();
    			div0 = element("div");
    			button5 = element("button");
    			img5 = element("img");
    			t5 = space();
    			input = element("input");
    			t6 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t7 = space();
    			div4 = element("div");
    			span0 = element("span");
    			t8 = text(t8_value);
    			t9 = space();
    			span1 = element("span");
    			t10 = text(t10_value);
    			if (!src_url_equal(img0.src, img0_src_value = /*icons*/ ctx[5].previous)) attr(img0, "src", img0_src_value);
    			attr(img0, "alt", "Previous");

    			if (!src_url_equal(img1.src, img1_src_value = /*isPlaying*/ ctx[2]
    			? /*icons*/ ctx[5].pause
    			: /*icons*/ ctx[5].play)) attr(img1, "src", img1_src_value);

    			attr(img1, "alt", img1_alt_value = /*isPlaying*/ ctx[2] ? 'Play' : 'Pause');
    			if (!src_url_equal(img2.src, img2_src_value = /*icons*/ ctx[5].next)) attr(img2, "src", img2_src_value);
    			attr(img2, "alt", "Next");
    			if (!src_url_equal(img3.src, img3_src_value = /*icons*/ ctx[5].shuffle)) attr(img3, "src", img3_src_value);
    			attr(img3, "alt", "Shuffle");
    			if (!src_url_equal(img4.src, img4_src_value = /*icons*/ ctx[5].repeat)) attr(img4, "src", img4_src_value);
    			attr(img4, "alt", "Repeat");

    			if (!src_url_equal(img5.src, img5_src_value = /*isMuted*/ ctx[4]
    			? /*icons*/ ctx[5].mute
    			: /*icons*/ ctx[5].volume)) attr(img5, "src", img5_src_value);

    			attr(img5, "alt", img5_alt_value = /*isMuted*/ ctx[4] ? 'Mute' : 'Volume');
    			attr(input, "type", "range");
    			attr(input, "min", "0");
    			attr(input, "max", "1");
    			attr(input, "step", "0.01");
    			input.value = /*volume*/ ctx[3];
    			attr(input, "class", "svelte-1401xv4");
    			attr(div0, "class", "volume-control svelte-1401xv4");
    			attr(div1, "class", "controls svelte-1401xv4");
    			attr(div2, "class", "progress-bar svelte-1401xv4");
    			set_style(div2, "width", /*currentTime*/ ctx[0] / /*duration*/ ctx[1] * 100 + "%");
    			attr(div3, "class", "progress svelte-1401xv4");
    			attr(div4, "class", "time svelte-1401xv4");
    			attr(div5, "class", "audio-player svelte-1401xv4");
    		},
    		m(target, anchor) {
    			insert(target, div5, anchor);
    			append(div5, div1);
    			append(div1, button0);
    			append(button0, img0);
    			append(div1, t0);
    			append(div1, button1);
    			append(button1, img1);
    			append(div1, t1);
    			append(div1, button2);
    			append(button2, img2);
    			append(div1, t2);
    			append(div1, button3);
    			append(button3, img3);
    			append(div1, t3);
    			append(div1, button4);
    			append(button4, img4);
    			append(div1, t4);
    			append(div1, div0);
    			append(div0, button5);
    			append(button5, img5);
    			append(div0, t5);
    			append(div0, input);
    			append(div5, t6);
    			append(div5, div3);
    			append(div3, div2);
    			append(div5, t7);
    			append(div5, div4);
    			append(div4, span0);
    			append(span0, t8);
    			append(div4, t9);
    			append(div4, span1);
    			append(span1, t10);

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*prevTrack*/ ctx[10]),
    					listen(button1, "click", /*playPause*/ ctx[6]),
    					listen(button2, "click", /*nextTrack*/ ctx[9]),
    					listen(button3, "click", /*toggleShuffle*/ ctx[11]),
    					listen(button4, "click", /*toggleRepeat*/ ctx[12]),
    					listen(button5, "click", /*toggleMute*/ ctx[8]),
    					listen(input, "input", /*changeVolume*/ ctx[7])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*isPlaying*/ 4 && !src_url_equal(img1.src, img1_src_value = /*isPlaying*/ ctx[2]
    			? /*icons*/ ctx[5].pause
    			: /*icons*/ ctx[5].play)) {
    				attr(img1, "src", img1_src_value);
    			}

    			if (dirty & /*isPlaying*/ 4 && img1_alt_value !== (img1_alt_value = /*isPlaying*/ ctx[2] ? 'Play' : 'Pause')) {
    				attr(img1, "alt", img1_alt_value);
    			}

    			if (dirty & /*isMuted*/ 16 && !src_url_equal(img5.src, img5_src_value = /*isMuted*/ ctx[4]
    			? /*icons*/ ctx[5].mute
    			: /*icons*/ ctx[5].volume)) {
    				attr(img5, "src", img5_src_value);
    			}

    			if (dirty & /*isMuted*/ 16 && img5_alt_value !== (img5_alt_value = /*isMuted*/ ctx[4] ? 'Mute' : 'Volume')) {
    				attr(img5, "alt", img5_alt_value);
    			}

    			if (dirty & /*volume*/ 8) {
    				input.value = /*volume*/ ctx[3];
    			}

    			if (dirty & /*currentTime, duration*/ 3) {
    				set_style(div2, "width", /*currentTime*/ ctx[0] / /*duration*/ ctx[1] * 100 + "%");
    			}

    			if (dirty & /*currentTime*/ 1 && t8_value !== (t8_value = /*formatTime*/ ctx[13](/*currentTime*/ ctx[0]) + "")) set_data(t8, t8_value);
    			if (dirty & /*duration*/ 2 && t10_value !== (t10_value = /*formatTime*/ ctx[13](/*duration*/ ctx[1]) + "")) set_data(t10, t10_value);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance($$self, $$props, $$invalidate) {
    	let audio;
    	let isPlaying = false;
    	let { currentTime = 0 } = $$props;
    	let { duration = 0 } = $$props;
    	let volume = 1;
    	let isMuted = false;

    	const icons = {
    		play: 'icons/play.svg',
    		pause: 'icons/pause.svg',
    		next: 'icons/next.svg',
    		previous: 'icons/previous.svg',
    		shuffle: 'icons/shuffle.svg',
    		repeat: 'icons/repeat.svg',
    		volume: 'icons/volume.svg',
    		mute: 'icons/mute.svg'
    	};

    	const tracks = [
    		{
    			src: 'tracks/01. NWO.mp3',
    			title: '01. NWO'
    		},
    		{
    			src: 'tracks/02. Just One Fix.mp3',
    			title: '02. Just One Fix'
    		}
    	]; // Add more tracks here

    	let currentTrackIndex = 0;

    	onMount(() => {
    		audio = new Audio(tracks[currentTrackIndex].src);
    		audio.addEventListener('timeupdate', updateTime);
    		audio.addEventListener('loadedmetadata', updateDuration);
    		audio.addEventListener('ended', nextTrack);
    	});

    	const playPause = () => {
    		if (isPlaying) {
    			audio.pause();
    		} else {
    			audio.play();
    		}

    		$$invalidate(2, isPlaying = !isPlaying);
    	};

    	const updateTime = () => {
    		$$invalidate(0, currentTime = audio.currentTime);
    	};

    	const updateDuration = () => {
    		$$invalidate(1, duration = audio.duration);
    	};

    	const changeVolume = event => {
    		$$invalidate(3, volume = event.target.value);
    		audio.volume = volume;
    	};

    	const toggleMute = () => {
    		$$invalidate(4, isMuted = !isMuted);
    		audio.muted = isMuted;
    	};

    	const nextTrack = () => {
    		currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    		audio.src = tracks[currentTrackIndex].src;
    		audio.play();
    		$$invalidate(2, isPlaying = true);
    	};

    	const prevTrack = () => {
    		currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    		audio.src = tracks[currentTrackIndex].src;
    		audio.play();
    		$$invalidate(2, isPlaying = true);
    	};

    	const toggleShuffle = () => {
    	};

    	const toggleRepeat = () => {
    	};

    	const formatTime = seconds => {
    		const minutes = Math.floor(seconds / 60);
    		const secs = Math.floor(seconds % 60);
    		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    	};

    	$$self.$$set = $$props => {
    		if ('currentTime' in $$props) $$invalidate(0, currentTime = $$props.currentTime);
    		if ('duration' in $$props) $$invalidate(1, duration = $$props.duration);
    	};

    	return [
    		currentTime,
    		duration,
    		isPlaying,
    		volume,
    		isMuted,
    		icons,
    		playPause,
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
    		init(this, options, instance, create_fragment$1, safe_not_equal, { currentTime: 0, duration: 1 });
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    function create_fragment(ctx) {
    	let audioplayer;
    	let current;
    	audioplayer = new AudioPlayer({});

    	return {
    		c() {
    			create_component(audioplayer.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(audioplayer, target, anchor);
    			current = true;
    		},
    		p: noop,
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

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, null, create_fragment, safe_not_equal, {});
    	}
    }

    const app = new App({
      target: document.getElementById('app'),
    });

    return app;

})();
