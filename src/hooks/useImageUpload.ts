import { useCallback } from "react";
import { ImageDataType } from "../types/ImageTypes";
import { useGB7Image } from "./useGB7Image";
import { useRasterImage } from "./useRasterImage";

// Главный хук-обработчик файла.
// Автоматически определяет формат (PNG, JPEG, GB7) и вызывает соответствующий хук.
export const useImageUpload = (
	canvasId: string,
	onChange?: (data: ImageDataType) => void
) => {
	const handleGB7 = useGB7Image(canvasId, onChange);
	const handleRaster = useRasterImage(canvasId, onChange);

	const handleUpload = useCallback((file: File) => {
		const ext = file.name.split(".").pop()?.toLowerCase();
		if (ext === "gb7") {
			handleGB7(file);
		} else {
			handleRaster(file);
		}
	}, [handleGB7, handleRaster]);

	return { handleUpload };
};
