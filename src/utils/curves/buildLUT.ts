/**
 * Строит LUT (Look-Up Table) с кусочно-линейной интерполяцией
 * по двум заданным точкам.
 * Ломаная проходит через:
 * - (0, 0)
 * - (x1, y1)
 * - (x2, y2)
 * - (max, max)
 *
 * Значения ограничиваются диапазоном [0, max].
 *
 * @param {number} x1 - Координата X первой контрольной точки.
 * @param {number} y1 - Координата Y первой контрольной точки.
 * @param {number} x2 - Координата X второй контрольной точки.
 * @param {number} y2 - Координата Y второй контрольной точки.
 * @param {number} [max=255] - Максимальное значение диапазона (255 для RGBA, 127 для GB7).
 * @returns {Uint8ClampedArray} LUT длиной `max + 1`.
 *
 * @example
 * // LUT для RGBA
 * const lutRGBA = buildLUT(64, 32, 192, 224);
 *
 * // LUT для GB7
 * const lutGB7 = buildLUT(32, 16, 96, 112, 127);
 */
export function buildLUT(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    max = 255,
) {
    const clamp = (v: number) => Math.max(0, Math.min(max, Math.round(v)))

    let _x1 = clamp(x1)
    let _x2 = clamp(x2)
    let _y1 = clamp(y1)
    let _y2 = clamp(y2)

    if (_x1 > _x2) {
        ;[_x1, _x2] = [_x2, _x1]
        ;[_y1, _y2] = [_y2, _y1]
    }

    const lut = new Uint8ClampedArray(max + 1)
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const seg = (x: number, x0: number, y0: number, x1: number, y1: number) => {
        if (x1 === x0) return y1
        const t = (x - x0) / (x1 - x0)
        return lerp(y0, y1, t)
    }

    for (let x = 0; x <= max; x++) {
        let y: number
        if (x <= _x1) y = seg(x, 0, 0, _x1, _y1)
        else if (x <= _x2) y = seg(x, _x1, _y1, _x2, _y2)
        else y = seg(x, _x2, _y2, max, max)
        lut[x] = clamp(y)
    }

    return lut
}
