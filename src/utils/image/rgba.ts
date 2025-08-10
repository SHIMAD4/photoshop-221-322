import { ImageDataType } from '../../types/ImageTypes'

export type ToRGBAOpts = {
    mode?: 'color' | 'alphaOnly'
    forceOpaque?: boolean
}

/**
 * Преобразует различные форматы изображения в универсальный RGBA-буфер.
 *
 * Поддерживает:
 * - Цветные слои (`type: "color"`) — заливает слой указанным цветом.
 * - Формат GB7 — конвертирует 7-битную яркость (и опциональную маску) в 8-битный RGB(A).
 * - PNG/JPEG (`imageData`) — копирует или модифицирует альфа-канал.
 * - Оригинальные HTMLImageElement (`original`) — рендерит и извлекает пиксели.
 *
 * Также может:
 * - Извлекать только альфа-канал (`mode: "alphaOnly"`).
 * - Принудительно делать изображение непрозрачным (`forceOpaque`).
 *
 * @param { ImageDataType } img - Объект с данными изображения, включая формат, размеры и пиксели.
 * @param { ToRGBAOpts } [opts={}] - Опции конвертации.
 * @param { 'color' | 'alphaOnly' } [opts.mode='color'] - Режим конвертации:
 *   - `"color"` — цветное изображение.
 *   - `"alphaOnly"` — одноканальное изображение альфа-канала в виде оттенков серого.
 * @param { boolean } [opts.forceOpaque=false] - Принудительно устанавливать альфу = 255 для всех пикселей.
 *
 * @returns {{ raw: Uint8ClampedArray, width: number, height: number }}
 *   Объект с RGBA-буфером (`raw`) и размерами (`width`, `height`).
 *
 * @example
 * const { raw, width, height } = toRGBA(imageData, { mode: 'alphaOnly', forceOpaque: true });
 */
export function toRGBA(img: ImageDataType, opts: ToRGBAOpts = {}) {
    const mode = opts.mode ?? 'color'
    const width = img.width
    const height = img.height
    const raw = new Uint8ClampedArray(width * height * 4)

    // Цветной слой
    if (img.type === 'color' && img.color) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')!
        ctx.fillStyle = img.color
        ctx.fillRect(0, 0, width, height)
        const d = ctx.getImageData(0, 0, width, height).data
        raw.set(d)
    }
    // GB7
    else if (img.format === 'gb7' && img.pixels) {
        const hasMask = !!img.hasAlpha
        for (let i = 0; i < img.pixels.length; i++) {
            const byte = img.pixels[i]
            const gray7 = byte & 0b01111111
            const gray8 = Math.floor((gray7 / 127) * 255)
            const idx = i * 4
            if (mode === 'alphaOnly') {
                const a = hasMask ? (byte & 0b10000000 ? 255 : 0) : 255
                raw[idx] = raw[idx + 1] = raw[idx + 2] = a
                raw[idx + 3] = 255
            } else {
                raw[idx] = raw[idx + 1] = raw[idx + 2] = gray8
                let a = 255
                if (hasMask) a = byte & 0b10000000 ? 255 : 0
                if (img.alphaHidden || img.alphaRemoved || opts.forceOpaque)
                    a = 255
                raw[idx + 3] = a
            }
        }
    }
    // Обычные PNG/JPEG
    else if (img.imageData) {
        const src = new Uint8ClampedArray(img.imageData.data)
        if (mode === 'alphaOnly') {
            for (let i = 0; i < src.length; i += 4) {
                const a = src[i + 3]
                raw[i] = raw[i + 1] = raw[i + 2] = a
                raw[i + 3] = 255
            }
        } else {
            if (img.alphaHidden || img.alphaRemoved || opts.forceOpaque) {
                for (let i = 0; i < src.length; i += 4) src[i + 3] = 255
            }
            raw.set(src)
        }
    }
    // Фоллбек — original <img>
    else if (img.original) {
        const c = document.createElement('canvas')
        c.width = width
        c.height = height
        const ctx = c.getContext('2d')!
        ctx.drawImage(img.original, 0, 0, width, height)
        const d = ctx.getImageData(0, 0, width, height).data
        if (mode === 'alphaOnly') {
            for (let i = 0; i < d.length; i += 4) {
                const a = d[i + 3]
                raw[i] = raw[i + 1] = raw[i + 2] = a
                raw[i + 3] = 255
            }
        } else {
            if (opts.forceOpaque) {
                for (let i = 0; i < d.length; i += 4) d[i + 3] = 255
            }
            raw.set(d)
        }
    }

    return { raw, width, height }
}
