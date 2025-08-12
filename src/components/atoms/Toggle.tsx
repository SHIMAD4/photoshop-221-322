import { FC } from 'react'

const Toggle: FC<{
    checked: boolean
    onChange: (v: boolean) => void
    label?: string
}> = ({ checked, onChange, label }) => (
    <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
            type='checkbox'
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        {label && <span>{label}</span>}
    </label>
)

export default Toggle
