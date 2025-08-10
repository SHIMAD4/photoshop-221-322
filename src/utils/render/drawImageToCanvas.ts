import { ImageDataType } from '../../types/ImageTypes'
import {
    drawCentered,
    ensureCanvasSize,
    putRawToCanvas,
} from '../canvas/canvasHelpers'
import { resizeRaw } from '../image/resize'
import { toRGBA } from '../image/rgba'

export const lastDrawState = {
    dx: 0,
    dy: 0,
    drawWidth: 0,
    drawHeight: 0,
}

/**
 * Отрисовывает изображение в указанный canvas с учётом масштаба, интерполяции и прозрачности.
 * Центрирует изображение в пределах canvas и сохраняет координаты последнего рисунка в `lastDrawState`.
 *
 * @param { HTMLCanvasElement } canvas - Целевой элемент canvas для отрисовки изображения.
 * @param { ImageDataType } imageData - Данные изображения, включая размеры, глубину цвета, альфа-канал и другие свойства.
 * @param { number } [scaleFactor=1] - Дополнительный коэффициент масштабирования изображения.
 * @param { 'nearest' | 'bilinear' } [interpolation='bilinear'] - Алгоритм интерполяции при масштабировании:
 *        "nearest" — ближайший сосед (быстро, но могут быть артефакты),
 *        "bilinear" — билинейная интерполяция (лучшее качество, но медленнее).
 * @param { number } [baseScale=1] - Базовый коэффициент масштабирования, например, для подгонки изображения под окно.
 *
 * @returns { void } Функция не возвращает значения.
 *
 * @example
 * drawImageToCanvas(canvasRef.current, imageData, 1.5, 'bilinear', fitScale);
 */
export function drawImageToCanvas(
    canvas: HTMLCanvasElement,
    imageData: ImageDataType,
    scaleFactor: number = 1,
    interpolation: 'nearest' | 'bilinear' = 'bilinear',
    baseScale: number = 1,
) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    if (imageData.deleted || imageData.visible === false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
    }

    const effectiveScale = baseScale * scaleFactor
    const drawWidth = Math.round(imageData.width * effectiveScale)
    const drawHeight = Math.round(imageData.height * effectiveScale)

    const canvasWidth = Math.max(drawWidth, window.innerWidth)
    const canvasHeight = Math.max(drawHeight, window.innerHeight - 120)
    ensureCanvasSize(canvas, canvasWidth, canvasHeight)

    ctx.imageSmoothingEnabled = interpolation === 'bilinear'
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const { raw, width, height } = toRGBA(imageData, {
        forceOpaque: imageData.alphaHidden || imageData.alphaRemoved,
    })
    const scaled = resizeRaw(
        raw,
        width,
        height,
        drawWidth,
        drawHeight,
        interpolation,
    )
    const srcCanvas = putRawToCanvas(scaled, drawWidth, drawHeight)

    const { dx, dy } = drawCentered(
        ctx,
        srcCanvas,
        canvasWidth,
        canvasHeight,
        imageData.opacity ?? 1,
        'source-over',
    )

    lastDrawState.drawWidth = drawWidth
    lastDrawState.drawHeight = drawHeight
    lastDrawState.dx = dx
    lastDrawState.dy = dy
}
