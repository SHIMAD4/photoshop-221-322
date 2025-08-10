import { FC, useRef } from 'react'
import { Channel, channelColor, H255, W255 } from '../../../types/curves'
import { curvePath, histPath255 } from '../../../utils/curves/ui'

type Point = { x: number; y: number }
export type RGBState = Record<Channel, { p1: Point; p2: Point }>

export type CurvesGraphRGBProps = {
    points: RGBState
    luts: {
        r?: Uint8Array | Uint8ClampedArray
        g?: Uint8Array | Uint8ClampedArray
        b?: Uint8Array | Uint8ClampedArray
    }
    hist?: { r: Uint32Array; g: Uint32Array; b: Uint32Array } | null
    onMouseDown: (
        ch: Channel,
        which: 'p1' | 'p2',
        e: React.MouseEvent<SVGCircleElement>,
    ) => void
    onMouseMove: (e: React.MouseEvent<SVGSVGElement>) => void
    onMouseUp: () => void
}

const CurvesGraphRGB: FC<CurvesGraphRGBProps> = ({
    points,
    luts,
    hist,
    onMouseDown,
    onMouseMove,
    onMouseUp,
}) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    return (
        <svg
            ref={svgRef}
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
                <>
                    <polyline
                        points={histPath255(hist.r)}
                        fill='none'
                        stroke='#ff4d4f33'
                        strokeWidth='1'
                    />
                    <polyline
                        points={histPath255(hist.g)}
                        fill='none'
                        stroke='#52c41a33'
                        strokeWidth='1'
                    />
                    <polyline
                        points={histPath255(hist.b)}
                        fill='none'
                        stroke='#1890ff33'
                        strokeWidth='1'
                    />
                </>
            )}
            {luts.r && (
                <polyline
                    points={curvePath(luts.r, 255)}
                    fill='none'
                    stroke={channelColor.r}
                    strokeWidth='2'
                />
            )}
            {luts.g && (
                <polyline
                    points={curvePath(luts.g, 255)}
                    fill='none'
                    stroke={channelColor.g}
                    strokeWidth='2'
                />
            )}
            {luts.b && (
                <polyline
                    points={curvePath(luts.b, 255)}
                    fill='none'
                    stroke={channelColor.b}
                    strokeWidth='2'
                />
            )}
            {(['r', 'g', 'b'] as Channel[]).map((ch) => (
                <g key={ch}>
                    <circle
                        cx={points[ch].p1.x}
                        cy={H255 - points[ch].p1.y}
                        r={4}
                        fill={channelColor[ch]}
                        onMouseDown={(e) => onMouseDown(ch, 'p1', e)}
                    />
                    <circle
                        cx={points[ch].p2.x}
                        cy={H255 - points[ch].p2.y}
                        r={4}
                        fill={channelColor[ch]}
                        onMouseDown={(e) => onMouseDown(ch, 'p2', e)}
                    />
                    <line
                        x1={0}
                        y1={H255 - points[ch].p1.y}
                        x2={points[ch].p1.x}
                        y2={H255 - points[ch].p1.y}
                        stroke={channelColor[ch]}
                        strokeDasharray='4 4'
                    />
                    <line
                        x1={points[ch].p2.x}
                        y1={H255 - points[ch].p2.y}
                        x2={W255}
                        y2={H255 - points[ch].p2.y}
                        stroke={channelColor[ch]}
                        strokeDasharray='4 4'
                    />
                </g>
            ))}
        </svg>
    )
}

export default CurvesGraphRGB
