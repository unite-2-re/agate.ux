// @ts-ignore
import styles from "./OrientBox.scss?inline&compress";

// @ts-ignore
import html from "./OrientBox.html?raw";
import { cvt_cs_to_os, cvt_rel_cs_to_os } from "../_Utils";
import { getBoundingOrientRect, getZoom, orientOf, zoomOf } from "../_Zoom.js";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));
const root = document.documentElement;

//
export class UIOrientBox extends HTMLElement {
    static observedAttributes = ["orient", "zoom"];

    //
    #themeStyle?: HTMLStyleElement;
    #initialized: boolean = false;

    //
    get orient() { return parseInt(this.getAttribute("orient") || "0") || 0; };
    set orient(nw) { if (this.getAttribute("orient") != (nw as unknown as string)) { this.setAttribute("orient", ((nw || 0) as unknown as string)); }; };

    //
    get zoom() { return parseFloat(this.getAttribute("zoom") || "1") || 1; };
    set zoom(nw) { if (this.getAttribute("zoom") != (nw as unknown as string)) { this.setAttribute("zoom", ((nw || 1) as unknown as string)); }; };

    //
    constructor() {
        super();
        const shadowRoot = this.attachShadow({mode: "open"});

        // @ts-ignore
        const THEME_URL = "/externals/core/theme.js";
        import(/* @vite-ignore */ "" + `${THEME_URL}`).then((module)=>{
            // @ts-ignore
            this.#themeStyle = module?.default?.(this.shadowRoot);
            if (this.#themeStyle) { this.shadowRoot?.appendChild?.(this.#themeStyle); }
        }).catch(console.warn.bind(console));

        //
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        dom.querySelector("template")?.content?.childNodes.forEach(cp => {
            shadowRoot.appendChild(cp.cloneNode(true));
        });

        //
        const style = document.createElement("style");
        style.innerHTML = `@import url("${preInit}");`;

        //
        shadowRoot.appendChild(style);
        this.style.setProperty("--orient", this.getAttribute("orient") || "0");
        this.style.setProperty("--zoom", this.getAttribute("zoom") || "1");

        //
        const self = this;
        const pointerMap   = new Map<number, any>();
        const pointerCache = new Map<number, any>();
        const pxy_event: [any, any] = [(ev)=>{
            const el = (ev?.target?.matches?.("ui-orientbox") ? ev.target : null) || ev?.target?.closest?.("ui-orientbox");
            if (el != self || !(el||self)?.contains?.(ev.target)) { return true; }; //

            //
            const zoom: number = zoomOf(ev?.target || el) || 1;
            const coord: [number, number] = [(ev?.clientX || 0) / zoom, (ev?.clientY || 0) / zoom];
            const cache: any = pointerCache?.get?.(ev?.pointerId || 0) || {
                client: coord,
                orient: null,
                boundingBox: null,
                movement: [0, 0]
            };

            //
            cache.delta = [cache.client[0], cache.client[1]];
            cache.orient = null;
            cache.client = coord;

            //
            const pointer = pointerMap?.get?.(ev?.pointerId || 0) || {
                type: "ag-" + (ev?.type||"pointer"),
                event: ev,
                target: ev?.target || el,
                cs_box: size,
                cap_element: null,
                pointerType: ev?.pointerType || "mouse",
                pointerId: ev?.pointerId || 0,

                //
                get client() { return cache.client; },
                get orient() { return cache.orient ??= cvt_cs_to_os([...pointer.client] as [number, number], size, orientOf(ev.target || el) || 0); },
                get movement() { return cvt_rel_cs_to_os([cache.client[0] - cache.delta[0], cache.client[1] - cache.delta[1]], orientOf(ev.target || el) || 0); },
                get boundingBox() { return (cache.boundingBox ??= getBoundingOrientRect(ev?.target || el, orientOf(ev.target || el) || 0)); },

                //
                capture(element = ev?.target || el) { return (pointer.cap_element = element?.setPointerCapture?.(ev?.pointerId || 0)); },
                release(element = null) {
                    (element || pointer.cap_element || ev?.target || el)?.releasePointerCapture?.(ev?.pointerId || 0);
                    pointer.cap_element = null;
                },
            };

            //
            Object.assign(pointer, {
                type: "ag-" + (ev?.type||"pointer"),
                event: ev,
                target: ev?.target || el,
                cs_box: size,
                pointerId: ev?.pointerId || 0
            });

            //
            if (!pointerMap?.has?.(ev?.pointerId || 0)) {
                pointerMap?.set?.(ev?.pointerId || 0, pointer);
                pointerCache?.set?.(ev?.pointerId || 0, cache);
            };

            //
            if (!(ev?.target || el)?.dispatchEvent?.(new CustomEvent("ag-" + (ev?.type||"pointer"), {
                bubbles: true,
                cancelable: true,
                detail: pointer
            }))) { ev?.preventDefault?.(); };

            //
            if (ev?.type == "contextmenu" || ev?.type == "click" || ev?.type == "pointerup" || ev?.type == "pointercancel") {
                pointerMap.delete(ev?.pointerId || 0);
                pointerCache.delete(ev?.pointerId || 0);
                if (ev?.type == "pointercancel") {
                    pointer?.release?.();
                }
            };
        }, {passive: false, capture: true, once: false}];

        //
        const size: [number, number] = [this.clientWidth, this.clientHeight];
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry?.contentBoxSize) {
                    const contentBoxSize = entry?.contentBoxSize?.[0];
                    size[0] = (contentBoxSize?.inlineSize || this.clientWidth);
                    size[1] = (contentBoxSize?.blockSize || this.clientHeight);
                }
            }
        });

        //
        resizeObserver.observe(this, {box: "content-box"});
        root.addEventListener("contextmenu", ...pxy_event);
        root.addEventListener("pointerover", ...pxy_event);
        root.addEventListener("pointerdown", ...pxy_event);
        root.addEventListener("pointermove", ...pxy_event);
        root.addEventListener("pointerenter", ...pxy_event);
        root.addEventListener("pointerleave", ...pxy_event);
        root.addEventListener("pointerout", ...pxy_event);
        root.addEventListener("click", ...pxy_event);
        root.addEventListener("pointerup", ...pxy_event);
        root.addEventListener("pointercancel", ...pxy_event);
    }

    //
    #initialize() {
        if (this.#initialized) return this;
        const shadowRoot = this.shadowRoot;
        this.#initialized = true;
        this.style.setProperty("--orient", this.getAttribute("orient") || "0");
        this.style.setProperty("--zoom", this.getAttribute("zoom") || "1");
        return this;
    }

    //
    connectedCallback() {
        this.#initialize();
    }

    //
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "orient" && oldValue != newValue) { this.style.setProperty("--orient", newValue); };
        if (name == "zoom" && oldValue != newValue) { this.style.setProperty("--zoom", newValue); };
    }
}

//
customElements.define("ui-orientbox", UIOrientBox);
export default UIOrientBox;
