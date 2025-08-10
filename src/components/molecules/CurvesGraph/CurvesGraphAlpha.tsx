import { FC } from 'react'
import { H255, W255 } from '../../../types/curves'
import { curvePath, histPath255 } from '../../../utils/curves/ui'

type Point = { x: number; y: number }

type Props = {
    p1: Point
    p2: Point
    lut?: Uint8Array | Uint8ClampedArray | null
    hist?: Uint32Array | null
    onMouseDown: (
        which: 'p1' | 'p2',
        e: React.MouseEvent<SVGCircleElement>,
    ) => void
    onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void
    onMouseUp: () => void
}

const CurvesGraphAlpha: FC<Props> = ({
    p1,
    p2,
    lut,
    hist,
    onMouseDown,
    onMouseMove,
    onMouseUp,
}) => (
    <svg
        width={W255}
        height={H255}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        style={{
            background: '#111',
            borderRadius: 8,
            touchAction: 'none',
            userSelect: 'none',
            width: '100%',
            height: 'auto',
        }}
        viewBox={`0 0 ${W255} ${H255}`}
    >
        <path d={`M0 ${H255} L ${W255} 0`} stroke='#555' strokeWidth='1' />
        {hist && (
            <polyline
                points={histPath255(hist)}
                fill='none'
                stroke='#bbbbff44'
                strokeWidth='1'
            />
        )}
        {lut && (
            <>
                <polyline
                    points={curvePath(lut, 255)}
                    fill='none'
                    stroke='#bbbbff'
                    strokeWidth='2'
                />
                <circle
                    cx={p1.x}
                    cy={H255 - p1.y}
                    r={4}
                    fill='#bbbbff'
                    onMouseDown={(e) => onMouseDown('p1', e)}
                />
                <circle
                    cx={p2.x}
                    cy={H255 - p2.y}
                    r={4}
                    fill='#bbbbff'
                    onMouseDown={(e) => onMouseDown('p2', e)}
                />
                <line
                    x1={0}
                    y1={H255 - p1.y}
                    x2={W255}
                    y2={H255 - p1.y}
                    stroke='#bbbbff88'
                    strokeDasharray='4 4'
                />
                <line
                    x1={0}
                    y1={H255 - p2.y}
                    x2={W255}
                    y2={H255 - p2.y}
                    stroke='#bbbbff88'
                    strokeDasharray='4 4'
                />
            </>
        )}
    </svg>
)

export default CurvesGraphAlpha
