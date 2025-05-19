import Button from "@mui/material/Button";
import { FC, useEffect, useRef, useState } from "react";
import { ImageDataType } from "../../../types/ImageTypes";
import { drawImageToCanvas } from "../../../utils/drawImageToCanvas";
import Canvas from "../../atoms/Canvas";
import InputFile from "../../atoms/InputFile";
import StatusBar from "../../molecules/StatusBar/StatusBar";
import ScaleSettingsModal from "../../organisms/ScaleSettingsModal/ScaleSettingsModal";
import './style.css';

type HomeTemplateProps = {
	content: {
		input: {
			icon: React.ReactNode;
			onChange: (data: ImageDataType) => void;
		};
		buttons: {
			modalButton: {
				icon: React.ReactNode;
			}
		}
		statusBar: {
			width: number;
			height: number;
			depth: number;
		};
		canvas: {
			id: string;
		};
	};
};

const HomeTemplate: FC<HomeTemplateProps> = ({ content }) => {
	const { statusBar, input, buttons, canvas } = content;
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [imageData, setImageData] = useState<ImageDataType | null>(null);
	const [scale, setScale] = useState<number>(1);
	const [baseScale, setBaseScale] = useState<number>(1);
	const [interpolation, setInterpolation] = useState<'nearest' | 'bilinear'>('nearest');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleImageLoad = (data: ImageDataType) => {
		setImageData(data);
		input.onChange(data);

		const padding = 50;
		const maxW = window.innerWidth - padding * 2;
		const maxH = window.innerHeight - padding * 2;
		const fitScale = Math.min(maxW / data.width, maxH / data.height);

		setBaseScale(fitScale);
		setScale(1);
		drawImageToCanvas(canvasRef.current!, data, data.original, 1, 'nearest', fitScale);
	};

	useEffect(() => {
		if (canvasRef.current && imageData) {
			drawImageToCanvas(canvasRef.current, imageData, imageData.original, scale, interpolation, baseScale);
		}
	}, [imageData, scale, interpolation, baseScale]);

	const handleApplyResize = (
		newW: number,
		newH: number,
		interp: 'nearest' | 'bilinear'
	) => {
		if (!imageData || !canvasRef.current) return;

		const updatedImageData: ImageDataType = {
			...imageData,
			width: newW,
			height: newH,
		};

		setImageData(updatedImageData);
		setInterpolation(interp);

		const percentScale = newW / imageData.width;
		setScale(percentScale);

		drawImageToCanvas(canvasRef.current, updatedImageData, updatedImageData.original, percentScale, interp, baseScale);
		input.onChange(updatedImageData);
	};

	return (
		<div className="home">
			<div className="home_btnBlock">
				<InputFile icon={input.icon} onChange={handleImageLoad} />
				<Button variant="outlined" onClick={() => setIsModalOpen(true)} disabled={!imageData}>
					{buttons.modalButton.icon}
				</Button>
			</div>

			<Canvas id={canvas.id} ref={canvasRef} />

			<StatusBar
				width={statusBar.width}
				height={statusBar.height}
				depth={statusBar.depth}
				scale={scale}
				onScaleChange={setScale}
				disabled={!imageData}
			/>

			{imageData && (
				<ScaleSettingsModal
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					initialWidth={imageData.width}
					initialHeight={imageData.height}
					interpolation={interpolation}
					onApply={handleApplyResize}
				/>
			)}
		</div>
	);
};

export default HomeTemplate;
