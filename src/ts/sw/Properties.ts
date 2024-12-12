//
export const properties = [
    {
        name: "--visual-width",
        syntax: "<length-percentage>",
        inherits: true,
        initialValue: "0px",
    },
    {
        name: "--visual-height",
        syntax: "<length-percentage>",
        inherits: true,
        initialValue: "0px",
    },
    {
        name: "--clip-ampl",
        syntax: "<number>",
        inherits: true,
        initialValue: "0",
    },
    {
        name: "--clip-freq",
        syntax: "<number>",
        inherits: true,
        initialValue: "0",
    },
    {
        name: "--avail-width",
        syntax: "<length-percentage>",
        inherits: true,
        initialValue: "0px",
    },
    {
        name: "--avail-height",
        syntax: "<length-percentage>",
        inherits: true,
        initialValue: "0px",
    },
    {
        name: "--pixel-ratio",
        syntax: "<number>",
        inherits: true,
        initialValue: "1",
    },
];

// define properties
properties.forEach((o) => {
    try {
        CSS?.registerProperty?.(o)
    } catch(e) {
        console.warn(e);
    }
});
