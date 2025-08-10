/**
 * Масштабирует изображение методом ближайшего соседа.
 * Быстрый алгоритм, но может приводить к появлению ступенчатых артефактов.
 *
 * @param { Uint8ClampedArray<ArrayBuffer> } src - Исходный RGBA-буфер изображения.
 * @param { number } srcWidth - Исходная ширина изображения.
 * @param { number } srcHeight - Исходная высота изображения.
 * @param { number } dstWidth - Желаемая ширина результирующего изображения.
 * @param { number } dstHeight - Желаемая высота результирующего изображения.
 *
 * @returns { Uint8ClampedArray } Новый RGBA-буфер с изменёнными размерами.
 *
 * @example
 * const scaled = scaleImageNearest(srcBuffer, 800, 600, 400, 300);
 */
function scaleImageNearest(
    src: Uint8ClampedArray<ArrayBuffer>,
    srcWidth: number,
    srcHeight: number,
    dstWidth: number,
    dstHeight: number,
) {
    const dstData = new Uint8ClampedArray(dstWidth * dstHeight * 4)
    const xRatio = srcWidth / dstWidth
    const yRatio = srcHeight / dstHeight

    for (let y = 0; y < dstHeight; y++) {
        for (let x = 0; x < dstWidth; x++) {
            const srcX = Math.floor(x * xRatio)
            const srcY = Math.floor(y * yRatio)
            const srcIdx = (srcY * srcWidth + srcX) * 4
            const dstIdx = (y * dstWidth + x) * 4

            dstData.set(src.subarray(srcIdx, srcIdx + 4), dstIdx)
        }
    }
    return dstData
}

/**
 * Масштабирует изображение методом билинейной интерполяции.
 * Даёт более плавное изображение за счёт учёта соседних пикселей,
 * но работает медленнее, чем ближайший сосед.
 *
 * @param { Uint8ClampedArray<ArrayBuffer> } src - Исходный RGBA-буфер изображения.
 * @param { number } srcWidth - Исходная ширина изображения.
 * @param { number } srcHeight - Исходная высота изображения.
 * @param { number } dstWidth - Желаемая ширина результирующего изображения.
 * @param { number } dstHeight - Желаемая высота результирующего изображения.
 *
 * @returns { Uint8ClampedArray } Новый RGBA-буфер с изменёнными размерами.
 *
 * @example
 * const scaled = scaleImageBilinear(srcBuffer, 800, 600, 400, 300);
 */
function scaleImageBilinear(
    src: Uint8ClampedArray<ArrayBuffer>,
    srcWidth: number,
    srcHeight: number,
    dstWidth: number,
    dstHeight: number,
) {
    const dstData = new Uint8ClampedArray(dstWidth * dstHeight * 4)
    const xRatio = (srcWidth - 1) / dstWidth
    const yRatio = (srcHeight - 1) / dstHeight

    for (let y = 0; y < dstHeight; y++) {
        for (let x = 0; x < dstWidth; x++) {
            const gx = x * xRatio
            const gy = y * yRatio
            const gxi = Math.floor(gx)
            const gyi = Math.floor(gy)
            const dx = gx - gxi
            const dy = gy - gyi

            const x1 = Math.min(gxi + 1, srcWidth - 1)
            const y1 = Math.min(gyi + 1, srcHeight - 1)

            const idx00 = (gyi * srcWidth + gxi) * 4
            const idx01 = (gyi * srcWidth + x1) * 4
            const idx10 = (y1 * srcWidth + gxi) * 4
            const idx11 = (y1 * srcWidth + x1) * 4

            for (let ch = 0; ch < 4; ch++) {
                const v00 = src[idx00 + ch]
                const v01 = src[idx01 + ch]
                const v10 = src[idx10 + ch]
                const v11 = src[idx11 + ch]

                const val =
                    v00 * (1 - dx) * (1 - dy) +
                    v01 * dx * (1 - dy) +
                    v10 * (1 - dx) * dy +
                    v11 * dx * dy

                dstData[(y * dstWidth + x) * 4 + ch] = Math.round(val)
            }
        }
    }
    return dstData
}

export { scaleImageBilinear, scaleImageNearest }
