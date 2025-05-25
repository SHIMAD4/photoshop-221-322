import { FC, ReactNode, RefObject } from "react";
import { BlendMode, ImageDataType } from "../../../types/ImageTypes";
import Canvas from "../../atoms/Canvas";
import { ColorInfo } from "../../molecules/EyedropperToolButton/EyedropperToolButton";
import StatusBar from "../../molecules/StatusBar/StatusBar";
import LayersPanel from "../../organisms/LayersPanel/LayersPanel";
import ScaleSettingsModal from "../../organisms/ScaleSettingsModal/ScaleSettingsModal";
import ToolsPanel from "../../organisms/ToolsPanel/ToolsPanel";
import "./style.css";

type Props = {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	imageData: ImageDataType | null;
	layers: ImageDataType[];
	activeIndex: number;
	setActiveIndex: (index: number) => void;
	onAddImageLayer: () => void;
	onAddColorLayer: (color: string) => void;
	scale: number;
	baseScale: number;
	setScale: (scale: number) => void;
	interpolation: "nearest" | "bilinear";
	onApplyResize: (
		width: number,
		height: number,
		interpolation: "nearest" | "bilinear"
	) => void;
	onImageChange: (data: ImageDataType) => void;
	activeTool: "hand" | "eyedropper" | null;
	setActiveTool: (tool: "hand" | "eyedropper") => void;
	isModalOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	uploadIcon: ReactNode;
	resizeIcon: ReactNode;
	color1?: ColorInfo;
	color2?: ColorInfo;
	onPickColor: (color: ColorInfo, index: 1 | 2) => void;
	offsetRef: RefObject<{ x: number; y: number }>;
	setOpacity: (opacity: number) => void;
	setAlphaHidden: (hidden: boolean) => void;
	setAlphaRemoved: () => void;
	setVisible: (visible: boolean) => void;
	setDeleted: () => void;
	moveLayerUp: () => void;
	moveLayerDown: () => void;
	setBlendMode: (mode: BlendMode | undefined) => void;
};

const HomeTemplate: FC<Props> = ({
	canvasRef,
	imageData,
	layers,
	activeIndex,
	setActiveIndex,
	onAddImageLayer,
	onAddColorLayer,
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
	setOpacity,
	setAlphaHidden,
	setAlphaRemoved,
	setVisible,
	setDeleted,
	moveLayerUp,
	moveLayerDown,
	setBlendMode,
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

			{imageData && (
				<LayersPanel
					imageData={imageData}
					layers={layers}
					activeIndex={activeIndex}
					setActiveIndex={setActiveIndex}
					onOpacityChange={setOpacity}
					onAlphaHide={setAlphaHidden}
					onAlphaRemove={setAlphaRemoved}
					onToggleVisibility={setVisible}
					onDeleteLayer={setDeleted}
					onAddImageLayer={onAddImageLayer}
					onAddColorLayer={onAddColorLayer}
					onMoveLayerUp={moveLayerUp}
					onMoveLayerDown={moveLayerDown}
					onBlendModeChange={setBlendMode}
				/>
			)}

			<Canvas id="imagePreview" ref={canvasRef} />

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
