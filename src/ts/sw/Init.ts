import { classes, loadBlobStyle, setStyleRules } from "./StyleRules.ts";
import { whenAnyScreenChanges } from "./Utils.ts";
import { viewportHandler } from "./Viewport.ts";

//
const initialize = ()=>{
    // TODO!
    //loadBlobStyle(styles);

    //
    window?.visualViewport?.addEventListener?.("scroll", viewportHandler);
    window?.visualViewport?.addEventListener?.("resize", viewportHandler);
    document.documentElement.addEventListener("fullscreenchange", viewportHandler);

    //
    if ("virtualKeyboard" in navigator) {
        // @ts-ignore
        navigator?.virtualKeyboard?.addEventListener?.(
            "geometrychange",
            viewportHandler,
            {passive: true}
        );
    }

    //
    requestIdleCallback(viewportHandler, {timeout: 1000});
    whenAnyScreenChanges((e?: any) => {
        updateOrientation(e);
        setStyleRules(classes);
    });
}

//
export default initialize;
function updateOrientation(e: any) {
    throw new Error("Function not implemented.");
}
