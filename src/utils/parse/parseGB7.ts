/**
 * Структура изображения в формате GB7.
 *
 * @typedef {Object} GB7Image
 * @property { number } width - Ширина изображения в пикселях.
 * @property { number } height - Высота изображения в пикселях.
 * @property { boolean } hasMask - Признак наличия маски (альфа-канала).
 * @property { Uint8Array } pixels - Массив пиксельных данных (7-битные значения серого, при необходимости с маской).
 */
export type GB7Image = {
    width: number
    height: number
    hasMask: boolean
    pixels: Uint8Array
}

/**
 * Читает и парсит изображение в формате GB7 из бинарного буфера.
 * Проверяет сигнатуру, версию формата и наличие маски, затем возвращает объект с данными изображения.
 *
 * @param { ArrayBuffer } buffer - Буфер с бинарными данными GB7-файла.
 *
 * @returns { GB7Image } Объект с шириной, высотой, признаком маски и массивом пиксельных данных (width, height, hasMask, pixels).
 *
 * @throws { Error } Если сигнатура файла или версия формата не соответствуют ожидаемым.
 *
 * @example
 * const gb7Data = parseGB7(arrayBuffer);
 * console.log(gb7Data.width, gb7Data.height, gb7Data.hasMask);
 */
export function parseGB7(buffer: ArrayBuffer): GB7Image {
    const view = new DataView(buffer)

    // 0x47 (G) 0x42 (B) 0x37 (7) 0x1D (управляющий символ-разделитель групп)
    // 0x47 42 37 1d
    if (view.getUint32(0) !== 0x4742371d)
        throw new Error('Неверная сигнатура GB7')

    // Текущая версия === 0x01
    if (view.getUint8(4) !== 0x01) throw new Error('Неподдерживаемая версия')

    // Флаг маски
    const flag = view.getUint8(5)
    const hasMask = (flag & 1) === 1

    const width = view.getUint16(6, false)
    const height = view.getUint16(8, false)
    const pixelData = new Uint8Array(buffer.slice(12))

    return { width, height, hasMask, pixels: pixelData }
}
