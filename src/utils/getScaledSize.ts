export function getScaledSize(
	originalWidth: number,
	originalHeight: number,
	scaleFactor: number = -1
): { width: number; height: number; scale: number } {
	if (scaleFactor === -1) {
		const maxWidth = Math.floor(window.innerWidth * 2 / 3);
		const maxHeight = Math.floor(window.innerHeight * 2 / 3);

		const scaleX = maxWidth / originalWidth;
		const scaleY = maxHeight / originalHeight;
		const scale = Math.min(1, scaleX, scaleY);

		return {
			width: Math.floor(originalWidth * scale),
			height: Math.floor(originalHeight * scale),
			scale,
		};
	} else {
		return {
			width: Math.floor(originalWidth * scaleFactor),
			height: Math.floor(originalHeight * scaleFactor),
			scale: scaleFactor,
		};
	}
}
