import {
	Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
	FormControl, FormControlLabel, InputLabel, MenuItem, Select,
	TextField, Tooltip
} from '@mui/material';
import { FC } from 'react';
import { getLimits } from './getLimits';
import { Interpolation, ResizeUnit, useResizeState } from './useResizeState';

type Props = {
	open: boolean;
	onClose: () => void;
	initialWidth: number;
	initialHeight: number;
	interpolation: Interpolation;
	onApply: (width: number, height: number, interpolation: Interpolation) => void;
};

const ScaleSettingsModal: FC<Props> = ({
	open, onClose, initialWidth, initialHeight, interpolation, onApply
}) => {
	const {
		unit, setUnit,
		keepRatio, setKeepRatio,
		inputWidth, setInputWidth,
		inputHeight, setInputHeight,
		interp, setInterp,
		widthError, setWidthError,
		heightError, setHeightError
	} = useResizeState(initialWidth, initialHeight, interpolation);

	const limits = getLimits(unit);

	const getActual = () => ({
		width: unit === 'pixels' ? inputWidth : Math.round(initialWidth * (inputWidth / 100)),
		height: unit === 'pixels' ? inputHeight : Math.round(initialHeight * (inputHeight / 100))
	});

	const handleApply = () => {
		let valid = true;

		if (inputWidth < limits.min || inputWidth > limits.max) {
			setWidthError(`Значение от ${limits.min} до ${limits.max}`);
			valid = false;
		} else setWidthError('');

		if (inputHeight < limits.min || inputHeight > limits.max) {
			setHeightError(`Значение от ${limits.min} до ${limits.max}`);
			valid = false;
		} else setHeightError('');

		if (!valid) return;

		const { width, height } = getActual();
		onApply(width, height, interp);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Изменение размера</DialogTitle>
			<DialogContent>
				<FormControl fullWidth margin="normal">
					<InputLabel>Единицы</InputLabel>
					<Select
						label="Единицы"
						value={unit}
						onChange={e => setUnit(e.target.value as ResizeUnit)}
					>
						<MenuItem value="pixels">Пиксели</MenuItem>
						<MenuItem value="percent">Проценты</MenuItem>
					</Select>
				</FormControl>

				<DimensionInput
					label="Ширина"
					value={inputWidth}
					error={widthError}
					min={limits.min}
					max={limits.max}
					onChange={(value) => {
						setInputWidth(value);
						if (keepRatio) {
							const ratio = initialHeight / initialWidth;
							setInputHeight(unit === 'pixels' ? Math.round(value * ratio) : value);
						}
					}}
				/>
				<DimensionInput
					label="Высота"
					value={inputHeight}
					error={heightError}
					min={limits.min}
					max={limits.max}
					onChange={(value) => {
						setInputHeight(value);
						if (keepRatio) {
							const ratio = initialWidth / initialHeight;
							setInputWidth(unit === 'pixels' ? Math.round(value * ratio) : value);
						}
					}}
				/>
				<FormControlLabel
					control={
						<Checkbox
							checked={keepRatio}
							onChange={e => setKeepRatio(e.target.checked)}
						/>
					}
					label="Сохранять пропорции"
				/>

				<FormControl fullWidth margin="normal">
					<InputLabel>Интерполяция</InputLabel>
					<Select
						label="Интерполяция"
						value={interp}
						onChange={e => setInterp(e.target.value as Interpolation)}
					>
						<MenuItem value="nearest">
							<Tooltip title="Простой и быстрый алгоритм, но может приводить к появлению ступенчатых артефактов."><span>Ближайший сосед</span></Tooltip>
						</MenuItem>
						<MenuItem value="bilinear">
							<Tooltip title="Гладкая интерполяция: обеспечивает высокое качество, но работает медленнее."><span>Билинейная</span></Tooltip>
						</MenuItem>
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Отмена</Button>
				<Button onClick={handleApply} variant="contained">Применить</Button>
			</DialogActions>
		</Dialog>
	);
};

type DimensionInputProps = {
	label: string;
	value: number;
	error: string;
	min: number;
	max: number;
	onChange: (value: number) => void;
};

const DimensionInput: FC<DimensionInputProps> = ({ label, value, error, min, max, onChange }) => (
	<TextField
		label={label}
		type="number"
		fullWidth
		margin="dense"
		value={value}
		error={!!error}
		helperText={error}
		slotProps={{
			input: {
				inputProps: { min, max }
			}
		}}
		onChange={(e) => onChange(Number(e.target.value))}
	/>
);

export default ScaleSettingsModal;
