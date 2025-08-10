export type HistRGB = { r: Uint32Array; g: Uint32Array; b: Uint32Array }
export type HistA = { a: Uint32Array }

interface HistogramOptions {
    /** Если true — считать только альфа-канал */
    alphaOnly?: boolean
}

/**
 * Вычисляет гистограмму RGBA-изображения (0..255).
 *
 * @param imageData - данные изображения
 * @param options - настройки подсчёта
 * @returns гистограмма по каналам R, G, B либо только по альфа-каналу
 */
export function calcHistogram(
    imageData: ImageData,
    options: HistogramOptions = {},
): HistRGB | HistA {
    const { data } = imageData

    if (options.alphaOnly) {
        const a = new Uint32Array(256)
        for (let i = 3; i < data.length; i += 4) a[data[i]]++
        return { a }
    }

    const r = new Uint32Array(256)
    const g = new Uint32Array(256)
    const b = new Uint32Array(256)

    for (let i = 0; i < data.length; i += 4) {
        r[data[i]]++
        g[data[i + 1]]++
        b[data[i + 2]]++
    }
    return { r, g, b }
}

/**
 * Вычисляет гистограмму изображения в формате GB7 (7-бит яркость + 1-бит альфа).
 *
 * @param pixels - массив байтов GB7
 * @returns гистограмма яркости, альфы и распределение альфы для графика
 */
export function calcHistogramGB7(pixels: Uint8Array) {
    const y = new Uint32Array(128)
    let a0 = 0
    let a1 = 0

    for (let i = 0; i < pixels.length; i++) {
        const byte = pixels[i]
        const gray7 = byte & 0b0111_1111
        y[gray7]++
        if (byte & 0b1000_0000) a1++
        else a0++
    }

    const alphaDist = new Uint32Array(128)
    alphaDist[0] = a0
    alphaDist[127] = a1

    const alpha = new Uint32Array([a0, a1])

    return { y, alpha, alphaDist }
}
