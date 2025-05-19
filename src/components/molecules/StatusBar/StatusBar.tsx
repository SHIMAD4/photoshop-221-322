import { Slider, Typography } from "@mui/material";
import { FC } from "react";
import './style.css';

type Props = {
	width?: number;
	height?: number;
	depth?: number;
	scale: number;
	onScaleChange: (val: number) => void;
	disabled?: boolean;
};

const StatusBar: FC<Props> = ({
	width = 0,
	height = 0,
	depth = 0,
	scale,
	onScaleChange,
	disabled = false
}) => {
	return (
		<div className="statusBar">
			<div className="infoBlock">
				<p><span>Размер:</span> {width} px / {height} px</p>
				<p><span>Глубина:</span> {depth} bpp</p>
			</div>
			<div className={`scaleBlock ${disabled ? 'disabled' : ''}`}>
				<Typography gutterBottom>Масштаб: {(scale * 100).toFixed(0)}%</Typography>
				<Slider
					min={0.12}
					max={3}
					step={0.01}
					value={scale}
					onChange={(_, val) => onScaleChange(typeof val === "number" ? val : val[0])}
					disabled={disabled}
				/>
			</div>
		</div>
	);
};

export default StatusBar;
