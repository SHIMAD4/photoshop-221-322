import { useEffect, useState } from "react";

export type ResizeUnit = 'pixels' | 'percent';
export type Interpolation = 'nearest' | 'bilinear';

export function useResizeState(initialWidth: number, initialHeight: number, interpolation: Interpolation) {
	const [unit, setUnit] = useState<ResizeUnit>('pixels');
	const [keepRatio, setKeepRatio] = useState(true);
	const [inputWidth, setInputWidth] = useState(initialWidth);
	const [inputHeight, setInputHeight] = useState(initialHeight);
	const [interp, setInterp] = useState(interpolation);
	const [widthError, setWidthError] = useState('');
	const [heightError, setHeightError] = useState('');

	useEffect(() => {
		setInterp(interpolation);
		setKeepRatio(true);
		setWidthError('');
		setHeightError('');

		if (unit === 'pixels') {
			setInputWidth(initialWidth);
			setInputHeight(initialHeight);
		} else {
			setInputWidth(100);
			setInputHeight(100);
		}
	}, [initialWidth, initialHeight, interpolation, unit]);

	return {
		unit, setUnit,
		keepRatio, setKeepRatio,
		inputWidth, setInputWidth,
		inputHeight, setInputHeight,
		interp, setInterp,
		widthError, setWidthError,
		heightError, setHeightError
	};
}
