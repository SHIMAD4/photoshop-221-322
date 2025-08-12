import { FC } from 'react'
import FieldNumber from '../../../atoms/FieldNumber'

type Pt = { x: number; y: number }
type Props = {
    p1: Pt
    p2: Pt
    setP1: (p: Pt) => void
    setP2: (p: Pt) => void
}
const GB7Controls: FC<Props> = ({ p1, p2, setP1, setP2 }) => (
    <div
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
        }}
    >
        <strong style={{ color: '#fff' }}>Y (0..127)</strong>
        <FieldNumber
            label='x₁'
            min={0}
            max={127}
            value={p1.x}
            onChange={(v) => setP1({ ...p1, x: v })}
        />
        <FieldNumber
            label='y₁'
            min={0}
            max={127}
            value={p1.y}
            onChange={(v) => setP1({ ...p1, y: v })}
        />
        <span />
        <span />
        <FieldNumber
            label='x₂'
            min={0}
            max={127}
            value={p2.x}
            onChange={(v) => setP2({ ...p2, x: v })}
        />
        <FieldNumber
            label='y₂'
            min={0}
            max={127}
            value={p2.y}
            onChange={(v) => setP2({ ...p2, y: v })}
        />
        <span />
    </div>
)
export default GB7Controls
