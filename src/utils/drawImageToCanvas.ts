import { ImageDataType } from "../types/ImageTypes";
import { getScaledSize } from "../utils/getScaledSize";

export function drawImageToCanvas(
	canvas: HTMLCanvasElement,
	imageData: ImageDataType,
	original?: HTMLImageElement
) {
	const ctx = canvas.getContext("2d");

	if (!ctx) return;

	const { width, height } = getScaledSize(imageData.width, imageData.height);

	canvas.width = width;
	canvas.height = height;

	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;

	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, width, height);

	if (imageData.format === "gb7" && imageData.pixels) {
		const tmpCanvas = document.createElement("canvas");

		tmpCanvas.width = imageData.width;
		tmpCanvas.height = imageData.height;

		const tmpCtx = tmpCanvas.getContext("2d");

		if (!tmpCtx) return;

		const imgData = tmpCtx.createImageData(imageData.width, imageData.height);

		const hasMask = imageData.depth === 8;

		for (let i = 0; i < imageData.pixels.length; i++) {
			const byte = imageData.pixels[i];
			const gray7 = byte & 0b01111111;
			const gray8 = Math.floor((gray7 / 127) * 255);
			let alpha = 255;

			if (hasMask) alpha = (byte & 0b10000000) ? 255 : 0;

			const idx = i * 4;
			imgData.data[idx] = gray8;      // R
			imgData.data[idx + 1] = gray8;	// G
			imgData.data[idx + 2] = gray8;  // B
			imgData.data[idx + 3] = alpha;  // A
		}

		tmpCtx.putImageData(imgData, 0, 0);
		ctx.drawImage(tmpCanvas, 0, 0, width, height);
	} else if (original) {
		ctx.drawImage(original, 0, 0, width, height);
	}
}
