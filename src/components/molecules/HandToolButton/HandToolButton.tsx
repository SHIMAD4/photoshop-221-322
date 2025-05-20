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
			if (!imageData || !canvasRef.current) return {
				minX: 0, maxX: 0, minY: 0, maxY: 0
			};

			const canvas = canvasRef.current;
			const canvasW = canvas.width;
			const canvasH = canvas.height;
			const viewportW = window.innerWidth;
			const viewportH = window.innerHeight - 120;

			const marginX = Math.min(canvasW, viewportW) / 2;
			const marginY = Math.min(canvasH, viewportH) / 2;

			const minX = viewportW - canvasW - marginX;
			const maxX = marginX;
			const minY = viewportH - canvasH - marginY;
			const maxY = marginY;

			return { minX, maxX, minY, maxY };
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
