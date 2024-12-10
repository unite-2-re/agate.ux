//
export const isMobile = ()=>{
    const f1 = matchMedia("(hover: none) and (pointer: coarse) and (display-mode: fullscreen)").matches;
    const f2 = 'ontouchstart' in window || 'onmsgesturechange' in window;
    return f1 && f2;
}
