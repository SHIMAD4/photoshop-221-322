/**
 * Масштабирует объект ImageData до новых размеров с указанной интерполяцией.
 *
 * Использует два временных canvas:
 * - Первый (inputCanvas) для загрузки исходных пикселей.
 * - Второй (tempCanvas) для отрисовки и получения масштабированного изображения.
 *
 * @param { ImageData } original - Исходные данные изображения.
 * @param { number } newWidth - Новая ширина изображения в пикселях.
 * @param { number } newHeight - Новая высота изображения в пикселях.
 * @param { 'nearest' | 'bilinear' } interp - Тип интерполяции:
 *   - `"nearest"` — ближайший сосед (быстро, но с артефактами).
 *   - `"bilinear"` — билинейная (гладко, но медленнее).
 *
 * @returns { ImageData } Масштабированное изображение в формате ImageData.
 *
 * @throws { Error } Если контекст 2D для временного canvas недоступен.
 *
 * @example
 * const resized = scaleImageData(originalImageData, 800, 600, 'bilinear');
 */
export function scaleImageData(
    original: ImageData,
    newWidth: number,
    newHeight: number,
    interp: 'nearest' | 'bilinear',
): ImageData {
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = newWidth
    tempCanvas.height = newHeight

    const ctx = tempCanvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    const inputCanvas = document.createElement('canvas')
    inputCanvas.width = original.width
    inputCanvas.height = original.height
    inputCanvas.getContext('2d')?.putImageData(original, 0, 0)

    ctx.imageSmoothingEnabled = interp === 'bilinear'

    ctx.drawImage(inputCanvas, 0, 0, newWidth, newHeight)

    return ctx.getImageData(0, 0, newWidth, newHeight)
}
