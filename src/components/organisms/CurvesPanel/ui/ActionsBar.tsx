import { FC } from 'react'
import Button from '../../../atoms/Button'

const ActionsBar: FC<{ onApply: () => void; onReset: () => void }> = ({
    onApply,
    onReset,
}) => (
    <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={onApply}>Применить</Button>
        <Button onClick={onReset}>Сброс</Button>
    </div>
)

export default ActionsBar
