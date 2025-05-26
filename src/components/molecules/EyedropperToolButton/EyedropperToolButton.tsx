import ColorizeIcon from "@mui/icons-material/Colorize";
import { useEffect } from "react";
import { lastDrawState } from "../../../utils/drawImageToCanvas";
import ToolButton from "../../atoms/ToolButton";

export type ColorInfo = {
	label: string;
	x: number;
	y: number;
	rgba: [number, number, number, number];
	xyz: { x: number; y: number; z: number };
	lab: { l: number; a: number; b: number };
	oklch: { l: number; c: number; h: number };
};

type Props = {
	active: boolean;
	onActivate: () => void;
	disabled?: boolean;
	canvas: HTMLCanvasElement | null;
	scale: number;
	baseScale: number;
	onPick: (color: ColorInfo, index: 1 | 2) => void;
};

const EyedropperToolButton = ({
	active,
	onActivate,
	disabled,
	canvas,
	scale,
	baseScale,
	onPick
}: Props) => {
	useEffect(() => {
		if (!active || !canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleClick = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const scrollX = window.scrollX || document.documentElement.scrollLeft;
			const scrollY = window.scrollY || document.documentElement.scrollTop;

			const canvasX = e.clientX - rect.left + scrollX - canvas.scrollLeft;
			const canvasY = e.clientY - rect.top + scrollY - canvas.scrollTop;

			const { dx, dy, drawWidth, drawHeight } = lastDrawState;

			const x = Math.floor(canvasX - dx);
			const y = Math.floor(canvasY - dy);

			if (x < 0 || y < 0 || x >= drawWidth || y >= drawHeight) {
				console.warn("Координаты вне изображения:", { x, y });
				return;
			}

			try {
				const [r, g, b, a] = ctx.getImageData(x + dx, y + dy, 1, 1).data;
				const index: 1 | 2 = e.altKey || e.ctrlKey || e.shiftKey ? 2 : 1;

				const color: ColorInfo = {
					label: index === 1 ? "Цвет 1" : "Цвет 2",
					x, y,
					rgba: [r, g, b, a],
					xyz: rgbToXyz(r, g, b),
					lab: rgbToLab(r, g, b),
					oklch: rgbToOKLCH(r, g, b)
				};

				onPick(color, index);
			} catch (error) {
				console.error("Ошибка при чтении пикселя:", error);
			}
		};

		canvas.addEventListener("click", handleClick);
		return () => canvas.removeEventListener("click", handleClick);
	}, [active, canvas, scale, baseScale, onPick]);

	return (
		<ToolButton
			title="Инструмент: пипетка (I)"
			icon={<ColorizeIcon fontSize="small" />}
			active={active}
			onClick={onActivate}
			disabled={disabled}
		/>
	);
};

function rgbToXyz(r: number, g: number, b: number) {
	const srgb = [r, g, b].map((v) => {
		const c = v / 255;
		
		return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
	});

	const [R, G, B] = srgb;
	const x = R * 0.4124 + G * 0.3576 + B * 0.1805;
	const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
	const z = R * 0.0193 + G * 0.1192 + B * 0.9505;

	return { x: x * 100, y: y * 100, z: z * 100 };
}

function xyzToLab(x: number, y: number, z: number) {
	const refX = 95.047;
	const refY = 100.0;
	const refZ = 108.883;

	const fx = (v: number) =>
	v > 0.008856 ? Math.pow(v, 1 / 3) : (7.787 * v) + 16 / 116;

	const X = fx(x / refX);
	const Y = fx(y / refY);
	const Z = fx(z / refZ);

	const l = (116 * Y) - 16;
	const a = 500 * (X - Y);
	const b = 200 * (Y - Z);

	return { l, a, b };
}

function rgbToLab(r: number, g: number, b: number) {
	const { x, y, z } = rgbToXyz(r, g, b);

	return xyzToLab(x, y, z);
}

function rgbToOKLCH(r: number, g: number, b: number) {
	const { l, a, b: labB } = rgbToLab(r, g, b);
	const c = Math.sqrt(a * a + labB * labB);
	const h = Math.atan2(labB, a) * (180 / Math.PI);

	return {
		l: l / 100,
		c: c / 100,
		h: (h + 360) % 360
	};
}

export default EyedropperToolButton;
