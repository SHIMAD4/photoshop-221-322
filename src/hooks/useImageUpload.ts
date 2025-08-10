import { useCallback } from 'react'
import { ImageDataType } from '../types/ImageTypes'
import { parseImage } from '../utils/parse/parseImage'
import { drawImageToCanvas } from '../utils/render/drawImageToCanvas'

/**
 * Хук для загрузки изображения в указанный canvas по его ID.
 * Парсит файл изображения (включая формат GB7), при необходимости создаёт HTMLImageElement
 * и отрисовывает результат на canvas. Вызывает колбэк `onChange` при успешной загрузке.
 *
 * @param { string } canvasId - ID элемента canvas, в который будет загружено изображение.
 * @param { (data: ImageDataType) => void } [onChange] - Необязательный колбэк, вызываемый после успешной загрузки изображения с данными изображения.
 *
 * @returns { { handleUpload: (file: File) => Promise<void> } } Объект с функцией `handleUpload`, принимающей файл для загрузки.
 *
 * @example
 * const { handleUpload } = useImageUpload('imageCanvas', (data) => console.log(data));
 * // Загрузка файла:
 * inputElement.onchange = (e) => handleUpload(e.target.files[0]);
 */
export const useImageUpload = (
    canvasId: string,
    onChange?: (data: ImageDataType) => void,
) => {
    const handleUpload = useCallback(
        async (file: File) => {
            const imageData = await parseImage(file)

            const canvas = document.getElementById(
                canvasId,
            ) as HTMLCanvasElement | null

            if (!canvas) return

            let imgTag: HTMLImageElement | undefined

            if (imageData.format !== 'gb7') {
                imgTag = document.createElement('img')

                imgTag.src = URL.createObjectURL(file)

                await new Promise((resolve) => {
                    imgTag!.onload = resolve
                })
            }

            drawImageToCanvas(canvas, imageData, 1, 'bilinear', 1)

            onChange?.(imageData)
        },
        [canvasId, onChange],
    )

    return { handleUpload }
}
