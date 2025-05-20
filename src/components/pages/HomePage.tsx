import CropIcon from '@mui/icons-material/Crop';
import UploadIcon from '@mui/icons-material/Upload';
import { FC, useEffect, useRef, useState } from "react";
import { ImageDataType } from "../../types/ImageTypes";
import { drawImageToCanvas } from "../../utils/drawImageToCanvas";
import { ColorInfo } from "../molecules/EyedropperToolButton/EyedropperToolButton";
import HomeTemplate from "../templates/HomeTemplate/HomeTemplate";

const HomePage: FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const offsetRef = useRef({ x: 0, y: 0 });
	const [imageData, setImageData] = useState<ImageDataType | null>(null);
	const [scale, setScale] = useState(1);
	const [baseScale, setBaseScale] = useState(1);
	const [interpolation, setInterpolation] = useState<'nearest' | 'bilinear'>('bilinear');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeTool, setActiveTool] = useState<'hand' | 'eyedropper' | null>('hand');
	const [color1, setColor1] = useState<ColorInfo | undefined>();
	const [color2, setColor2] = useState<ColorInfo | undefined>();

	const handleImageLoad = (data: ImageDataType) => {
		setImageData(data);
		const padding = 50;
		const maxW = window.innerWidth - padding * 2;
		const maxH = window.innerHeight - padding * 2;
		const fitScale = Math.min(maxW / data.width, maxH / data.height);

		setBaseScale(fitScale);
		setScale(1);

		offsetRef.current = { x: 0, y: 0 };
		drawImageToCanvas(canvasRef.current!, data, data.original, 1, 'nearest', fitScale);

		if (canvasRef.current) {
			canvasRef.current.style.transform = `translate(0px, 0px)`;
		}
	};

	const handleApplyResize = (newW: number, newH: number, interp: 'nearest' | 'bilinear') => {
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
	};

	const handlePickColor = (color: ColorInfo, index: 1 | 2) => {
		if (index === 1) setColor1(color);
		else setColor2(color);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === 'h') setActiveTool('hand');
			if (e.key.toLowerCase() === 'i') setActiveTool('eyedropper');
		};

    	window.addEventListener('keydown', handleKeyDown);
    	return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !imageData) return;

		drawImageToCanvas(
		canvas,
		imageData,
		imageData.original,
		scale,
		interpolation,
		baseScale
		);

		offsetRef.current = { x: 0, y: 0 };
		canvas.style.transform = `translate(0px, 0px)`;
	}, [baseScale, imageData, interpolation, scale]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const updateCursor = () => {
			if (activeTool === 'hand') canvas.style.cursor = 'grab';
			else if (activeTool === 'eyedropper') canvas.style.cursor = 'crosshair';
			else canvas.style.cursor = 'default';
		};

		const handleMouseEnter = updateCursor;
		const handleMouseLeave = () => canvas.style.cursor = 'default';

		updateCursor();

		canvas.addEventListener('mouseenter', handleMouseEnter);
		canvas.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			canvas.removeEventListener('mouseenter', handleMouseEnter);
			canvas.removeEventListener('mouseleave', handleMouseLeave);
		};
	}, [activeTool]);

	return (
		<HomeTemplate
			canvasRef={canvasRef}
			imageData={imageData}
			onImageChange={handleImageLoad}
			onApplyResize={handleApplyResize}
			interpolation={interpolation}
			scale={scale}
			baseScale={baseScale}
			setScale={setScale}
			activeTool={activeTool}
			setActiveTool={setActiveTool}
			isModalOpen={isModalOpen}
			openModal={() => setIsModalOpen(true)}
			closeModal={() => setIsModalOpen(false)}
			uploadIcon={<UploadIcon />}
			resizeIcon={<CropIcon />}
			color1={color1}
			color2={color2}
			onPickColor={handlePickColor}
			offsetRef={offsetRef}
		/>
	);
};

export default HomePage;