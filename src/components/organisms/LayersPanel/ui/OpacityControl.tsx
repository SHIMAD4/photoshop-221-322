import { Slider } from '@mui/material'
import { FC } from 'react'

const OpacityControl: FC<{ value: number; onChange: (v: number) => void }> = ({
    value,
    onChange,
}) => (
    <>
        <p>
            <strong>Непрозрачность</strong>
        </p>
        <Slider
            value={value}
            onChange={(_, val) => onChange(val as number)}
            getAriaValueText={(v) => `${Math.round((v as number) * 100)}%`}
            valueLabelDisplay='auto'
            step={0.01}
            min={0}
            max={1}
        />
    </>
)

export default OpacityControl
