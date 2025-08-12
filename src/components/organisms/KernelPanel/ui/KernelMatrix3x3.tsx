import { FC } from 'react'

const cellStyle: React.CSSProperties = {
    background: '#2b2b2b',
    color: '#fff',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    padding: '6px 10px',
}

const KernelMatrix3x3: FC<{
    values: number[]
    onChangeCell: (index: number, next: number) => void
}> = ({ values, onChangeCell }) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 85px)',
            gap: 8,
        }}
    >
        {values.map((v, i) => (
            <input
                key={i}
                type='number'
                value={v}
                onChange={(e) => onChangeCell(i, Number(e.target.value))}
                step='1'
                style={cellStyle}
            />
        ))}
    </div>
)

export default KernelMatrix3x3
