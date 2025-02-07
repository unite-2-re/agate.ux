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
    {
        name: "--percent",
        syntax: "<number>",
        inherits: true,
        initialValue: "0",
    },
    {
        name: "--percent-y",
        syntax: "<number>",
        inherits: true,
        initialValue: "0",
    },
    {
        name: "--percent-x",
        syntax: "<number>",
        inherits: true,
        initialValue: "0",
    },
    {
        name: "--scroll-left",
        syntax: "<number>",
        inherits: true,
        initialValue: "0",
    },
    {
        name: "--scroll-top",
        syntax: "<number>",
        inherits: true,
        initialValue: "0",
    }
];

// define properties
properties.forEach((o) => {
    try {
        CSS?.registerProperty?.(o)
    } catch(e) {
        console.warn(e);
    }
});
