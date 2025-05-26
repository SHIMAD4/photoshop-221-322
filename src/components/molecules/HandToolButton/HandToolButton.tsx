import PanToolAltIcon from "@mui/icons-material/PanToolAlt";
import { FC, useEffect } from "react";
import { useHandTool } from "../../../hooks/useHandTool";
import { ImageDataType } from "../../../types/ImageTypes";
import ToolButton from "../../atoms/ToolButton";

type Props = {
	active: boolean;
	onActivate: () => void;
	disabled?: boolean;
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	imageData: ImageDataType | null;
	offsetRef: React.RefObject<{ x: number; y: number }>;
}

const HandToolButton: FC<Props> = ({ active, onActivate, disabled, canvasRef, imageData, offsetRef }) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.toLowerCase() === 'h') onActivate();
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onActivate]);

	useHandTool(
		canvasRef.current,
		active,
		() => {
			if (!imageData || !canvasRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

			const moveX = window.innerWidth / 2;
			const moveY = window.innerHeight / 2;

			return {
				minX: -moveX,
				maxX: moveX,
				minY: -moveY,
				maxY: moveY,
			};
		},
		offsetRef
	);

	return (
		<ToolButton
			title="Инструмент: рука (H)"
			icon={<PanToolAltIcon fontSize="small" />}
			active={active}
			onClick={onActivate}
			disabled={disabled}
		/>
	);
};

export default HandToolButton;
