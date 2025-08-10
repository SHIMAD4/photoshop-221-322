import { ImageDataType } from '../../../types/ImageTypes'
import { putRawToCanvas } from '../../canvas/canvasHelpers'
import { toRGBA } from '../../image/rgba'

/**
 * Отрисовывает превью альфа-канала изображения в указанный canvas.
 * Используется для отображения только прозрачности (без цветовой информации).
 *
 * @param { HTMLCanvasElement } canvas - Целевой элемент canvas, в котором будет отображено превью альфа-канала.
 * @param { ImageDataType } imageData - Данные изображения, включая информацию о наличии альфа-канала.
 * @param { number } [size=64] - Размер стороны превью в пикселях.
 *
 * @returns { void } Функция не возвращает значения.
 *
 * @example
 * drawAlphaPreviewToCanvas(myCanvas, imageData, 128);
 */
export function drawAlphaPreviewToCanvas(
    canvas: HTMLCanvasElement,
    imageData: ImageDataType,
    size: number = 64,
) {
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size
    ctx.clearRect(0, 0, size, size)
    ctx.imageSmoothingEnabled = true

    if (
        imageData.deleted ||
        imageData.visible === false ||
        !imageData.hasAlpha
    ) {
        ctx.clearRect(0, 0, size, size)
        return
    }

    const { raw, width, height } = toRGBA(imageData, { mode: 'alphaOnly' })
    const tmp = putRawToCanvas(raw, width, height)

    ctx.drawImage(tmp, 0, 0, size, size)
}
