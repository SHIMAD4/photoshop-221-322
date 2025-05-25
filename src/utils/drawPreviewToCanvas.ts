import { ImageDataType } from "../types/ImageTypes";

export function drawPreviewToCanvas(
	canvas: HTMLCanvasElement,
	imageData: ImageDataType,
	size: number = 64
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	canvas.width = size;
	canvas.height = size;
	ctx.clearRect(0, 0, size, size);
	ctx.imageSmoothingEnabled = true;

	if (imageData.deleted || imageData.visible === false) return;

	if (imageData.format === "gb7" && imageData.pixels) {
		const { width, height, pixels } = imageData;
		const raw = new Uint8ClampedArray(width * height * 4);

		for (let i = 0; i < pixels.length; i++) {
			const byte = pixels[i];
			const gray7 = byte & 0b01111111;
			const gray8 = Math.floor((gray7 / 127) * 255);

			const idx = i * 4;
			raw[idx] = raw[idx + 1] = raw[idx + 2] = gray8;
			raw[idx + 3] = 255;
		}

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = width;
		tmpCanvas.height = height;
		const tmpCtx = tmpCanvas.getContext("2d")!;
		tmpCtx.putImageData(new ImageData(raw, width, height), 0, 0);

		ctx.globalAlpha = imageData.opacity ?? 1;
		ctx.drawImage(tmpCanvas, 0, 0, size, size);
		ctx.globalAlpha = 1;

		return;
	}

	if (imageData.imageData) {
		const { width, height, imageData: imgData } = imageData;
		const raw = new Uint8ClampedArray(imgData.data);

		for (let i = 0; i < raw.length; i += 4) {
			raw[i + 3] = 255;
		}

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = width;
		tmpCanvas.height = height;
		const tmpCtx = tmpCanvas.getContext("2d")!;
		tmpCtx.putImageData(new ImageData(raw, width, height), 0, 0);

		ctx.globalAlpha = imageData.opacity ?? 1;
		ctx.drawImage(tmpCanvas, 0, 0, size, size);
		ctx.globalAlpha = 1;

		return;
	}

	if (imageData.original) {
		ctx.globalAlpha = imageData.opacity ?? 1;
		ctx.drawImage(imageData.original, 0, 0, size, size);
		ctx.globalAlpha = 1;
	}
}
