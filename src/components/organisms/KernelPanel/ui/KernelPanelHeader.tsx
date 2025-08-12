import { FC } from 'react'

type Props = {
    modeLabel: string
    live: boolean
    onToggleLive: (v: boolean) => void
    onClose?: () => void
}
const KernelPanelHeader: FC<Props> = ({
    modeLabel,
    live,
    onToggleLive,
    onClose,
}) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
        }}
    >
        <div style={{ fontWeight: 600 }}>Custom фильтр (3×3) — {modeLabel}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                    type='checkbox'
                    checked={live}
                    onChange={(e) => onToggleLive(e.target.checked)}
                />
                Предпросмотр
            </label>
            {onClose && (
                <button
                    aria-label='Закрыть'
                    onClick={onClose}
                    title='Закрыть'
                    style={{
                        width: 32,
                        height: 32,
                        lineHeight: '30px',
                        borderRadius: 8,
                        border: '1px solid #3a3a3a',
                        background: '#2b2b2b',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 18,
                        padding: 0,
                    }}
                >
                    ×
                </button>
            )}
        </div>
    </div>
)

export default KernelPanelHeader
