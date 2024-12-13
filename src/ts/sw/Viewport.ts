import { isMobile } from "../_Detect";

//
export const getAvailSize = ()=>{
    const mob = isMobile();
    return {
        "--avail-width": ((mob ? screen.availWidth : Math.max(window.innerWidth, screen.availWidth)) || 0) + "px",
        "--avail-height": ((mob ? screen.availHeight : Math.max(window.innerHeight, screen.availHeight)) || 0) + "px",
        "--pixel-ratio": devicePixelRatio || 1,
    };
}

//
export const availSize = getAvailSize();
export const updateVP = ()=>{
    Object.assign(availSize, getAvailSize());
}

//
export const viewportHandler = (event?: any) => {
    const layoutViewport = document.body;
    const viewport = event?.target || visualViewport;

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
    );
}
