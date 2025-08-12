import { FC } from 'react'

const btnStyle: React.CSSProperties = {
    background: '#2b2b2b',
    color: '#fff',
    border: '1px solid #3a3a3a',
    borderRadius: 8,
    padding: '6px 10px',
}

const KernelActions: FC<{ onApply: () => void; onReset: () => void }> = ({
    onApply,
    onReset,
}) => (
    <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onApply} style={btnStyle}>
            Применить
        </button>
        <button onClick={onReset} style={btnStyle}>
            Сброс
        </button>
    </div>
)

export default KernelActions
