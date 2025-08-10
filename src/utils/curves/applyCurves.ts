export type GB7AlphaMode =
    | { mode: 'preserve' }
    | { mode: 'opaque' }
    | { mode: 'transparent' }
    | {
          mode: 'threshold'
          threshold: number
          invert?: boolean
          combine?: 'replace' | 'and' | 'or'
      }

export type LUT = Uint8Array | Uint8ClampedArray

/**
 * Применяет LUT-таблицы к каналам RGBA.
 * Для каждого канала, где LUT не передан, значения не изменяются.
 *
 * @param {ImageData} src - Исходные данные изображения.
 * @param {{ r?: LUT; g?: LUT; b?: LUT; a?: LUT }} luts - LUT-таблицы для каждого канала (R, G, B, A).
 * @returns {ImageData} Новый объект ImageData с применёнными изменениями.
 *
 * @example
 * const out = applyCurves(imageData, { r: lutR, g: lutG });
 */
export function applyCurves(
    src: ImageData,
    luts: { r?: LUT; g?: LUT; b?: LUT; a?: LUT },
): ImageData {
    const { data, width, height } = src
    const out = new Uint8ClampedArray(data)

    const lr = luts?.r ? new Uint8Array(luts.r) : undefined
    const lg = luts?.g ? new Uint8Array(luts.g) : undefined
    const lb = luts?.b ? new Uint8Array(luts.b) : undefined
    const la = luts?.a ? new Uint8Array(luts.a) : undefined

    for (let i = 0; i < out.length; i += 4) {
        if (lr) out[i + 0] = lr[out[i + 0]]
        if (lg) out[i + 1] = lg[out[i + 1]]
        if (lb) out[i + 2] = lb[out[i + 2]]
        if (la) out[i + 3] = la[out[i + 3]]
    }
    return new ImageData(out, width, height)
}

/**
 * Применяет LUT и/или режим альфа-канала к изображению в формате GB7.
 *
 * @param {Uint8Array} pixels - Исходный массив пикселей GB7.
 * @param {LUT | undefined} yLut - LUT яркости (0–127). Если не задан, яркость не изменяется.
 * @param {GB7AlphaMode} alphaMode - Режим обработки альфа-канала.
 * @returns {Uint8Array} Новый массив пикселей GB7 с применёнными изменениями.
 *
 * @example
 * const out = applyCurvesGB7(pixels, lutY, { mode: 'threshold', threshold: 64 });
 */
export function applyCurvesGB7(
    pixels: Uint8Array,
    yLut: LUT | undefined,
    alphaMode: GB7AlphaMode,
) {
    const out = new Uint8Array(pixels.length)

    for (let i = 0; i < pixels.length; i++) {
        const byte = pixels[i]
        const y7 = byte & 0x7f
        const aBit = byte & 0x80 ? 0x80 : 0x00

        const newY7 = yLut ? yLut[y7] >>> 1 : y7
        let newA = aBit

        switch (alphaMode.mode) {
            case 'preserve':
                break
            case 'opaque':
                newA = 0x80
                break
            case 'transparent':
                newA = 0x00
                break
            case 'threshold': {
                const th = alphaMode.threshold ?? 64
                const yForTh = yLut ? newY7 : y7
                const pass = alphaMode.invert ? yForTh < th : yForTh >= th
                const thA = pass ? 0x80 : 0x00

                const combine = alphaMode.combine ?? 'and'
                newA =
                    combine === 'replace'
                        ? thA
                        : combine === 'or'
                        ? aBit | thA
                        : aBit & thA
                break
            }
        }

        out[i] = newA | (newY7 & 0x7f)
    }

    return out
}
