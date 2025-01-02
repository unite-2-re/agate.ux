import { isMobile } from "../_Detect";

//
export const getAvailSize = ()=>{
    const mob = isMobile();
    const l = matchMedia("(orientation: landscape)")?.matches;
    const w = ((mob ? screen.availWidth : Math.max(window.innerWidth, screen.availWidth)) || 0) + "px";
    const h = ((mob ? screen.availHeight : Math.max(window.innerHeight, screen.availHeight)) || 0) + "px";
    return {
        "--avail-width": l ? h : w,
        "--avail-height": l ? w : h,
        "--pixel-ratio": devicePixelRatio || 1,
    };
}

//
export const availSize = getAvailSize();
export const updateVP = (ev?: any)=>{
    const rule = document.documentElement;
    Object.assign(availSize, getAvailSize());
    Object.entries(availSize).forEach(([propName, propValue]) => {
        const exists = rule?.style?.getPropertyValue(propName);
        if (!exists || exists != propValue) {
            rule?.style?.setProperty?.(propName, (propValue || "") as string, "");
        }
    });
}
