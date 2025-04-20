import { useCallback } from "react";
import { ImageDataType } from "../types/ImageTypes";
import { parseGB7 } from "../utils/parseGB7";
import { useDrawGB7Image } from "./useDrawGB7Image";

// Обработка GB7-файлов: чтение из ArrayBuffer, парсинг через parseGB7, отрисовка через useDrawGB7Image.
export const useGB7Image = (
	canvasId: string,
	onChange?: (data: ImageDataType) => void
) => {
	const drawImage = useDrawGB7Image();

	return useCallback((file: File) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (!(reader.result instanceof ArrayBuffer)) return;
			const image = parseGB7(reader.result);
			const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
			if (!canvas) return;

			drawImage(canvas, image);

			onChange?.({
				width: image.width,
				height: image.height,
				depth: image.hasMask ? 8 : 7,
			});
		};
		reader.readAsArrayBuffer(file);
	}, [canvasId, onChange, drawImage]);
};
