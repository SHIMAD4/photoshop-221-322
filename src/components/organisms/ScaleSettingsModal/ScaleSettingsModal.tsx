import {
	Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
	FormControl, FormControlLabel, InputLabel, MenuItem, Select,
	TextField, Tooltip
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

type Props = {
	open: boolean;
	onClose: () => void;
	initialWidth: number;
	initialHeight: number;
	interpolation: 'nearest' | 'bilinear';
	onApply: (width: number, height: number, interpolation: 'nearest' | 'bilinear') => void;
};

const ScaleSettingsModal: FC<Props> = ({
	open, onClose, initialWidth, initialHeight, interpolation, onApply
}) => {
	const [unit, setUnit] = useState<'pixels' | 'percent'>('pixels');
	const [keepRatio, setKeepRatio] = useState(true);
	const [inputWidth, setInputWidth] = useState(initialWidth);
	const [inputHeight, setInputHeight] = useState(initialHeight);
	const [interp, setInterp] = useState(interpolation);

	const [widthError, setWidthError] = useState('');
	const [heightError, setHeightError] = useState('');

	useEffect(() => {
		setInterp(interpolation);
		if (unit === 'pixels') {
			setInputWidth(initialWidth);
			setInputHeight(initialHeight);
		} else {
			setInputWidth(100);
			setInputHeight(100);
		}
		setKeepRatio(true);
		setWidthError('');
		setHeightError('');
	}, [open, initialWidth, initialHeight, interpolation, unit]);

	const getLimits = () => unit === 'percent' ? { min: 1, max: 100 } : { min: 1, max: 10000 };

	const getActual = () => ({
		width: unit === 'pixels' ? inputWidth : Math.round(initialWidth * (inputWidth / 100)),
		height: unit === 'pixels' ? inputHeight : Math.round(initialHeight * (inputHeight / 100))
	});

	const handleApply = () => {
		const { min, max } = getLimits();
		let valid = true;

		if (inputWidth < min || inputWidth > max) {
			setWidthError(`Значение от ${min} до ${max}`);
			valid = false;
		} else setWidthError('');

		if (inputHeight < min || inputHeight > max) {
			setHeightError(`Значение от ${min} до ${max}`);
			valid = false;
		} else setHeightError('');

		if (!valid) return;

		const { width, height } = getActual();
		onApply(width, height, interp);
		onClose();
	};

	const { min, max } = getLimits();

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Изменение размера</DialogTitle>
			<DialogContent>
				<FormControl fullWidth margin="normal">
					<InputLabel>Единицы</InputLabel>
					<Select
						label='Единицы'
						value={unit}
						onChange={e => setUnit(e.target.value as 'pixels' | 'percent')}
					>
						<MenuItem value="pixels">Пиксели</MenuItem>
						<MenuItem value="percent">Проценты</MenuItem>
					</Select>
				</FormControl>

				<DimensionInput
					label="Ширина"
					value={inputWidth}
					error={widthError}
					min={min}
					max={max}
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
					min={min}
					max={max}
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
						label='Интерполяция'
						value={interp}
						onChange={e => setInterp(e.target.value as 'nearest' | 'bilinear')}
					>
						<MenuItem value="nearest">
							<Tooltip title="Для пиксельной графики"><span>Ближайший сосед</span></Tooltip>
						</MenuItem>
						<MenuItem value="bilinear">
							<Tooltip title="Гладкое масштабирование"><span>Билинейная</span></Tooltip>
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
