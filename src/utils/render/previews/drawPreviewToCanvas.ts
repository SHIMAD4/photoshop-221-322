import { ImageDataType } from '../../../types/ImageTypes'
import { putRawToCanvas } from '../../canvas/canvasHelpers'
import { toRGBA } from '../../image/rgba'

/**
 * Отрисовывает миниатюрное превью изображения в указанный canvas.
 * Используется, например, для отображения слоёв или мини-превью в панели инструментов.
 *
 * @param { HTMLCanvasElement } canvas - Целевой элемент canvas, в котором будет отрисовано превью.
 * @param { ImageDataType } imageData - Данные изображения, включая размеры, прозрачность и прочие свойства.
 * @param { number } [size=64] - Размер стороны превью в пикселях.
 *
 * @returns { void } Функция не возвращает значения.
 *
 * @example
 * drawPreviewToCanvas(layerPreviewCanvas, imageData, 80);
 */
export function drawPreviewToCanvas(
    canvas: HTMLCanvasElement,
    imageData: ImageDataType,
    size: number = 64,
) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size
    ctx.clearRect(0, 0, size, size)
    ctx.imageSmoothingEnabled = true

    if (imageData.deleted || imageData.visible === false) return

    const { raw, width, height } = toRGBA(imageData, { forceOpaque: true })
    const tmp = putRawToCanvas(raw, width, height)

    ctx.globalAlpha = imageData.opacity ?? 1
    ctx.drawImage(tmp, 0, 0, size, size)
    ctx.globalAlpha = 1
}
