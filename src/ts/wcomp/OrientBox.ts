// @ts-ignore
import styles from "./OrientBox.scss?inline&compress";

// @ts-ignore
import html from "./OrientBox.html?raw";
import { cvt_cs_to_os } from "../_Utils";
import { getBoundingOrientRect, getZoom, zoomOf } from "../_Zoom.js";

//
const preInit = URL.createObjectURL(new Blob([styles], {type: "text/css"}));

//
export class UIOrientBox extends HTMLElement {
    static observedAttributes = ["orient", "zoom"];

    //
    #themeStyle?: HTMLStyleElement;
    #initialized: boolean = false;

    //
    get orient() { return parseInt(this.getAttribute("orient") || "0"); };
    set orient(ox) { this.setAttribute("orient", (ox || 0)?.toFixed?.(0) || (""+(ox || 0))); };

    //
    get zoom() { return parseFloat(this.getAttribute("zoom") || "1") || 1; };
    set zoom(ox) { this.setAttribute("zoom", (ox || 1)?.toFixed?.(0) || (""+(ox || 1))); };

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
        this.style.setProperty("--orient", this.getAttribute("orient"));
        this.style.setProperty("--zoom", this.getAttribute("zoom"));

        //
        const pointerMap   = new Map<number, any>();
        const pointerCache = new Map<number, any>();
        const pxy_event: [any, any] = [(ev)=>{
            const cache: any = pointerCache?.get?.(ev?.pointerId || 0) || {
                client: null,
                orient: null,
                boundingBox: null
            };

            //
            cache.orient = null;
            cache.client = null;

            //
            const pointer = pointerMap?.get?.(ev?.pointerId || 0) || {
                type: "ag-" + (ev?.type||"pointer"),
                event: ev,
                target: ev?.target || this,
                cs_box: size,
                pointerId: ev?.pointerId || 0,
                cap_element: null,

                //
                get client() {
                    const zoom = cache.client ? 1 : zoomOf(ev?.target || this);
                    return (cache.client ??= [(ev?.clientX || 0) / zoom, (ev?.clientY || 0) / zoom]);
                },
                get orient() { return (cache.orient ??= cvt_cs_to_os(pointer.client, size, this.orient)); },
                get boundingBox() { return (cache.boundingBox ??= getBoundingOrientRect(ev?.target || this)); },

                //
                capture(element = ev?.target || this) {
                    return (pointer.cap_element = element?.setPointerCapture?.(ev?.pointerId || 0));
                },
                release(element = null) {
                    (element || pointer.cap_element || ev?.target || this)?.releasePointerCapture?.(ev?.pointerId || 0);
                    pointer.cap_element = null;
                },
            };

            //
            if (!pointerMap?.has?.(ev?.pointerId || 0)) {
                pointerMap?.set?.(ev?.pointerId || 0, pointer);
                pointerCache?.set?.(ev?.pointerId || 0, cache);
            }

            //
            if (!(ev?.target || this)?.dispatchEvent?.(new CustomEvent("ag-" + (ev?.type||"pointer"), {
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
            }
        }, {passive: false, capture: true, once: false}];

        //
        const size: [number, number] = [this.clientWidth, this.clientHeight];
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry?.contentBoxSize) {
                    //const zoom = zoomOf(this);
                    const contentBoxSize = entry?.contentBoxSize?.[0];
                    size[0] = (contentBoxSize?.inlineSize || this.clientWidth);
                    size[1] = (contentBoxSize?.blockSize || this.clientHeight);
                }
            }
        });

        //
        resizeObserver.observe(this, {box: "content-box"});
        this.addEventListener("contextmenu", ...pxy_event);
        this.addEventListener("pointerover", ...pxy_event);
        this.addEventListener("pointerdown", ...pxy_event);
        this.addEventListener("pointermove", ...pxy_event);
        this.addEventListener("pointerenter", ...pxy_event);
        this.addEventListener("pointerleave", ...pxy_event);
        this.addEventListener("pointerout", ...pxy_event);
        this.addEventListener("click", ...pxy_event);
        this.addEventListener("pointerup", ...pxy_event);
        this.addEventListener("pointercancel", ...pxy_event);
    }

    //
    #initialize() {
        if (this.#initialized) return this;
        const shadowRoot = this.shadowRoot;
        this.#initialized = true;
        this.style.setProperty("--orient", this.getAttribute("orient"));
        this.style.setProperty("--zoom", this.getAttribute("zoom"));
        return this;
    }

    //
    connectedCallback() {
        this.#initialize();
    }

    //
    attributeChangedCallback(name, oldValue, newValue) {
        if (name == "orient") { this.style.setProperty("--orient", newValue); };
        if (name == "zoom") { this.style.setProperty("--zoom", newValue); };
    }
}

//
customElements.define("ui-orientbox", UIOrientBox);
export default UIOrientBox;
