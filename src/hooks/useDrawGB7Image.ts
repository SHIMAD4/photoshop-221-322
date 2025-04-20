import { useCallback } from "react";
import { getScaledSize } from "../utils/getScaledSize";
import { GB7Image } from "../utils/parseGB7";

// Универсальный рендерер для GB7-файлов — рисует в <canvas>, масштабирует, накладывает пиксели.
export const useDrawGB7Image = () => {
	return useCallback((canvas: HTMLCanvasElement, image: GB7Image) => {
		const originalWidth = image.width;
		const originalHeight = image.height;

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = originalWidth;
		tmpCanvas.height = originalHeight;

		const tmpCtx = tmpCanvas.getContext("2d");
		if (!tmpCtx) return;

		const imgData = tmpCtx.createImageData(originalWidth, originalHeight);
		for (let i = 0; i < image.pixels.length; i++) {
			const byte = image.pixels[i];
			const gray = byte & 0b01111111;
			const alpha = image.hasMask ? ((byte & 0b10000000) ? 255 : 0) : 255;

			const idx = i * 4;
			imgData.data[idx] = gray;
			imgData.data[idx + 1] = gray;
			imgData.data[idx + 2] = gray;
			imgData.data[idx + 3] = alpha;
		}
		tmpCtx.putImageData(imgData, 0, 0);

		const { width, height } = getScaledSize(originalWidth, originalHeight);

		canvas.width = width;
		canvas.height = height;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(tmpCanvas, 0, 0, width, height);
	}, []);
};
