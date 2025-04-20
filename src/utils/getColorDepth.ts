// Анализирует один пиксель в canvas, чтобы определить глубину цвета (24-bit или 32-bit).
export const getColorDepth = (ctx: CanvasRenderingContext2D): number => {
	const data = ctx.getImageData(0, 0, 1, 1).data;
	return data[3] < 255 ? 32 : 24;
};