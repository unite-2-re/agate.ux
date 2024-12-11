# 💎 Agate.UX 💎

> Under consideration for Q2 or Q3 or 2025 years.

Agate.UX - multi-dimensional UX/interaction library/framework.

**This is logical dedication/separation and continue from:**

- [DOM.ts](https://github.com/unite-2-re/dom.ts)
- [Interact.ts](https://github.com/unite-2-re/interact.ts)
- [Web.core](https://github.com/unite-2-re/web.core)

## Future Features

- Virtual UI/UX scaling
- Virtual screen orientation
- Pointer events adapted to virtual coordinates
- New and improved CSS rules
- API for fixed/independent oriented UI

---

## 🧩 Concepts 🧩

> Concepts for 2025 "2REmembrance" generation.

1. Rotate by orientation index:
    - `calc(var(--orient, 0) * 100grad)`
    - `calc(var(--orient, 0) * 0.25turn)`
    - `calc(var(--orient, 0) * 90deg)`
    - `<in rad will bit more complex>`

### How is works?

**We have two or three versions of coordinates:**

- Client-Space coordinates (i.e. page coordinate system)
- Oriented-Space coordinates (aka. virtual screen)
- Algorithm-Space coordinates (mostly, internal)

**Also we have two types of degrees:**

- 90deg based (0deg, 90deg, 180deg, 270deg, etc.)
- Variable degrees or angle (used matrices)

**Also, events will pre-computed these values:**

- Client-Space Pointer Position
- Oriented-Space Pointer Position
- Algorithm-Space Pointer Position (specific cases)

### Scaling

Will be made special version of getBoundingClientRect, clientX and clientY with software or virtual scaling accounting. Also, will recomputed view-ports size values.

### Events

Will be made `ag-pointer*` events wrappers as base prior, with enchantments.

### CSS properties

Planned to made those CSS properties.

**Oriented-Space:**

- `--os-inset-x`
- `--os-inset-y`
- `--os-drag-x`
- `--os-drag-y`
- `--os-size-x`
- `--os-size-y`
- `--os-self-size-x`
- `--os-self-size-y`
- `--os-offset-x` (relative of offsetParent)
- `--os-offset-y` (relative of offsetParent)

**Client-Space:**

- `--cs-inset-x`
- `--cs-inset-y`
- `--cs-drag-x`
- `--cs-drag-y`
- `--cs-size-x`
- `--cs-size-y`
- `--cs-self-size-x`
- `--cs-self-size-y`
- `--cs-offset-x` (relative of offsetParent)
- `--cs-offset-y` (relative of offsetParent)

**Implementation-Dependent:**

- `--im-inset-x`
- `--im-inset-y`
- `--im-drag-x`
- `--im-drag-y`
- `--im-size-x`
- `--im-size-y`
- `--im-self-size-x`
- `--im-self-size-y`
- `--im-offset-x` (relative of offsetParent)
- `--im-offset-y` (relative of offsetParent)

### Some details

- In transforms, `self-size-x` and `self-size-y` also equals to `100%` (if use client-space).
- In insets or sizing, `self-size-x` and `self-size-y` is offset parent size.
- Transforms always uses client-space if not transformed before.
- Sizes and insets may be swapped in `inline` and `block` units.

### Potential implementation

May have those types.

**By layout:**

- Fixed/absolute position based (insets)
- CSS Houdini (layout work-lets)

**By orientation:**

- Inline/Block with `writing-mode` and `direction`.
- Transform-based (aka. `rotate`).
- In some cases may be mixed or combined.

### New policy concepts

Currently we using more stable `inset` position for semi-static, and `translate` for dynamics, such as dragging or animations.
