import { isMobile, detectMobile } from "../_Detect";

//
export const getAvailSize = ()=>{
    const l = matchMedia("(orientation: landscape)")?.matches;
    const w = Math.min(screen.width , screen.availWidth)  + "px";//((mob ? screen.width  : Math.max(window.innerWidth , screen.availWidth )) || 0) + "px";
    const h = Math.min(screen.height, screen.availHeight) + "px";//((mob ? screen.height : Math.max(window.innerHeight, screen.availHeight)) || 0) + "px";
    return {
        "--avail-width" : l ? h : w,
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
