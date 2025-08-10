import { H127, H255 } from '../../types/curves'

/**
 * Формирует строку координат для SVG-пути кривой по LUT.
 *
 * @param {Uint8Array | Uint8ClampedArray} lut - LUT-таблица значений (0..max).
 * @param {number} max - Максимальное значение по оси X (127 для GB7, 255 для RGBA).
 * @returns {string} Строка вида `"x,y x,y ..."` для использования в атрибуте `points` SVG.
 *
 * @example
 * const path = curvePath(lut, 255);
 * <polyline points={path} />
 */
export const curvePath = (lut: Uint8Array | Uint8ClampedArray, max: number) =>
    Array.from({ length: max + 1 }, (_, x) => `${x},${max - lut[x]}`).join(' ')

/**
 * Формирует строку координат для SVG-гистограммы с диапазоном 0–255.
 *
 * @param {Uint32Array} arr - Массив значений гистограммы (256 элементов).
 * @returns {string} Строка вида `"x,y x,y ..."` для `points` в SVG.
 *
 * @example
 * const hist = histPath255(histogramArray);
 * <polyline points={hist} />
 */
export const histPath255 = (arr: Uint32Array) => {
    const max = Math.max(1, ...arr)
    return Array.from({ length: 256 }, (_, x) => {
        const y = H255 - 1 - Math.round((arr[x] / max) * (H255 - 1))
        return `${x},${y}`
    }).join(' ')
}

/**
 * Формирует строку координат для SVG-гистограммы с диапазоном 0–127 (GB7).
 *
 * @param {Uint32Array} arr - Массив значений гистограммы (128 элементов).
 * @returns {string} Строка вида `"x,y x,y ..."` для `points` в SVG.
 *
 * @example
 * const hist = histPath127(histogramArray);
 * <polyline points={hist} />
 */
export const histPath127 = (arr: Uint32Array) => {
    const max = Math.max(1, ...arr)
    return Array.from({ length: 128 }, (_, x) => {
        const y = H127 - 1 - Math.round((arr[x] / max) * (H127 - 1))
        return `${x},${y}`
    }).join(' ')
}
