// @ts-ignore
import { loadBlobStyle } from "/externals/lib/dom.js";
export type StyleTuple = [selector: string, sheet: object];

//
import { updateVP } from "./ts/sw/Viewport";
import { availSize } from "./ts/sw/Viewport";
import { UIOrientBox } from "./ts/wcomp/OrientBox";
import { wrapEvent } from "./ts/sw/WrapEvent";

//
export const classes: StyleTuple[] = [
    [":root, :host, :scope", availSize]
];

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
    requestIdleCallback(cb, {timeout: 100});
    cb();
};

// @ts-ignore
import styles from "./scss/_Main.scss?inline&compress";

//
const initialize = ()=>{
    loadBlobStyle(styles);
    whenAnyScreenChanges(updateVP);
};

//
export { UIOrientBox };
export default initialize;

//
export const orientationNumberMap = {
    "portrait-primary": 0, // as 0deg, aka. 360deg
    "landscape-primary": 1, // as -90deg, aka. 270deg
    "portrait-secondary": 2, // as -180deg, aka. 180deg
    "landscape-secondary": 3 // as -270deg, aka. 90deg
}

//
export const fixOrientToScreen = (element)=>{
    if (!element?.classList?.contains?.("native-portrait-optimized")) {
        element?.classList?.add?.("native-portrait-optimized");
        whenAnyScreenChanges(()=>{
            const orient = orientationNumberMap?.[getCorrectOrientation()] || 0;
            element.orient = orient;
        });
    }
}

//
export * from "./ts/_Utils";
export * from "./ts/_Detect";
export * from "./ts/_Zoom";
export * from "./ts/_Scrollbar";

//
export {wrapEvent};
