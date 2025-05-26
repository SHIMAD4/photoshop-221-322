import { ImageDataType } from "../types/ImageTypes";
import { scaleImageBilinear, scaleImageNearest } from "./interpolation";

export const lastDrawState = {
	dx: 0,
	dy: 0,
	drawWidth: 0,
	drawHeight: 0,
};

export function drawImageToCanvas(
	canvas: HTMLCanvasElement,
	imageData: ImageDataType,
	original?: HTMLImageElement,
	scaleFactor: number = 1,
	interpolation: 'nearest' | 'bilinear' = 'bilinear',
	baseScale: number = 1
) {
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return;


	if (imageData.deleted || imageData.visible === false) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		return;
	}

	const effectiveScale = baseScale * scaleFactor;
	const drawWidth = Math.round(imageData.width * effectiveScale);
	const drawHeight = Math.round(imageData.height * effectiveScale);

	const canvasWidth = Math.max(drawWidth, window.innerWidth);
	const canvasHeight = Math.max(drawHeight, window.innerHeight - 120);

	const dx = Math.floor((canvasWidth - drawWidth) / 2);
	const dy = Math.floor((canvasHeight - drawHeight) / 2);

	lastDrawState.drawWidth = drawWidth;
	lastDrawState.drawHeight = drawHeight;
	lastDrawState.dx = dx;
	lastDrawState.dy = dy;

	console.log(lastDrawState)

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvas.style.width = `${canvasWidth}px`;
	canvas.style.height = `${canvasHeight}px`;

	ctx.imageSmoothingEnabled = interpolation === 'bilinear';
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	if (imageData.format === "gb7" && imageData.pixels) {
		const { width, height, pixels, depth } = imageData;
		const hasMask = depth === 8;

		const raw = new Uint8ClampedArray(width * height * 4);
		for (let i = 0; i < pixels.length; i++) {
			const byte = pixels[i];
			const gray7 = byte & 0b01111111;
			const gray8 = Math.floor((gray7 / 127) * 255);

			let alpha = 255;
			if (hasMask) alpha = (byte & 0b10000000) ? 255 : 0;
			if (imageData.alphaHidden || imageData.alphaRemoved) alpha = 255;

			const idx = i * 4;
			raw[idx] = raw[idx + 1] = raw[idx + 2] = gray8;
			raw[idx + 3] = alpha;
		}

		const scaledPixels =
			interpolation === 'nearest'
				? scaleImageNearest(raw, width, height, drawWidth, drawHeight)
				: scaleImageBilinear(raw, width, height, drawWidth, drawHeight);

		const imgData = new ImageData(scaledPixels, drawWidth, drawHeight);

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = drawWidth;
		tmpCanvas.height = drawHeight;
		const tmpCtx = tmpCanvas.getContext("2d")!;
		tmpCtx.putImageData(imgData, 0, 0);

		ctx.globalAlpha = imageData.opacity ?? 1;
		ctx.drawImage(tmpCanvas, dx, dy);
		ctx.globalAlpha = 1;

		return;
	}

	if (imageData.imageData) {
		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = imageData.width;
		tmpCanvas.height = imageData.height;
		const tmpCtx = tmpCanvas.getContext("2d")!;

		const raw = new Uint8ClampedArray(imageData.imageData.data);
		if (imageData.alphaHidden || imageData.alphaRemoved) {
			for (let i = 0; i < raw.length; i += 4) {
				raw[i + 3] = 255;
			}
		}

		const img = new ImageData(raw, imageData.width, imageData.height);
		tmpCtx.putImageData(img, 0, 0);

		ctx.globalAlpha = imageData.opacity ?? 1;
		ctx.drawImage(tmpCanvas, dx, dy, drawWidth, drawHeight);
		ctx.globalAlpha = 1;

		return;
	}

	if (original) {
		ctx.globalAlpha = imageData.opacity ?? 1;
		ctx.drawImage(original, dx, dy, drawWidth, drawHeight);
		ctx.globalAlpha = 1;
	}
}
