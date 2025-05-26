import { ImageDataType } from "../types/ImageTypes";
import { lastDrawState } from "./drawImageToCanvas";

export function renderLayersToCanvas(
	canvas: HTMLCanvasElement,
	layers: ImageDataType[],
	scaleFactor = 1,
	baseScale = 1,
	interpolation: "nearest" | "bilinear" = "bilinear"
) {
	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return;

	const baseLayer = layers.find(l => !l.deleted);
	if (!baseLayer) return;

	const effectiveScale = baseScale * scaleFactor;
	const canvasWidth = Math.round(baseLayer.width * effectiveScale);
	const canvasHeight = Math.round(baseLayer.height * effectiveScale);

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvas.style.width = `${canvasWidth}px`;
	canvas.style.height = `${canvasHeight}px`;
	
	lastDrawState.drawWidth = canvasWidth;
	lastDrawState.drawHeight = canvasHeight;
	lastDrawState.dx = 0;
	lastDrawState.dy = 0;

	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	ctx.imageSmoothingEnabled = interpolation === "bilinear";

	for (const layer of layers) {
		if (layer.deleted || layer.visible === false) continue;

		const drawWidth = Math.round(layer.width * effectiveScale);
		const drawHeight = Math.round(layer.height * effectiveScale);
		const dx = Math.floor((canvasWidth - drawWidth) / 2);
		const dy = Math.floor((canvasHeight - drawHeight) / 2);

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = layer.width;
		tmpCanvas.height = layer.height;
		const tmpCtx = tmpCanvas.getContext("2d")!;
		tmpCtx.clearRect(0, 0, layer.width, layer.height);

		if (layer.imageData) {
			const raw = new Uint8ClampedArray(layer.imageData.data);

			if (layer.alphaHidden || layer.alphaRemoved) {
				for (let i = 0; i < raw.length; i += 4) raw[i + 3] = 255;
			}

			tmpCtx.putImageData(new ImageData(raw, layer.width, layer.height), 0, 0);
		} else if (layer.pixels && layer.format === "gb7") {
			const { pixels, width, height } = layer;
			const raw = new Uint8ClampedArray(width * height * 4);
			const hasMask = layer.hasAlpha;

			for (let i = 0; i < pixels.length; i++) {
				const byte = pixels[i];
				const gray7 = byte & 0b01111111;
				const gray8 = Math.floor((gray7 / 127) * 255);

				let alpha = 255;
				if (hasMask) alpha = (byte & 0b10000000) ? 255 : 0;
				if (layer.alphaHidden || layer.alphaRemoved) alpha = 255;

				const idx = i * 4;
				raw[idx] = raw[idx + 1] = raw[idx + 2] = gray8;
				raw[idx + 3] = alpha;
			}

			tmpCtx.putImageData(new ImageData(raw, width, height), 0, 0);
		} else if (layer.type === "color" && layer.color) {
			tmpCtx.fillStyle = layer.color;
			tmpCtx.fillRect(0, 0, layer.width, layer.height);
		}

		const scaled = document.createElement("canvas");
		scaled.width = drawWidth;
		scaled.height = drawHeight;

		const scaledCtx = scaled.getContext("2d")!;
		scaledCtx.imageSmoothingEnabled = interpolation === "bilinear";
		scaledCtx.drawImage(tmpCanvas, 0, 0, drawWidth, drawHeight);

		ctx.globalAlpha = layer.opacity ?? 1;
		ctx.globalCompositeOperation =
			layer.blendMode && layer.blendMode !== "normal"
				? (layer.blendMode as GlobalCompositeOperation)
				: "source-over";

		ctx.drawImage(scaled, dx, dy);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
	}
}
