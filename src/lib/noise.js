// A cheap, dependency-free grain texture: one tiny SVG turbulence filter,
// tiled as a CSS background. Used at very low opacity so it reads as paper
// texture rather than visible static.
const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`

export const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
