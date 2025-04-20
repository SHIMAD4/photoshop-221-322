import { useCallback } from "react";
import { ImageDataType } from "../types/ImageTypes";
import { getColorDepth } from "../utils/getColorDepth";
import { getScaledSize } from "../utils/getScaledSize";

// Обработка PNG/JPG файлов: загрузка, отрисовка в canvas, извлечение глубины цвета.
export const useRasterImage = (
	canvasId: string,
	onChange?: (data: ImageDataType) => void
) => {
	return useCallback((file: File) => {
		const reader = new FileReader();
		const imgTag = document.createElement("img");

		reader.onload = () => {
			if (typeof reader.result !== "string") return;
			imgTag.src = reader.result;
			imgTag.onload = () => {
				const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
				if (!canvas) return;

				const ctx = canvas.getContext("2d");
				if (!ctx) return;

				const { width, height } = getScaledSize(imgTag.width, imgTag.height);
				canvas.width = width;
				canvas.height = height;
				canvas.style.width = `${width}px`;
				canvas.style.height = `${height}px`;

				ctx.imageSmoothingEnabled = false;
				ctx.clearRect(0, 0, width, height);
				ctx.drawImage(imgTag, 0, 0, width, height);

				onChange?.({
					width: imgTag.width,
					height: imgTag.height,
					depth: getColorDepth(ctx),
				});
			};
		};
		reader.readAsDataURL(file);
	}, [canvasId, onChange]);
};
