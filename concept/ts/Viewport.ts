//
const getAvailSize = ()=>{
    const mob = isMobile();
    return {
        "--avail-width": ((mob ? screen.availWidth : Math.max(window.innerWidth, screen.availWidth)) || 0) + "px",
        "--avail-height": ((mob ? screen.availHeight : Math.max(window.innerHeight, screen.availHeight)) || 0) + "px",
        "--pixel-ratio": devicePixelRatio || 1,
    };
}

//
const availSize = getAvailSize();
const updateVP = ()=>{
    Object.assign(availSize, getAvailSize());
}
