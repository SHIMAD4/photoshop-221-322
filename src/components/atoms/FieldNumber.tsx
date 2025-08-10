import { FC } from 'react'

type Props = {
    label: string
    min: number
    max: number
    value: number
    onChange: (v: number) => void
    width?: number
}

const FieldNumber: FC<Props> = ({
    label,
    min,
    max,
    value,
    onChange,
    width,
}) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {label}
        <input
            type='number'
            min={min}
            max={max}
            value={value}
            onChange={(e) =>
                onChange(
                    Math.max(min, Math.min(max, Math.round(+e.target.value))),
                )
            }
            style={{
                width: width ?? 72,
                background: '#111',
                color: '#ddd',
                border: '1px solid #333',
                borderRadius: 6,
                padding: '4px 6px',
            }}
        />
    </label>
)

export default FieldNumber
