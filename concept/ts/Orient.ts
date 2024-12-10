import { setStyleRules } from "./StyleRules";
import type {StyleTuple} from "./StyleRules";

//
import { getCorrectOrientation, whenAnyScreenChanges } from "./Utils";

//
const displayPortrait90deg  = { "--pwm": "vertical-rl"  , "--pdir": "ltr", "--pfrot": "0deg"  };
const displayPortrait0deg   = { "--pwm": "horizontal-tb", "--pdir": "ltr", "--pfrot": "0deg"  };
const displayPortrait180deg = { "--pwm": "horizontal-tb", "--pdir": "ltr", "--pfrot": "180deg"};
const displayPortrait270deg = CSS.supports("writing-mode", "sideways-lr")
    ? {"--pwm": "sideways-lr", "--pdir": "ltr", "--pfrot": "0deg"}
    : {"--pwm": "vertical-lr", "--pdir": "rtl", "--pfrot": "0deg"};

//
const displayLandscape90deg  = { "--lwm": "vertical-rl"  , "--ldir": "ltr", "--lfrot": "0deg"   };
const displayLandscape0deg   = { "--lwm": "horizontal-tb", "--ldir": "ltr", "--lfrot": "0deg"   };
const displayLandscape180deg = { "--lwm": "horizontal-tb", "--ldir": "ltr", "--lfrot": "180deg" };
const displayLandscape270deg = CSS.supports("writing-mode", "sideways-lr")
    ? {"--lwm": "sideways-lr", "--ldir": "ltr", "--lfrot": "0deg"}
    : {"--lwm": "vertical-lr", "--ldir": "rtl", "--lfrot": "0deg"};

//
const orient0deg = {"--orient": 0};
const orient90deg = {"--orient": 1};
const orient180deg = {"--orient": 2};
const orient270deg = {"--orient": 3};

//
const portrait0deg = {"--prot": "0deg"};
const portrait90deg = {"--prot": "90deg"};
const portrait180deg = {"--prot": "180deg"};
const portrait270deg = {"--prot": "270deg"};

//
const landscape0deg = {"--lrot": "0deg"};
const landscape90deg = {"--lrot": "90deg"};
const landscape180deg = {"--lrot": "180deg"};
const landscape270deg = {"--lrot": "270deg"};

//
const ptsLandscape = { "--ptw": "100cqb", "--pth": "100cqi" };
const ptsPortrait = { "--ptw": "100cqi", "--pth": "100cqb" };

//
const ltsLandscape = { "--ltw": "100cqi", "--lth": "100cqb" };
const ltsPortrait = { "--ltw": "100cqb", "--lth": "100cqi" };

//
const landscape = Object.assign({}, landscape0deg);
const portrait = Object.assign({}, portrait90deg);

//
const displayLandscape = Object.assign({}, displayLandscape0deg);
const displayPortrait = Object.assign({}, displayPortrait90deg);

//
const lts = Object.assign({}, ltsLandscape);
const pts = Object.assign({}, ptsLandscape);

//
const currentOrient = Object.assign({}, orient0deg);

//
const isMobile = ()=>{
    const f1 = matchMedia("(hover: none) and (pointer: coarse) and (display-mode: fullscreen)").matches;
    const f2 = 'ontouchstart' in window || 'onmsgesturechange' in window;
    return f1 && f2;
}

//
export const updateOrientation = (_) => {
    switch (getCorrectOrientation()) {
        case "portrait-primary":
            Object.assign(landscape, landscape90deg);
            Object.assign(portrait, portrait0deg);

            //
            Object.assign(displayLandscape, displayLandscape90deg);
            Object.assign(displayPortrait, displayPortrait0deg);

            //
            Object.assign(lts, ltsPortrait);
            Object.assign(pts, ptsPortrait);

            //
            Object.assign(currentOrient, orient0deg);

            ///
            break;

        case "landscape-primary":
            Object.assign(landscape, landscape0deg);
            Object.assign(portrait, portrait270deg);

            //
            Object.assign(displayLandscape, displayLandscape0deg);
            Object.assign(displayPortrait, displayPortrait270deg);

            //
            Object.assign(lts, ltsLandscape);
            Object.assign(pts, ptsLandscape);

            //
            Object.assign(currentOrient, orient90deg);

            break;

        case "portrait-secondary":
            Object.assign(landscape, landscape270deg);
            Object.assign(portrait, portrait180deg);

            //
            Object.assign(displayLandscape, displayLandscape270deg);
            Object.assign(displayPortrait, displayPortrait180deg);

            //
            Object.assign(lts, ltsPortrait);
            Object.assign(pts, ptsPortrait);

            //
            Object.assign(currentOrient, orient180deg);

            break;

        case "landscape-secondary":
            Object.assign(landscape, landscape180deg);
            Object.assign(portrait, portrait90deg);

            //
            Object.assign(displayLandscape, displayLandscape180deg);
            Object.assign(displayPortrait, displayPortrait90deg);

            //
            Object.assign(lts, ltsLandscape);
            Object.assign(pts, ptsLandscape);

            //
            Object.assign(currentOrient, orient270deg);

            break;
    }
};

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
};
