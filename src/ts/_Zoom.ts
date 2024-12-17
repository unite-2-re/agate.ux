//import { getBoundingOrientRect } from "./Zoom";
import { cvt_cs_to_os } from "./_Utils";

//
export const getZoom = ()=>{
    const zoomSupport = "currentCSSZoom" in document.documentElement;
    // @ts-ignore
    if (zoomSupport) { return ((document.documentElement.currentCSSZoom as number) || 1); }
    return parseFloat(document.documentElement.style.getPropertyValue("--scaling") || "1") || 1;
}

//
let zoomValue = getZoom() || 1;
document.documentElement.addEventListener("scaling", ()=>{ zoomValue = getZoom() || 1; });
document.documentElement.addEventListener("resize", ()=>{ zoomValue = getZoom() || 1; });
if (!document.documentElement.classList.contains("__exp-use-zoom")) {
    document.documentElement.classList.add("__exp-use-zoom");
}
addEventListener("resize", ()=>{ zoomValue = getZoom() || 1; });

//
export const zoomOf = (element = document.documentElement) => {
    // legacy element
    if (element == document.documentElement) { return zoomValue || 1; };

    // getting zoom performance broken...
    const container: any = ((element?.matches?.("ui-orientbox") ? element : null) || element?.closest?.("ui-orientbox") || document.body) as HTMLElement;
    return container?.zoom || 1;

    //
    if (element?.currentCSSZoom) {
        return element?.currentCSSZoom || 1;
    }
}

//
export const changeZoom = (scale = 1) => {
    document.documentElement.style.setProperty("--scaling", scale as unknown as string);
    document.documentElement.dispatchEvent(new CustomEvent("scaling", {
        detail: {zoom: scale},
        bubbles: true,
        cancelable: true
    }));
    return scale;
}

//
export const fixedClientZoom = (element = document.documentElement)=>{
    return ((element?.currentCSSZoom != null ? 1 : zoomOf(element))) || 1;
}

//
export const unfixedClientZoom = (element = document.documentElement)=>{
    return ((element?.currentCSSZoom == null ? 1 : element?.currentCSSZoom)) || 1;
}

//
export const orientOf = (element = document.documentElement) => {
    // legacy browser
    const container: any = ((element?.matches?.("ui-orientbox") ? element : null) || element?.closest?.("ui-orientbox") || element);
    return container?.orient || 0;
    //if (container?.orient != null) return container?.orient;
    //const computed = element ? getComputedStyle(element) : null;
    //return parseFloat(computed?.getPropertyValue("--orient") || "0") || 0;
}

//
export const getBoundingOrientRect = (element, orient: number|null|undefined = null)=>{
    const zoom = unfixedClientZoom(element) || 1;
    const box = element?.getBoundingClientRect?.();
    const nbx = {
        left: box?.left / zoom,
        right: box?.right / zoom,
        top: box?.top / zoom,
        bottom: box?.bottom / zoom,
        width: box?.width / zoom,
        height: box?.height / zoom,
    };

    //
    const or_i: number = orient || orientOf(element) || 0;
    const size: [number, number] = [document.body.clientWidth / zoom, document.body.clientHeight / zoom];
    const [left_, top_] = cvt_cs_to_os([nbx.left, nbx.top], size, or_i);
    const [right_, bottom_] = cvt_cs_to_os([nbx.right, nbx.bottom], size, or_i);

    //
    const [left, right] = (or_i==0 || or_i==3) ? [left_, right_] : [right_, left_];
    const [top, bottom] = (or_i==0 || or_i==1) ? [top_, bottom_] : [bottom_, top_];

    //
    const [width, height] = (or_i%2) ? [nbx.height, nbx.width] : [nbx.width, nbx.height];
    return { left, top, right, bottom, width, height };
}
