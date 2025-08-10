/**
 * Создаёт новый элемент canvas из массива пикселей RGBA.
 *
 * @param { Uint8ClampedArray } raw - Массив пикселей RGBA.
 * @param { number } w - Ширина изображения в пикселях.
 * @param { number } h - Высота изображения в пикселях.
 *
 * @returns { HTMLCanvasElement } Canvas с отрисованным изображением.
 *
 * @example
 * const canvas = putRawToCanvas(rawData, 200, 100);
 * document.body.appendChild(canvas);
 */
export function putRawToCanvas(raw: Uint8ClampedArray, w: number, h: number) {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h

    const ctx = c.getContext('2d')!

    const safe = new Uint8ClampedArray(raw)
    const img = new ImageData(safe, w, h)
    ctx.putImageData(img, 0, 0)

    return c
}

/**
 * Устанавливает размеры canvas и его CSS-стилей в пикселях.
 *
 * @param { HTMLCanvasElement } canvas - Целевой элемент canvas.
 * @param { number } w - Новая ширина canvas.
 * @param { number } h - Новая высота canvas.
 *
 * @returns { void } Функция не возвращает значения.
 *
 * @example
 * ensureCanvasSize(myCanvas, 800, 600);
 */
export function ensureCanvasSize(
    canvas: HTMLCanvasElement,
    w: number,
    h: number,
) {
    canvas.width = w
    canvas.height = h
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
}

/**
 * Отрисовывает содержимое одного canvas по центру другого canvas.
 * Поддерживает настройку прозрачности и режима наложения.
 *
 * @param { CanvasRenderingContext2D } ctx - Контекст отрисовки целевого canvas.
 * @param { HTMLCanvasElement } srcCanvas - Исходный canvas, который нужно отрисовать.
 * @param { number } targetW - Ширина целевой области отрисовки.
 * @param { number } targetH - Высота целевой области отрисовки.
 * @param { number } [opacity=1] - Прозрачность от 0 до 1.
 * @param { GlobalCompositeOperation } [blend='source-over'] - Режим наложения.
 *
 * @returns { { dx: number, dy: number } } Координаты смещения (dx, dy), в которых был отрисован srcCanvas.
 *
 * @example
 * const { dx, dy } = drawCentered(ctx, layerCanvas, mainCanvas.width, mainCanvas.height, 0.8, 'multiply');
 */
export function drawCentered(
    ctx: CanvasRenderingContext2D,
    srcCanvas: HTMLCanvasElement,
    targetW: number,
    targetH: number,
    opacity = 1,
    blend: GlobalCompositeOperation = 'source-over',
) {
    const dx = Math.floor((targetW - srcCanvas.width) / 2)
    const dy = Math.floor((targetH - srcCanvas.height) / 2)
    const prevAlpha = ctx.globalAlpha
    const prevComp = ctx.globalCompositeOperation
    ctx.globalAlpha = opacity
    ctx.globalCompositeOperation = blend
    ctx.drawImage(srcCanvas, dx, dy)
    ctx.globalAlpha = prevAlpha
    ctx.globalCompositeOperation = prevComp
    return { dx, dy }
}
