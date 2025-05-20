import { FC, ReactNode, RefObject } from "react";
import { ImageDataType } from "../../../types/ImageTypes";
import Canvas from "../../atoms/Canvas";
import { ColorInfo } from "../../molecules/EyedropperToolButton/EyedropperToolButton";
import StatusBar from "../../molecules/StatusBar/StatusBar";
import ScaleSettingsModal from "../../organisms/ScaleSettingsModal/ScaleSettingsModal";
import ToolsPanel from "../../organisms/ToolsPanel/ToolsPanel";
import './style.css';

type Props = {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	imageData: ImageDataType | null;
	scale: number;
	baseScale: number;
	setScale: (scale: number) => void;
	interpolation: 'nearest' | 'bilinear';
	onApplyResize: (width: number, height: number, interpolation: 'nearest' | 'bilinear') => void;
	onImageChange: (data: ImageDataType) => void;
	activeTool: 'hand' | 'eyedropper' | null;
	setActiveTool: (tool: 'hand' | 'eyedropper') => void;
	isModalOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	uploadIcon: ReactNode;
	resizeIcon: ReactNode;
	color1?: ColorInfo;
	color2?: ColorInfo;
	onPickColor: (color: ColorInfo, index: 1 | 2) => void;
	offsetRef: React.RefObject<{ x: number; y: number }>;
};

const HomeTemplate: FC<Props> = ({
	canvasRef,
	imageData,
	scale,
	baseScale,
	setScale,
	interpolation,
	onApplyResize,
	onImageChange,
	activeTool,
	setActiveTool,
	isModalOpen,
	openModal,
	closeModal,
	uploadIcon,
	resizeIcon,
	color1,
	color2,
	onPickColor,
	offsetRef,
}) => {
	return (
		<div className="home">
			<ToolsPanel
				icon={uploadIcon}
				onImageChange={onImageChange}
				onResizeClick={openModal}
				resizeIcon={resizeIcon}
				resizeDisabled={!imageData}
				activeTool={activeTool}
				onToolChange={setActiveTool}
				toolsDisabled={!imageData}
				canvasRef={canvasRef}
				scale={scale}
				baseScale={baseScale}
				onPickColor={onPickColor}
				color1={color1}
				color2={color2}
				offsetRef={offsetRef}
				imageData={imageData}
			/>

			<Canvas
				id="imagePreview"
				ref={canvasRef}
			/>

			<StatusBar
				width={imageData?.width || 0}
				height={imageData?.height || 0}
				depth={imageData?.depth || 0}
				scale={scale}
				onScaleChange={setScale}
				disabled={!imageData}
			/>

			{imageData && isModalOpen && (
				<ScaleSettingsModal
					open={isModalOpen}
					onClose={closeModal}
					initialWidth={imageData.width}
					initialHeight={imageData.height}
					interpolation={interpolation}
					onApply={onApplyResize}
				/>
			)}
		</div>
	);
};

export default HomeTemplate;