/**
 * Вычисляет размеры изображения после масштабирования.
 * Если `scaleFactor` равен -1, размеры подбираются так, чтобы изображение
 * занимало не более 2/3 ширины и высоты окна браузера, но не увеличивалось сверх оригинала.
 * Если `scaleFactor` задан, размеры масштабируются напрямую по этому коэффициенту.
 *
 * @param { number } originalWidth - Исходная ширина изображения.
 * @param { number } originalHeight - Исходная высота изображения.
 * @param { number } [scaleFactor=-1] - Коэффициент масштабирования (-1 — автоматический расчёт).
 *
 * @returns { { width: number, height: number, scale: number } } Новый размер изображения и применённый коэффициент масштабирования.
 *
 * @example
 * // Автоматический расчёт под размеры окна
 * const autoSize = getScaledSize(1920, 1080);
 *
 * // Прямое масштабирование в 50%
 * const halfSize = getScaledSize(1920, 1080, 0.5);
 */
export function getScaledSize(
    originalWidth: number,
    originalHeight: number,
    scaleFactor: number = -1,
): { width: number; height: number; scale: number } {
    if (scaleFactor === -1) {
        const maxWidth = Math.floor((window.innerWidth * 2) / 3)
        const maxHeight = Math.floor((window.innerHeight * 2) / 3)

        const scaleX = maxWidth / originalWidth
        const scaleY = maxHeight / originalHeight
        const scale = Math.min(1, scaleX, scaleY)

        return {
            width: Math.floor(originalWidth * scale),
            height: Math.floor(originalHeight * scale),
            scale,
        }
    } else {
        return {
            width: Math.floor(originalWidth * scaleFactor),
            height: Math.floor(originalHeight * scaleFactor),
            scale: scaleFactor,
        }
    }
}
