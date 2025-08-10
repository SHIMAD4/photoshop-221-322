import { ImageDataType } from '../../types/ImageTypes'
import {
    drawCentered,
    ensureCanvasSize,
    putRawToCanvas,
} from '../canvas/canvasHelpers'
import { resizeRaw } from '../image/resize'
import { toRGBA } from '../image/rgba'
import { lastDrawState } from './drawImageToCanvas'

/**
 * Отрисовывает массив слоёв на указанный `<canvas>` с учётом масштаба,
 * порядка слоёв, прозрачности, режимов наложения и интерполяции.
 *
 * - Определяет размеры холста на основе базового слоя.
 * - Масштабирует и конвертирует каждый слой в RGBA буфер.
 * - Применяет режим наложения (`blendMode`) и прозрачность (`opacity`).
 * - Рисует слои по центру холста в порядке их следования.
 *
 * @param { HTMLCanvasElement } canvas - HTML-элемент `<canvas>`, на который будут рендериться слои.
 * @param { ImageDataType[] } layers - Массив слоёв изображения с параметрами отрисовки.
 * @param { number } [scaleFactor=1] - Коэффициент масштабирования, применяемый к слоям.
 * @param { number } [baseScale=1] - Базовый масштаб, общий для всех слоёв.
 * @param { 'nearest' | 'bilinear' } [interpolation='bilinear'] - Метод интерполяции при масштабировании.
 *
 * @returns { void }
 *
 * @example
 * renderLayersToCanvas(canvas, layers, 1.5, 1, 'nearest');
 */
export function renderLayersToCanvas(
    canvas: HTMLCanvasElement,
    layers: ImageDataType[],
    scaleFactor = 1,
    baseScale = 1,
    interpolation: 'nearest' | 'bilinear' = 'bilinear',
) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const baseLayer = layers.find((l) => !l.deleted)
    if (!baseLayer) return

    const effectiveScale = baseScale * scaleFactor
    const canvasWidth = Math.round(baseLayer.width * effectiveScale)
    const canvasHeight = Math.round(baseLayer.height * effectiveScale)

    ensureCanvasSize(canvas, canvasWidth, canvasHeight)
    lastDrawState.drawWidth = canvasWidth
    lastDrawState.drawHeight = canvasHeight
    lastDrawState.dx = 0
    lastDrawState.dy = 0

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.imageSmoothingEnabled = interpolation === 'bilinear'

    for (const layer of layers) {
        if (layer.deleted || layer.visible === false) continue

        const drawWidth = Math.round(layer.width * effectiveScale)
        const drawHeight = Math.round(layer.height * effectiveScale)

        const { raw, width, height } = toRGBA(layer, {
            forceOpaque: layer.alphaHidden || layer.alphaRemoved,
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

        const blend: GlobalCompositeOperation =
            layer.blendMode && layer.blendMode !== 'normal'
                ? (layer.blendMode as GlobalCompositeOperation)
                : 'source-over'

        drawCentered(
            ctx,
            srcCanvas,
            canvasWidth,
            canvasHeight,
            layer.opacity ?? 1,
            blend,
        )
    }
}
