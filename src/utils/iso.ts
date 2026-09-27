// Helpers for the flat-shaded isometric hero scene (HeroScene.astro). Shapes
// are drawn in flat coordinates and projected with
// three affine matrices:
//   floor       (u, v) -> screen, u running down-right and v down-left
//   left face   a vertical face along +u, descending to the right
//   right face  a vertical face along -v, rising to the right
// so content inside a face (a screen's UI, say) can be laid out in plain x/y.
//
// Fills are CSS classes (see "Isometric scene" in tailwind.css) rather than
// literal colors, so the scene follows the light/dark theme.

const C = 0.866;
const S = 0.5;
const r = (n: number) => Math.round(n * 10) / 10;

export type Shade = { t: string; l: string; r: string };

export const ISO_ORANGE: Shade = { t: 'iso-or-t', l: 'iso-or-l', r: 'iso-or-r' };
export const ISO_STONE: Shade = { t: 'iso-stone-t', l: 'iso-stone-l', r: 'iso-stone-r' };

export const makeIso = (ox: number, oy: number) => {
  const at = (u: number, v: number): [number, number] => [ox + C * (u - v), oy + S * (u + v)];
  const pt = (u: number, v: number, lift = 0) => {
    const [x, y] = at(u, v);
    return `${r(x)},${r(y - lift)}`;
  };

  const floor = `matrix(${C} ${S} ${-C} ${S} ${ox} ${oy})`;
  const leftFace = (u: number, v: number, lift: number) => {
    const [x, y] = at(u, v);
    return `matrix(${C} ${S} 0 1 ${r(x)} ${r(y - lift)})`;
  };
  const rightFace = (u: number, v: number, lift: number) => {
    const [x, y] = at(u, v);
    return `matrix(${C} ${-S} 0 1 ${r(x)} ${r(y - lift)})`;
  };

  // A flat quad on the floor plane, raised by `lift`.
  const quad = (u: number, v: number, su: number, sv: number, cls: string, lift = 0) =>
    `<polygon class="${cls}" points="${pt(u, v, lift)} ${pt(u + su, v, lift)} ${pt(u + su, v + sv, lift)} ${pt(u, v + sv, lift)}"/>`;

  // A box standing on the floor: `su` x `sv` footprint, `h` tall, raised by `lift`.
  const box = (u: number, v: number, su: number, sv: number, h: number, shade: Shade, lift = 0) =>
    quad(u, v, su, sv, shade.t, h + lift) +
    `<polygon class="${shade.l}" points="${pt(u, v + sv, lift + h)} ${pt(u + su, v + sv, lift + h)} ${pt(u + su, v + sv, lift)} ${pt(u, v + sv, lift)}"/>` +
    `<polygon class="${shade.r}" points="${pt(u + su, v + sv, lift + h)} ${pt(u + su, v, lift + h)} ${pt(u + su, v, lift)} ${pt(u + su, v + sv, lift)}"/>`;

  return { at, floor, leftFace, rightFace, box };
};
