/**
 * Определяет глубину цвета изображения на canvas, анализируя один пиксель.
 * Возвращает 24, если альфа-канал отсутствует или полностью непрозрачный,
 * и 32, если альфа-канал присутствует и содержит прозрачность.
 *
 * @param { CanvasRenderingContext2D } ctx - Контекст 2D отрисовки canvas, из которого берутся данные пикселя.
 *
 * @returns { number } Глубина цвета: 24 или 32 бита.
 *
 * @example
 * const depth = getColorDepth(ctx);
 * console.log(`Глубина цвета: ${depth}-bit`);
 */
export const getColorDepth = (ctx: CanvasRenderingContext2D): number => {
    const data = ctx.getImageData(0, 0, 1, 1).data
    return data[3] < 255 ? 32 : 24
}
