/**
 * Преобразует LUT-таблицу (Uint8Array или Uint8ClampedArray) в Uint8Array.
 * Если значение не задано или равно null, возвращает undefined.
 *
 * @param {Uint8Array | Uint8ClampedArray | null | undefined} lut - Исходный LUT.
 * @returns {Uint8Array | undefined} Новый Uint8Array или undefined.
 *
 * @example
 * const arr = asU8(lutClamped); // → Uint8Array
 * const none = asU8(null);      // → undefined
 */
export const asU8 = (lut?: Uint8Array | Uint8ClampedArray | null) =>
    lut ? new Uint8Array(lut) : undefined
