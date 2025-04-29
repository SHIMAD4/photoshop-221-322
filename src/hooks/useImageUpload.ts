import { useCallback } from "react";
import { ImageDataType } from "../types/ImageTypes";
import { drawImageToCanvas } from "../utils/drawImageToCanvas";
import { parseImage } from "../utils/parseImage";

export const useImageUpload = (canvasId: string, onChange?: (data: ImageDataType) => void) => {
	const handleUpload = useCallback(async (file: File) => {
		const imageData = await parseImage(file);

		const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;

		if (!canvas) return;

		let imgTag: HTMLImageElement | undefined;

		if (imageData.format !== "gb7") {
			imgTag = document.createElement("img");

			imgTag.src = URL.createObjectURL(file);
			
			await new Promise((resolve) => {
				imgTag!.onload = resolve;
			});
		}

		drawImageToCanvas(canvas, imageData, imgTag);

		onChange?.(imageData);
	}, [canvasId, onChange]);

	return { handleUpload };
};
