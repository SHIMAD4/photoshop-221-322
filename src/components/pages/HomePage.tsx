import CropIcon from "@mui/icons-material/Crop";
import UploadIcon from "@mui/icons-material/Upload";
import { FC, useEffect, useRef, useState } from "react";
import { ImageDataType } from "../../types/ImageTypes";
import { parseImage } from "../../utils/parseImage";
import { renderLayersToCanvas } from "../../utils/renderLayersToCanvas";
import { scaleImageData } from "../../utils/scaleImageData";
import { ColorInfo } from "../molecules/EyedropperToolButton/EyedropperToolButton";
import HomeTemplate from "../templates/HomeTemplate/HomeTemplate";

const HomePage: FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const offsetRef = useRef({ x: 0, y: 0 });
	const [layers, setLayers] = useState<ImageDataType[]>([]);
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const [scale, setScale] = useState(1);
	const [baseScale, setBaseScale] = useState(1);
	const [interpolation, setInterpolation] = useState<"nearest" | "bilinear">("bilinear");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeTool, setActiveTool] = useState<"hand" | "eyedropper" | null>("hand");
	const [color1, setColor1] = useState<ColorInfo>();
	const [color2, setColor2] = useState<ColorInfo>();

	const imageData = layers[activeIndex] ?? null;

	const handleImageLoad = (data: ImageDataType) => {
		const layer: ImageDataType = {
			...data,
			opacity: 1,
			visible: true,
			deleted: false,
			alphaHidden: false,
			alphaRemoved: false,
			blendMode: "normal",
			type: "image"
		};

		setLayers([layer]);
		setActiveIndex(0);

		const padding = 50;
		const maxW = window.innerWidth - padding * 2;
		const maxH = window.innerHeight - padding * 2;
		const fitScale = Math.min(maxW / data.width, maxH / data.height);

		setBaseScale(fitScale);
		setScale(1);
		offsetRef.current = { x: 0, y: 0 };
	};

	const handleApplyResize = (
		newW: number,
		newH: number,
		interp: "nearest" | "bilinear"
	) => {
		const layer = layers[activeIndex];
		if (!layer || !layer.imageData) return;

		const resized = scaleImageData(layer.imageData, newW, newH, interp);

		setLayers((prev) =>
			prev.map((l, i) =>
				i === activeIndex
					? {
						...l,
						width: newW,
						height: newH,
						imageData: resized
					}
					: l
			)
		);

		setInterpolation(interp);
		setScale(1);

		offsetRef.current = { x: 0, y: 0 };
		if (canvasRef.current) {
			canvasRef.current.style.transform = `translate(0px, 0px)`;
		}
	};

	const handleAlphaRemove = () => {
		if (!imageData) return;

		if (imageData.format === "gb7" && imageData.pixels) {
			const clearedPixels = new Uint8Array(imageData.pixels.length);

			for (let i = 0; i < clearedPixels.length; i++) {
				clearedPixels[i] = imageData.pixels[i] & 0b01111111;
			}

			updateLayer({ pixels: clearedPixels, hasAlpha: false });
		} else if (imageData.imageData) {
			const raw = new Uint8ClampedArray(imageData.imageData.data);

			for (let i = 0; i < raw.length; i += 4) raw[i + 3] = 255;

			const cleared = new ImageData(raw, imageData.width, imageData.height);
			updateLayer({ imageData: cleared, hasAlpha: false });
		}
	};

	const handleAddImageLayer = () => {
		if (layers.length >= 2) return;

		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".png,.jpg,.jpeg,.gb7";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];

			if (!file) return;

			const data = await parseImage(file);

			const newLayer: ImageDataType = {
				...data,
				opacity: 1,
				visible: true,
				deleted: false,
				alphaHidden: false,
				alphaRemoved: false,
				blendMode: "normal",
				type: "image"
			};

			setLayers((prev) => [...prev, newLayer]);
			setActiveIndex(layers.length);
		};
		input.click();
	};

	const handleAddColorLayer = (color: string) => {
		if (!imageData || layers.length >= 2) return;
		const { width, height } = imageData;

		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d")!;
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, width, height);

		const imgData = ctx.getImageData(0, 0, width, height);

		const newLayer: ImageDataType = {
			width,
			height,
			depth: 8,
			format: "png",
			imageData: imgData,
			opacity: 1,
			visible: true,
			deleted: false,
			alphaHidden: false,
			alphaRemoved: false,
			hasAlpha: false,
			blendMode: "normal",
			type: "color",
			color
		};

		setLayers((prev) => [...prev, newLayer]);
		setActiveIndex(layers.length);
	};

	const updateLayer = (patch: Partial<ImageDataType>) => {
		setLayers((prev) =>
			prev.map((l, i) => (i === activeIndex ? { ...l, ...patch } : l))
		);
	};

	const moveLayer = (direction: "up" | "down") => {
		setLayers((prev) => {
			const newIndex = direction === "up" ? activeIndex - 1 : activeIndex + 1;

			if (newIndex < 0 || newIndex >= prev.length) return prev;

			const copy = [...prev];
			const [moved] = copy.splice(activeIndex, 1);
			copy.splice(newIndex, 0, moved);
			setActiveIndex(newIndex);

			return copy;
		});
	};

	const deleteLayer = () => {
		setLayers((prev) => {
			const newList = prev.filter((_, i) => i !== activeIndex);
			return newList;
		});

		setActiveIndex((prev) => Math.max(0, prev - 1));
	};

	useEffect(() => {
		if (!canvasRef.current) return;
		
		renderLayersToCanvas(canvasRef.current, layers, scale, baseScale, interpolation);
	}, [layers, scale, baseScale, interpolation]);

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
			layers={layers}
			activeIndex={activeIndex}
			setActiveIndex={setActiveIndex}
			onAddImageLayer={handleAddImageLayer}
			onAddColorLayer={handleAddColorLayer}
			moveLayerUp={() => moveLayer("up")}
			moveLayerDown={() => moveLayer("down")}
			setOpacity={(v) => updateLayer({ opacity: v })}
			setAlphaHidden={(v) => updateLayer({ alphaHidden: v })}
			setAlphaRemoved={handleAlphaRemove}
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
			onPickColor={(color, index) =>
				index === 1 ? setColor1(color) : setColor2(color)
			}
			offsetRef={offsetRef}
			setVisible={(v) => updateLayer({ visible: v })}
			setDeleted={deleteLayer}
			setBlendMode={(mode) => updateLayer({ blendMode: mode })}
		/>
	);
};

export default HomePage;
