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
export default initialize;
