import { classes, loadBlobStyle, setStyleRules } from "./ts/sw/StyleRules.ts";
import { whenAnyScreenChanges } from "./ts/sw/Utils.ts";
import { viewportHandler } from "./ts/sw/Viewport.ts";
import { UIOrientBox } from "./ts/wcomp/OrientBox.ts";

// @ts-ignore
import styles from "../$scss$/_Main.scss?inline&compress";

//
const initialize = ()=>{
    loadBlobStyle(styles);

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
export { UIOrientBox };
export default initialize;
function updateOrientation(e: any) {
    throw new Error("Function not implemented.");
}

//
export * from "./ts/_Utils.ts";
export * from "./ts/_Detect.ts";
export * from "./ts/_Zoom.ts";
