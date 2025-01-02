import { zoomOf } from "./_Zoom.js";

//
export const UUIDv4 = () => {
    return crypto?.randomUUID ? crypto?.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));
};

//
const onBorderObserve = new WeakMap<HTMLElement, Function[]>();
export const observeBorderBox = (element, cb) => {
    if (!onBorderObserve.has(element)) {
        const callbacks: Function[] = [];

        //
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.borderBoxSize) {
                    const borderBoxSize = entry.borderBoxSize[0];
                    if (borderBoxSize) {
                        callbacks.forEach((cb) => cb?.(borderBoxSize, observer));
                    }
                }
            }
        });

        //
        cb?.({
            inlineSize: element.offsetWidth,
            blockSize: element.offsetHeight,
        }, observer);

        //
        onBorderObserve.set(element, callbacks);
        observer.observe(element, {box: "border-box"});
    }

    //
    onBorderObserve.get(element)?.push(cb);
}

//
export interface ScrollBarStatus {
    pointerId: number;
    scroll: number;
    delta: number;
    point: number;
};

//
export const setProperty = (target, name, value, importance = "")=>{
    if ("attributeStyleMap" in target) {
        const raw = target.attributeStyleMap.get(name);
        const prop = raw?.[0] ?? raw?.value;
        if (prop != value || prop == null) {
            if (raw?.value != null && !(raw instanceof CSSKeywordValue)) { raw.value = value; } else
            { target.attributeStyleMap.set(name, value); };
        }
    } else {
        const prop = target?.style?.getPropertyValue?.(name);
        if (prop != value || prop == null) {
            target?.style?.setProperty?.(name, value, importance);
        }
    }
}

//
const borderBoxWidth  = Symbol("@content-box-width");
const borderBoxHeight = Symbol("@content-box-height");

//
export class ScrollBar {
    scrollbar: HTMLDivElement;
    holder: HTMLElement;
    status: ScrollBarStatus;
    content: HTMLDivElement;
    uuid: string = "";
    uuid2: string = "";
    uuid3: string = "";

