import { FC } from 'react'

type Option = { key: string; label: string }

const KernelPresetSelect: FC<{
    value: string
    options: ReadonlyArray<Option>
    onChange: (key: string) => void
}> = ({ value, options, onChange }) => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <label style={{ display: 'grid', gap: 6, minWidth: 280 }}>
            <span style={{ fontSize: 12, color: '#bbb' }}>Предустановка</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    background: '#2b2b2b',
                    color: '#fff',
                    border: '1px solid #3a3a3a',
                    borderRadius: 8,
                    padding: '6px 10px',
                }}
            >
                {options.map((p) => (
                    <option key={p.key} value={p.key}>
                        {p.label}
                    </option>
                ))}
            </select>
        </label>
    </div>
)

export default KernelPresetSelect
