import { ImageDataType } from '../../types/ImageTypes'
import { toRGBA } from '../image/rgba'

/**
 * Приводит слой изображения к объекту {@link ImageData}, учитывая настройки альфа-канала.
 *
 * - Если формат слоя **не GB7** и альфа-канал не скрыт (`alphaHidden`) и не удалён (`alphaRemoved`),
 *   возвращает оригинальный `imageData`, если он есть.
 * - В остальных случаях использует {@link toRGBA} для получения RGBA-буфера
 *   и создаёт новый объект `ImageData`.
 *
 * @param {ImageDataType} img — Данные слоя (изображение, цветной слой или GB7).
 * @returns {ImageData} Объект `ImageData` для рендеринга в canvas.
 *
 * @example
 * const imageData = toImageData(layer);
 * ctx.putImageData(imageData, 0, 0);
 */
export function toImageData(img: ImageDataType): ImageData {
    if (
        img.imageData &&
        img.format !== 'gb7' &&
        !img.alphaHidden &&
        !img.alphaRemoved
    ) {
        return img.imageData
    }
    const { raw, width, height } = toRGBA(img)
    return new ImageData(raw, width, height)
}

/**
 * Приводит слой изображения к объекту {@link ImageData} в режиме "только альфа".
 *
 * - Использует {@link toRGBA} с опцией `mode: 'alphaOnly'`, чтобы преобразовать альфа-канал
 *   в оттенки серого (0–255), где белый = полностью видимый пиксель, чёрный = прозрачный.
 * - Игнорирует цветовые данные слоя.
 *
 * @param {ImageDataType} img — Данные слоя (изображение, цветной слой или GB7).
 * @returns {ImageData} Объект `ImageData`, содержащий только альфа-канал в серых тонах.
 *
 * @example
 * const alphaImageData = toAlphaImageData(layer);
 * ctx.putImageData(alphaImageData, 0, 0);
 */
export function toAlphaImageData(img: ImageDataType): ImageData {
    const { raw, width, height } = toRGBA(img, { mode: 'alphaOnly' })
    return new ImageData(raw, width, height)
}
