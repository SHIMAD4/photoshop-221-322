import { FC } from "react";
import { ImageDataType } from "../../../types/ImageTypes";
import InputFile from "../../atoms/InputFile";
import ToolButton from "../../atoms/ToolButton";
import EyedropperToolButton, { ColorInfo } from "../../molecules/EyedropperToolButton/EyedropperToolButton";
import HandToolButton from "../../molecules/HandToolButton/HandToolButton";
import ColorInfoPanel from "../ColorInfoPanel/ColorInfoPanel";
import './style.css';

type Props = {
	icon: React.ReactNode;
	onImageChange: (data: ImageDataType) => void;
	onResizeClick: () => void;
	resizeIcon: React.ReactNode;
	resizeDisabled: boolean;
	activeTool: 'hand' | 'eyedropper' | null;
	onToolChange: (tool: 'hand' | 'eyedropper') => void;
	toolsDisabled: boolean;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	scale: number;
	baseScale: number;
	onPickColor: (color: ColorInfo, index: 1 | 2) => void;
	color1?: ColorInfo;
	color2?: ColorInfo;
	offsetRef: React.RefObject<{ x: number; y: number }>;
	imageData: ImageDataType | null;
};

const ToolsPanel: FC<Props> = ({
	icon,
	onImageChange,
	onResizeClick,
	resizeIcon,
	resizeDisabled,
	activeTool,
	onToolChange,
	toolsDisabled,
	canvasRef,
	scale,
	baseScale,
	onPickColor,
	color1,
	color2,
	offsetRef,
	imageData
}) => (
	<>
		<div className="home_btnBlock">
			<InputFile icon={icon} onChange={onImageChange} />

			<ToolButton
				title="Изменить размер"
				icon={resizeIcon}
				disabled={resizeDisabled}
				onClick={onResizeClick}
			/>

			<HandToolButton
				active={activeTool === 'hand'}
				onActivate={() => onToolChange('hand')}
				disabled={toolsDisabled}
				canvasRef={canvasRef}
				imageData={imageData}
				offsetRef={offsetRef}
			/>

			<EyedropperToolButton
				active={activeTool === 'eyedropper'}
				onActivate={() => onToolChange('eyedropper')}
				disabled={toolsDisabled}
				canvas={canvasRef.current}
				scale={scale}
				baseScale={baseScale}
				onPick={onPickColor}
			/>
		</div>

		{(color1 || color2) && (
			<div className="info_panel">
				<ColorInfoPanel color1={color1} color2={color2} />
			</div>
		)}
	</>
);

export default ToolsPanel;
