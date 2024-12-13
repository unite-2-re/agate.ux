import { classes, loadBlobStyle, setStyleRules } from "./ts/sw/StyleRules";
import { viewportHandler } from "./ts/sw/Viewport";
import { UIOrientBox } from "./ts/wcomp/OrientBox";

//
export const getCorrectOrientation = () => {
    let orientationType: string = screen.orientation.type;
    if (!window.matchMedia("((display-mode: fullscreen) or (display-mode: standalone) or (display-mode: window-controls-overlay))").matches) {
        if (matchMedia("(orientation: portrait)").matches) {orientationType = orientationType.replace("landscape", "portrait");} else
            if (matchMedia("(orientation: landscape)").matches) {orientationType = orientationType.replace("portrait", "landscape");};
    }
    return orientationType;
};

//
export const whenAnyScreenChanges = (cb)=>{
    //
    if ("virtualKeyboard" in navigator) {
        // @ts-ignore
        navigator?.virtualKeyboard?.addEventListener?.(
            "geometrychange",
            cb,
            {passive: true}
        );
    }

    //
    self?.addEventListener("resize", cb, { passive: true });
    window?.visualViewport?.addEventListener?.("scroll", cb);
    window?.visualViewport?.addEventListener?.("resize", cb);
    screen?.orientation.addEventListener("change", cb, { passive: true });
    document?.documentElement.addEventListener("DOMContentLoaded", cb, {passive: true });
    document?.documentElement.addEventListener("fullscreenchange", cb, {passive: true });
    matchMedia("(orientation: portrait)").addEventListener("change", cb, {passive: true });
    requestIdleCallback(cb, {timeout: 1000});
};

// @ts-ignore
import styles from "./scss/_Main.scss?inline&compress";

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
};

//
export { UIOrientBox };
export default initialize;
const updateOrientation = (e: any) => {
    throw new Error("Function not implemented.");
};

//
export * from "./ts/_Utils";
export * from "./ts/_Detect";
export * from "./ts/_Zoom";
