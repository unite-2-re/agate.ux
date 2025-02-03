import { isMobile, detectMobile } from "../_Detect";

//
export const getAvailSize = () => {
    const l = matchMedia("(orientation: landscape)")?.matches;
    const w = screen.width  + "px";//((mob ? screen.width  : Math.max(window.innerWidth , screen.availWidth )) || 0) + "px";
    const h = screen.height + "px";//((mob ? screen.height : Math.max(window.innerHeight, screen.availHeight)) || 0) + "px";
    const aw = screen.availWidth  + "px";//((mob ? screen.width  : Math.max(window.innerWidth , screen.availWidth )) || 0) + "px";
    const ah = screen.availHeight + "px";//((mob ? screen.height : Math.max(window.innerHeight, screen.availHeight)) || 0) + "px";
    return {
        "--screen-width" : l ? h : w,
        "--screen-height": l ? w : h,
        "--avail-width" : l ? ah : aw,
        "--avail-height": l ? aw : ah,
        "--view-height": (Math.min(screen.availHeight, window.innerHeight) + "px"),
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

    // make secondary screen orientation detectable
    document.documentElement.style.setProperty("--secondary", screen?.orientation?.type?.endsWith?.("secondary") ? "1" : "0");
}
