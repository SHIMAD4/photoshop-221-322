import { ImageDataType } from "../types/ImageTypes";

export function drawAlphaPreviewToCanvas(
	canvas: HTMLCanvasElement,
	imageData: ImageDataType,
	size: number = 64
) {
    if (!canvas) return;
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	canvas.width = size;
	canvas.height = size;
	ctx.clearRect(0, 0, size, size);
	ctx.imageSmoothingEnabled = true;

	if (
		imageData.deleted ||
		imageData.visible === false ||
		!imageData.hasAlpha
	) {
        ctx.clearRect(0, 0, size, size);
		return;
	}

	if (imageData.format === "gb7" && imageData.pixels && imageData.hasAlpha) {
		const { width, height, pixels } = imageData;
		const raw = new Uint8ClampedArray(width * height * 4);

		for (let i = 0; i < pixels.length; i++) {
			const alpha = (pixels[i] & 0b10000000) ? 255 : 0;
			const idx = i * 4;
			raw[idx] = raw[idx + 1] = raw[idx + 2] = alpha;
			raw[idx + 3] = 255;
		}

		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = width;
		tempCanvas.height = height;
		const tmpCtx = tempCanvas.getContext("2d")!;
		tmpCtx.putImageData(new ImageData(raw, width, height), 0, 0);

		ctx.drawImage(tempCanvas, 0, 0, size, size);
		return;
	}

	if (imageData.imageData && imageData.hasAlpha) {
		const { width, height, imageData: imgData } = imageData;
		const raw = new Uint8ClampedArray(width * height * 4);

		for (let i = 0; i < imgData.data.length; i += 4) {
			const alpha = imgData.data[i + 3];
			raw[i] = raw[i + 1] = raw[i + 2] = alpha;
			raw[i + 3] = 255;
		}

		const tempCanvas = document.createElement("canvas");
		tempCanvas.width = width;
		tempCanvas.height = height;
		const tmpCtx = tempCanvas.getContext("2d")!;
		tmpCtx.putImageData(new ImageData(raw, width, height), 0, 0);

		ctx.drawImage(tempCanvas, 0, 0, size, size);
	}
}
