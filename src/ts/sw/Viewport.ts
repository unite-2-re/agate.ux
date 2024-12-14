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

//
export const viewportHandler = (event?: any) => {
    //const layoutViewport = document.body;
    //const viewport = event?.target || visualViewport;
    updateVP(event);

    /*
    //
    document.documentElement.style.setProperty(
        "--visual-width",
        (viewport?.width || 1) + "px",
        ""
    );

    //
    const vvh = viewport?.height || 1;
    const dff = vvh - (layoutViewport.getBoundingClientRect().height || window.innerHeight || 1);
    const cvh = Math.min(Math.max(vvh - dff, viewport?.offsetTop || 0) - (viewport?.offsetTop || 0), (screen.availHeight || screen.height || 1));
    document.documentElement.style.setProperty(
        "--visual-height",
        cvh + "px",
        ""
    );*/
}
