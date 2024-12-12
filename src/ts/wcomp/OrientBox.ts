//
import {zoomOf} from "../_Zoom";

// @ts-ignore
import styles from "./OrientBox.scss?inline&compress";

// @ts-ignore
import html from "./OrientBox.html?raw";

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
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");

        // @ts-ignore
        const THEME_URL = "/externals/core/theme.js";
        import(/* @vite-ignore */ "" + `${THEME_URL}`).then((module)=>{
            // @ts-ignore
            this.#themeStyle = module?.default?.(this.shadowRoot);
            if (this.#themeStyle) { this.shadowRoot?.appendChild?.(this.#themeStyle); }
        }).catch(console.warn.bind(console));

        //
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
