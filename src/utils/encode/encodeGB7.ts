import { ImageDataType } from '../../types/ImageTypes'
import { toRGBA } from '../image/rgba'

const SIG = 0x4742371d
const VER = 0x01

type EncodeOpts = {
    forceOpaque?: boolean
}

const gray8to7 = (g8: number) =>
    Math.max(0, Math.min(127, Math.round((g8 * 127) / 255)))

const luma709 = (r: number, g: number, b: number) =>
    Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b)

/**
 * Кодирует слой изображения в формат GB7.
 *
 * GB7 — это 7-битные значения яркости (Y7) с опциональной 1-битной маской альфа-канала (A1).
 * Формат файла включает 12-байтный заголовок с сигнатурой, версией, флагом маски и размерами изображения.
 *
 * @param {ImageDataType} img — Исходный слой изображения.
 * @param {EncodeOpts} [opts] — Параметры кодирования.
 * @param {boolean} [opts.forceOpaque=false] — Если true, альфа-канал принудительно устанавливается как полностью непрозрачный.
 * @returns {ArrayBuffer} Бинарные данные изображения в формате GB7.
 *
 * @example
 * const buffer = encodeGB7(layer, { forceOpaque: true });
 * const blob = new Blob([buffer], { type: 'application/octet-stream' });
 * saveAs(blob, 'image.gb7');
 */
export function encodeGB7(
    img: ImageDataType,
    opts: EncodeOpts = {},
): ArrayBuffer {
    const { raw, width, height } = toRGBA(img, {
        forceOpaque: !!opts.forceOpaque,
    })
    const outPixels = new Uint8Array(width * height)

    let hasTransparent = false
    let hasOpaque = false

    for (let i = 0, p = 0; i < raw.length; i += 4, p++) {
        const r = raw[i],
            g = raw[i + 1],
            b = raw[i + 2],
            a = raw[i + 3]
        const g8 = luma709(r, g, b)
        const y7 = gray8to7(g8)
        const abit = a >= 128 ? 0x80 : 0x00
        if (abit) hasOpaque = true
        else hasTransparent = true
        outPixels[p] = (abit | (y7 & 0x7f)) >>> 0
    }

    const hasMask =
        hasTransparent || (!hasTransparent && !hasOpaque ? false : false)
    const flag = hasMask ? 0x01 : 0x00

    const header = new ArrayBuffer(12)
    const dv = new DataView(header)
    dv.setUint32(0, SIG)
    dv.setUint8(4, VER)
    dv.setUint8(5, flag)
    dv.setUint16(6, width, false)
    dv.setUint16(8, height, false)
    dv.setUint16(10, 0, false)

    const result = new Uint8Array(12 + outPixels.byteLength)
    result.set(new Uint8Array(header), 0)
    result.set(outPixels, 12)
    return result.buffer
}
