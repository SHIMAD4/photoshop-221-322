/**
 * 3×3 ядро свёртки. Divisor вычисляется как сумма элементов, если не задан, а bias — смещение (обычно 0).
 */
export type Kernel3x3 = {
    /** Массив коэффициентов 3×3, применяемых к пикселям */
    m: [number, number, number, number, number, number, number, number, number]
    /** Делитель результата свёртки. Если не задан — вычисляется как сумма коэффициентов (или 1, если сумма 0) */
    divisor?: number
    /** Смещение (bias), добавляемое к результату свёртки */
    bias?: number
}

type PixelGetter = (x: number, y: number, c: number) => number

/**
 * Создаёт функцию выборки пикселя с расширением краёв (extend/clamp-to-edge).
 *
 * @param src - Исходный массив пикселей в формате RGBA
 * @param w - Ширина изображения
 * @param h - Высота изображения
 * @returns Функция, возвращающая значение указанного канала пикселя с координатами (x, y),
 *          при выходе за границы берётся ближайший допустимый пиксель.
 */
function sampleExtend(
    src: Uint8ClampedArray,
    w: number,
    h: number,
): PixelGetter {
    return (x, y, c) => {
        const xx = x < 0 ? 0 : x >= w ? w - 1 : x
        const yy = y < 0 ? 0 : y >= h ? h - 1 : y
        const i = (yy * w + xx) * 4 + c
        return src[i]
    }
}

function clamp8(v: number) {
    return v < 0 ? 0 : v > 255 ? 255 : v | 0
}

/**
 * Применяет 3×3 ядро к одному каналу (R/G/B/A) RGBA-буфера.
 * Использует расширение краёв (extend), поэтому размер изображения не меняется.
 *
 * @param src - Исходный массив пикселей RGBA
 * @param w - Ширина изображения
 * @param h - Высота изображения
 * @param channelIndex - Индекс канала (0=R, 1=G, 2=B, 3=A)
 * @param kernel - Параметры ядра 3×3
 * @returns Новый массив пикселей RGBA с применённым фильтром только к указанному каналу
 */
export function convolveChannel3x3(
    src: Uint8ClampedArray,
    w: number,
    h: number,
    channelIndex: 0 | 1 | 2 | 3,
    kernel: Kernel3x3,
): Uint8ClampedArray {
    const out = new Uint8ClampedArray(src.length)
    out.set(src)

    const get = sampleExtend(src, w, h)
    const { m } = kernel
    const divisor =
        typeof kernel.divisor === 'number'
            ? kernel.divisor
            : m.reduce((s, v) => s + v, 0) || 1
    const bias = kernel.bias ?? 0

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let acc = 0
            // 3×3 окно
            acc += get(x - 1, y - 1, channelIndex) * m[0]
            acc += get(x + 0, y - 1, channelIndex) * m[1]
            acc += get(x + 1, y - 1, channelIndex) * m[2]
            acc += get(x - 1, y + 0, channelIndex) * m[3]
            acc += get(x + 0, y + 0, channelIndex) * m[4]
            acc += get(x + 1, y + 0, channelIndex) * m[5]
            acc += get(x - 1, y + 1, channelIndex) * m[6]
            acc += get(x + 0, y + 1, channelIndex) * m[7]
            acc += get(x + 1, y + 1, channelIndex) * m[8]

            const v = acc / divisor + bias
            const i = (y * w + x) * 4 + channelIndex
            out[i] = clamp8(v)
        }
    }
    return out
}

/**
 * Применяет 3×3 ядро к RGB-каналам изображения.
 * Альфа-канал не изменяется.
 *
 * @param imageData - Исходные данные изображения
 * @param kernel - Параметры ядра 3×3
 * @returns Новый объект ImageData с применённым фильтром
 */
export function convolveRGB3x3(
    imageData: ImageData,
    kernel: Kernel3x3,
): ImageData {
    const { data, width, height } = imageData
    const r = convolveChannel3x3(data, width, height, 0, kernel)
    const rg = convolveChannel3x3(r, width, height, 1, kernel)
    const rgba = convolveChannel3x3(rg, width, height, 2, kernel)
    const out = new ImageData(width, height)
    out.data.set(rgba)
    return out
}

/**
 * Применяет 3×3 ядро только к альфа-каналу изображения.
 * Цветовые каналы остаются неизменными.
 *
 * @param imageData - Исходные данные изображения
 * @param kernel - Параметры ядра 3×3
 * @returns Новый объект ImageData с изменённым альфа-каналом
 */
export function convolveAlpha3x3(
    imageData: ImageData,
    kernel: Kernel3x3,
): ImageData {
    const { data, width, height } = imageData
    const a = convolveChannel3x3(data, width, height, 3, kernel)
    const out = new ImageData(width, height)
    out.data.set(a)
    return out
}

/**
 * Набор готовых пресетов 3×3 ядер свёртки.
 */
export const KERNEL_PRESETS: Record<
    'identity' | 'sharpen' | 'gauss3' | 'box' | 'prewittX' | 'prewittY',
    Kernel3x3
> = {
    identity: { m: [0, 0, 0, 0, 1, 0, 0, 0, 0] },
    sharpen: { m: [0, -1, 0, -1, 5, -1, 0, -1, 0] },
    gauss3: { m: [1, 2, 1, 2, 4, 2, 1, 2, 1], divisor: 16 },
    box: { m: [1, 1, 1, 1, 1, 1, 1, 1, 1], divisor: 9 },
    prewittX: { m: [-1, 0, 1, -1, 0, 1, -1, 0, 1], divisor: 1, bias: 128 }, // для видимости смещаем к среднему
    prewittY: { m: [-1, -1, -1, 0, 0, 0, 1, 1, 1], divisor: 1, bias: 128 },
}
