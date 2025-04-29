import { useState } from "react";
import { ImageDataType } from "../../types/ImageTypes";
import { bilinearInterpolation } from "../../utils/bilinearInterpolation";
import { nearestNeighborInterpolation } from "../../utils/nearestNeighborInterpolation";
import HomeTemplate from "../templates/HomeTemplate";

function HomePage() {
	const [statusData, setStatusData] = useState<ImageDataType>({
		width: 0,
		height: 0,
		depth: 0,
	});
	const [originalImageData, setOriginalImageData] = useState<ImageDataType | null>(null);
	const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);

	const handleImage = (data: ImageDataType) => {
		setStatusData(data);
		setOriginalImageData(data);
	};

	const handleResize = (newWidth: number, newHeight: number, method: "nearest" | "bilinear") => {
		if (!originalImageData) return;

		const canvas = document.getElementById("imagePreview") as HTMLCanvasElement | null;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = originalImageData.width;
		tmpCanvas.height = originalImageData.height;

		const tmpCtx = tmpCanvas.getContext("2d");
		if (!tmpCtx) return;

		const img = new Image();
		img.src = (canvas.toDataURL && canvas.toDataURL()) || "";
		img.onload = () => {
			tmpCtx.drawImage(img, 0, 0);
			const sourceData = tmpCtx.getImageData(0, 0, originalImageData.width, originalImageData.height);

			let resizedImageData;
			if (method === "nearest") {
				resizedImageData = nearestNeighborInterpolation(sourceData, newWidth, newHeight);
			} else {
				resizedImageData = bilinearInterpolation(sourceData, newWidth, newHeight);
			}

			canvas.width = newWidth;
			canvas.height = newHeight;
			ctx.putImageData(resizedImageData, 0, 0);

			setStatusData({
				width: newWidth,
				height: newHeight,
				depth: originalImageData.depth,
				format: originalImageData.format,
			});
		};
	};

	return (
		<HomeTemplate 
			content={{
				input: {
					label: 'upload image',
					onChange: handleImage,
				},
				statusBar: {
					width: statusData.width,
					height: statusData.height,
					depth: statusData.depth,
				},
				canvas: {
					id: 'imagePreview',
				},
				resizeModal: {
					isResizeModalOpen,
					setIsResizeModalOpen,
					handleResize,
					onResizeClick: () => setIsResizeModalOpen(true),
				}
			}}
		/>
	);
}

export default HomePage;
