import { FC } from 'react'
import { H127, W127 } from '../../../types/curves'
import { curvePath, histPath127 } from '../../../utils/curves/ui'

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

const CurvesGraphGB7Y: FC<Props> = ({
    p1,
    p2,
    lut,
    hist,
    onMouseDown,
    onMouseMove,
    onMouseUp,
}) => (
    <svg
        width={W127}
        height={H127}
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
        viewBox={`0 0 ${W127} ${H127}`}
    >
        <path d={`M0 ${H127} L ${W127} 0`} stroke='#555' strokeWidth='1' />
        {hist && (
            <polyline
                points={histPath127(hist)}
                fill='none'
                stroke='#ffffff55'
                strokeWidth='1'
            />
        )}
        {lut && (
            <>
                <polyline
                    points={curvePath(lut, 127)}
                    fill='none'
                    stroke='#ffffff'
                    strokeWidth='2'
                />
                <circle
                    cx={p1.x}
                    cy={H127 - p1.y}
                    r={4}
                    fill='#fff'
                    onMouseDown={(e) => onMouseDown('p1', e)}
                />
                <circle
                    cx={p2.x}
                    cy={H127 - p2.y}
                    r={4}
                    fill='#fff'
                    onMouseDown={(e) => onMouseDown('p2', e)}
                />
                <line
                    x1={0}
                    y1={H127 - p1.y}
                    x2={W127}
                    y2={H127 - p1.y}
                    stroke='#ffffff88'
                    strokeDasharray='4 4'
                />
                <line
                    x1={0}
                    y1={H127 - p2.y}
                    x2={W127}
                    y2={H127 - p2.y}
                    stroke='#ffffff88'
                    strokeDasharray='4 4'
                />
            </>
        )}
    </svg>
)

export default CurvesGraphGB7Y
