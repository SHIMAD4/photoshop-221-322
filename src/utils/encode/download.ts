/**
 * Скачивает бинарные данные (Blob) как файл с заданным именем.
 *
 * - Создаёт временный URL для объекта `Blob` с помощью `URL.createObjectURL`.
 * - Инициирует скачивание файла через скрытую ссылку `<a>`.
 * - После завершения скачивания освобождает URL через `URL.revokeObjectURL`.
 *
 * @param { Blob } blob - Бинарные данные для скачивания.
 * @param { string } filename - Имя файла (с расширением), под которым будет сохранён файл.
 *
 * @example
 * // Сохранение canvas в PNG
 * const blob = await new Promise<Blob>(res => canvas.toBlob(res, 'image/png')!);
 * downloadBlob(blob, 'image.png');
 */
export function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

/**
 * Скачивает данные изображения, переданные в виде Data URL (base64), как файл.
 *
 * - Использует встроенный механизм браузера для скачивания ссылок `<a>` с атрибутом `download`.
 * - Подходит для сохранения изображений и других файлов, кодированных в формате Data URL.
 *
 * @param { string } dataUrl - Строка в формате Data URL (например, `"data:image/png;base64,..."`).
 * @param { string } filename - Имя файла (с расширением), под которым будет сохранён файл.
 *
 * @example
 * // Сохранение dataURL как JPEG
 * const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
 * downloadDataUrl(dataUrl, 'photo.jpg');
 */
export function downloadDataUrl(dataUrl: string, filename: string) {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
}
