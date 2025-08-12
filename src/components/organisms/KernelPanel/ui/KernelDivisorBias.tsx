import { FC } from 'react'

const inputStyle: React.CSSProperties = {
    background: '#2b2b2b',
    color: '#fff',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    padding: '6px 10px',
    minWidth: 40,
}

const KernelDivisorBias: FC<{
    divisor: number | ''
    bias: number | ''
    onChangeDivisor: (v: number | '') => void
    onChangeBias: (v: number | '') => void
}> = ({ divisor, bias, onChangeDivisor, onChangeBias }) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#bbb' }}>
                Divisor (∑, если пусто)
            </span>
            <input
                type='number'
                value={divisor}
                onChange={(e) =>
                    onChangeDivisor(
                        e.target.value === '' ? '' : Number(e.target.value),
                    )
                }
                step='1'
                style={inputStyle}
            />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#bbb' }}>Bias</span>
            <input
                type='number'
                value={bias}
                onChange={(e) =>
                    onChangeBias(
                        e.target.value === '' ? '' : Number(e.target.value),
                    )
                }
                step='1'
                style={inputStyle}
            />
        </label>
    </div>
)

export default KernelDivisorBias
