import { scaleImageBilinear, scaleImageNearest } from './interpolation'

/**
 * Масштабирует RGBA-буфер изображения до указанных размеров с использованием выбранного метода интерполяции.
 *
 * - Создаёт безопасную копию исходного массива `raw`, чтобы избежать мутаций.
 * - Поддерживает два алгоритма масштабирования:
 *   - `'nearest'` — быстрый, но с возможными ступенчатыми артефактами.
 *   - `'bilinear'` — более плавный, но медленный.
 * - Генерирует новый буфер RGBA данных с учётом целевых размеров.
 *
 * @param { Uint8ClampedArray } raw - Исходный RGBA-буфер изображения.
 * @param { number } srcW - Ширина исходного изображения в пикселях.
 * @param { number } srcH - Высота исходного изображения в пикселях.
 * @param { number } dstW - Целевая ширина изображения в пикселях.
 * @param { number } dstH - Целевая высота изображения в пикселях.
 * @param { 'nearest' | 'bilinear' } interp - Метод интерполяции при масштабировании.
 *
 * @returns { Uint8ClampedArray } Новый RGBA-буфер изображения с изменённым размером.
 *
 * @throws { Error } Если целевые размеры некорректны (нечисловые, нулевые или отрицательные).
 *
 * @example
 * const scaled = resizeRaw(imageData.data, 800, 600, 400, 300, 'bilinear');
 */
export function resizeRaw(
    raw: Uint8ClampedArray,
    srcW: number,
    srcH: number,
    dstW: number,
    dstH: number,
    interp: 'nearest' | 'bilinear',
) {
    if (
        !Number.isFinite(dstW) ||
        !Number.isFinite(dstH) ||
        dstW <= 0 ||
        dstH <= 0
    ) {
        throw new Error(`resizeRaw: invalid dst size ${dstW}x${dstH}`)
    }

    const safe = new Uint8ClampedArray(raw)

    return interp === 'nearest'
        ? scaleImageNearest(safe, srcW, srcH, dstW, dstH)
        : scaleImageBilinear(safe, srcW, srcH, dstW, dstH)
}
