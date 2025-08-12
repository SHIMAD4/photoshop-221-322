import { FC } from 'react'
import IconButton from '../../../atoms/IconButton'
import Toggle from '../../../atoms/Toggle'

const CurvesPanelHeader: FC<{
    title: string
    preview: boolean
    onTogglePreview: (v: boolean) => void
    onClose?: () => void
}> = ({ title, preview, onTogglePreview, onClose }) => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
        }}
    >
        <div style={{ fontWeight: 600 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Toggle
                checked={preview}
                onChange={onTogglePreview}
                label='Предпросмотр'
            />
            {onClose && <IconButton title='Закрыть' onClick={onClose} />}
        </div>
    </div>
)
export default CurvesPanelHeader
