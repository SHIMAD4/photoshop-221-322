// Универсальная утилита масштабирования.
// Возвращает размеры с сохранением пропорций, чтобы вписать изображение в 2/3 ширины/высоты экрана.
export function getScaledSize(
	originalWidth: number,
	originalHeight: number,
	scaleFactor: number = 2 / 3
): { width: number; height: number; scale: number } {
	const maxWidth = Math.floor(window.innerWidth * scaleFactor);
	const maxHeight = Math.floor(window.innerHeight * scaleFactor);

	const scaleX = maxWidth / originalWidth;
	const scaleY = maxHeight / originalHeight;
	const scale = Math.min(1, scaleX, scaleY);

	return {
		width: Math.floor(originalWidth * scale),
		height: Math.floor(originalHeight * scale),
		scale,
	};
}