    //
    constructor({holder, scrollbar, content}, axis = 0) {
        this.scrollbar = scrollbar;
        this.holder    = holder;
        this.content   = content;
        this.uuid      = UUIDv4();
        this.uuid2     = UUIDv4();
        this.uuid3     = UUIDv4();
        this.status    = {
            delta: 0,
            scroll: 0,
            pointerId: -1,
            point: 0
        };

        //
        setProperty(this.scrollbar, "visibility", "collapse");

        //
        const status_w = new WeakRef(this.status);
        const weak     = new WeakRef(this);
        const computeScroll = (ev: any | null = null) => {
            const self = weak?.deref?.();
            if (self) {
                const sizePercent = Math.min(
                    self.content[[borderBoxWidth, borderBoxHeight][axis]] /
                    (self.content[["scrollWidth", "scrollHeight"][axis]] || 1),
                    1
                );

                //
                setProperty(self.scrollbar, "--scroll-coef", sizePercent);
                setProperty(self.scrollbar, "--scroll-size", (self.content[["scrollWidth", "scrollHeight"][axis]] || 1));

                //
                if (sizePercent >= 0.999) {
                    setProperty(self.scrollbar, "visibility", "collapse", "important");
                } else {
                    setProperty(self.scrollbar, "visibility", "visible", "important");
                }
            }
        };

        //
        const computeScrollPosition = ()=>{
            const self   = weak?.deref?.();
            const status = status_w?.deref?.();

            //
            if (status && status?.pointerId >= 0) {
                status.scroll += (status.point - status.delta) * ((self?.content?.[["scrollWidth", "scrollHeight"][axis]] || 0) / (self?.content?.[[borderBoxWidth, borderBoxHeight][axis]] || 1));
                status.delta   = status.point;

                //
                const realShift = status.scroll - self?.content?.[["scrollLeft", "scrollTop"][axis]];;

                //
                if (Math.abs(realShift) >= 0.001) {
                    self?.content?.scrollBy?.({
                        [["left", "top"][axis]]: realShift,
                        behavior: "instant",
                    });
                }
            }
        }

        //
        const moveScroll = (evc) => {
            const ev     = evc?.detail || evc;
            const self   = weak?.deref?.();
            const status = status_w?.deref?.();
            if (self && status && status?.pointerId == ev.pointerId) {
                evc?.stopPropagation?.();
                evc?.preventDefault?.();
                status.point = ev?.orient?.[axis] ?? (ev[["clientX", "clientY"][axis]] / zoomOf(self?.holder));
            }
        }

        //
        const stopScroll = (evc) => {
            const ev     = evc?.detail || evc;
            const status = status_w?.deref?.();
            const self   = weak?.deref?.();
            if (status && status?.pointerId == ev.pointerId) {
                evc?.stopPropagation?.();
                evc?.preventDefault?.();

                //
                status.scroll = self?.content?.[["scrollLeft", "scrollTop"][axis]] || 0;
                status.pointerId = -1;

                // @ts-ignore
                ev.target?.releasePointerCapture?.(ev.pointerId);

                //
                this.holder.removeEventListener("ag-pointermove", moveScroll);
                this.holder.removeEventListener("ag-pointerup", stopScroll);
                this.holder.removeEventListener("ag-pointercancel", stopScroll);
            }
        };

        //
        this.scrollbar
            ?.querySelector?.(".thumb")
            ?.addEventListener?.("pointerdown", (evc: any) => {
                const ev     = evc?.detail || evc;
                const status = status_w?.deref?.();
                const self   = weak?.deref?.();

                //
                if (self && status && status?.pointerId < 0) {
                    evc?.stopPropagation?.();
                    evc?.preventDefault?.();
                    ev?.target?.setPointerCapture?.(ev.pointerId);

                    //
                    status.pointerId = ev.pointerId || 0;
                    status.delta  = ev?.orient?.[axis] || ev[["clientX", "clientY"][axis]] / zoomOf(self?.holder);
                    status.point  = status.delta;
                    status.scroll = self?.content?.[["scrollLeft", "scrollTop"][axis]];

                    //
                    this.holder.addEventListener("pointermove", moveScroll);
                    this.holder.addEventListener("pointerup", stopScroll);
                    this.holder.addEventListener("pointercancel", stopScroll);

                    //
                    (async ()=>{
                        while(status && status?.pointerId >= 0) {
                            computeScrollPosition();
                            await new Promise((r)=>requestAnimationFrame(r));
                        }
                    })();
                }
            });

        //
        this.content.addEventListener("scroll", (ev)=>{
            const self = weak?.deref?.() as any;

            //
            if (!CSS.supports("timeline-scope", "--tm-x, --tm-y")) {
                setProperty(
                    self?.holder,
                    "--scroll-top",
                    (self?.content?.scrollTop || "0") as string
                );

                //
                setProperty(
                    self?.holder,
                    "--scroll-left",
                    (self?.content?.scrollLeft || "0") as string
                );
            }

            //
            self?.holder?.dispatchEvent?.(new CustomEvent("scroll-change", {
                detail: {
                    scrollTop: self.content.scrollTop,
                    scrollLeft: self.content.scrollLeft,
                },
            }));
        });

        //
        this.holder.addEventListener("u2-hidden", computeScroll);
        this.holder.addEventListener("u2-appear", computeScroll);
        this.holder.addEventListener("input", computeScroll);
        this.holder.addEventListener("change", computeScroll);

        // inputs support also needed...
        (new MutationObserver(computeScroll)).observe(this.holder, { childList: true, subtree: true, characterData: true, attributes: false });
        requestIdleCallback(computeScroll, {timeout: 1000});
        observeBorderBox(this.content, (box) => {
            const self = weak?.deref?.();
            if (self) {
                setProperty(self.scrollbar, "--content-size", self.content[[borderBoxWidth, borderBoxHeight][axis]] = box[["inlineSize", "blockSize"][axis]]);
                computeScroll();
            }
        });
    }
}
