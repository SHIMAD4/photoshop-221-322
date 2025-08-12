import { FormControl, MenuItem, Select } from '@mui/material'
import { FC } from 'react'
import { BlendMode } from '../../../../types/ImageTypes'

const MODES: { value: BlendMode; label: string; tooltip: string }[] = [
    { value: 'normal', label: 'Обычный', tooltip: 'Обычный режим…' },
    { value: 'multiply', label: 'Умножение', tooltip: 'Умножение…' },
    { value: 'screen', label: 'Экран', tooltip: 'Экран…' },
    { value: 'overlay', label: 'Наложение', tooltip: 'Наложение…' },
]

const BlendModeSelect: FC<{
    value: BlendMode
    onChange: (m: BlendMode) => void
}> = ({ value, onChange }) => (
    <>
        <p>
            <strong>Режим наложения</strong>
        </p>
        <FormControl fullWidth size='small'>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value as BlendMode)}
                style={{ color: 'white' }}
                displayEmpty
            >
                {MODES.map((m) => (
                    <MenuItem key={m.value} value={m.value} title={m.tooltip}>
                        {m.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </>
)

export default BlendModeSelect
