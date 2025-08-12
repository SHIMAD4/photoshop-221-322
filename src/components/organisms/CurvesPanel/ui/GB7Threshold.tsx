import { FC } from 'react'
import { histPath127 } from '../../../../utils/curves/ui'

type Props = {
    histY?: Uint32Array | null
    threshold: number
    setThreshold: (v: number) => void
    onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void
    onMouseUp: () => void
    onMouseDown: (e: React.MouseEvent<SVGElement>) => void
}
const GB7Threshold: FC<Props> = ({
    histY,
    threshold,
    onMouseMove,
    onMouseUp,
    onMouseDown,
}) => (
    <svg
        width={128}
        height={128}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        style={{
            background: '#111',
            borderRadius: 8,
            touchAction: 'none',
            userSelect: 'none',
            width: '100%',
            height: 'auto',
            cursor: 'ew-resize',
        }}
        viewBox='0 0 128 128'
    >
        <path d='M0 128 L 128 0' stroke='#555' strokeWidth='1' />
        {histY && (
            <polyline
                points={histPath127(histY)}
                fill='none'
                stroke='#bbbbff66'
                strokeWidth='1'
            />
        )}
        <line
            x1={threshold}
            y1={0}
            x2={threshold}
            y2={128}
            stroke='#bbbbff'
            strokeWidth='2'
            strokeDasharray='4 4'
        />
        <circle
            cx={threshold}
            cy={Math.floor(128 * 0.15)}
            r={4}
            fill='#bbbbff'
            onMouseDown={onMouseDown}
        />
    </svg>
)
export default GB7Threshold
