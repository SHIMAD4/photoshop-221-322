import { ImageDataType } from '../../types/ImageTypes'
import { getColorDepth } from '../canvas/getColorDepth'
import { parseGB7 } from './parseGB7'

/**
 * Парсит файл изображения в поддерживаемых форматах (GB7, PNG, JPEG) и возвращает
 * объект с данными изображения в формате {@link ImageDataType}.
 *
 * - Для GB7 используется парсер {@link parseGB7}, определяющий ширину, высоту, наличие маски и глубину цвета.
 * - Для PNG и JPEG изображение загружается в временный `<canvas>`, откуда извлекаются пиксельные данные.
 *
 * @async
 *
 * @param { File } file - Файл изображения для парсинга.
 *
 * @returns { Promise<ImageDataType> } Объект с описанием изображения, включая размеры, глубину цвета, формат, пиксели и другие метаданные.
 *
 * @throws { Error } Если формат файла не поддерживается или произошла ошибка при чтении/отрисовке.
 *
 * @example
 * const imgData = await parseImage(file);
 * console.log(imgData.width, imgData.height, imgData.format);
 */
export async function parseImage(file: File): Promise<ImageDataType> {
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (ext === 'gb7') {
        const buffer = await file.arrayBuffer()
        const gb7 = parseGB7(buffer)

        return {
            width: gb7.width,
            height: gb7.height,
            depth: gb7.hasMask ? 8 : 7,
            format: 'gb7',
            pixels: gb7.pixels,
            hasAlpha: gb7.hasMask,
        }
    } else {
        const img = document.createElement('img')

        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = () => {
                if (typeof reader.result !== 'string') reject()
                else resolve(reader.result as string)
            }

            reader.readAsDataURL(file)
        })

        img.src = dataUrl

        await new Promise<void>((resolve) => {
            img.onload = () => resolve()
        })

        const tmpCanvas = document.createElement('canvas')
        tmpCanvas.width = img.width
        tmpCanvas.height = img.height

        const ctx = tmpCanvas.getContext('2d')

        if (!ctx) throw new Error('Canvas context error')

        ctx.drawImage(img, 0, 0)

        const depth = getColorDepth(ctx)

        const imageDataRaw = ctx.getImageData(0, 0, img.width, img.height)

        return {
            width: img.width,
            height: img.height,
            depth,
            format: ext === 'png' ? 'png' : 'jpeg',
            original: img,
            imageData: imageDataRaw,
            hasAlpha: depth === 32,
        }
    }
}
