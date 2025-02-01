import initialize, {agWrapEvent} from "../dist/agate.js";

//
initialize();

//
const element = document.querySelector(".r1");
const cx = document.querySelector(".coordinate .x");
const cy = document.querySelector(".coordinate .y");

// @ts-ignore
document.documentElement?.addEventListener("pointermove", agWrapEvent((ev: any)=>{
    if (element) {
        const coord: [number, number] = ev.detail.orient;//convertPointFromPageToNode(element, ev.pageX, ev.pageY);
        if (cx) { cx.innerHTML = `X: ${coord[0].toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}`; }
        if (cy) { cy.innerHTML = `Y: ${coord[1].toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2})}`; }
    }
}));
