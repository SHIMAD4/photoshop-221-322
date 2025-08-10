import React, { FC, useMemo, useRef } from 'react'

const clamp = (v: number, lo: number, hi: number) =>
    v < lo ? lo : v > hi ? hi : v

export const CurvesGraph: FC<{
    width: number
    height: number
    max: number
    histR?: number[]
    histG?: number[]
    histB?: number[]
    histSingle?: number[]
    in1: number
    out1: number
    in2: number
    out2: number
    onDragPoint?: (which: 1 | 2, x: number, y: number) => void
}> = ({
    width,
    height,
    max,
    histR,
    histG,
    histB,
    histSingle,
    in1,
    out1,
    in2,
    out2,
    onDragPoint,
}) => {
    const vbX = max + 1
    const vbY = max + 1
    const toY = (v: number) => vbY - 1 - v * (vbY - 1)
    const lineFromHist = (h?: number[]) =>
        h && h.length
            ? 'M ' + h.map((v, i) => `${i},${toY(v)}`).join(' L ')
            : ''

    const curvePath = useMemo(() => {
        const x1 = clamp(in1, 0, max)
        const x2 = clamp(in2, 0, max)
        const y1 = vbY - 1 - clamp(out1, 0, max)
        const y2 = vbY - 1 - clamp(out2, 0, max)
        const xl = Math.min(x1, x2)
        const xr = Math.max(x1, x2)
        const yl = x1 <= x2 ? y1 : y2
        const yr = x1 <= x2 ? y2 : y1
        return `M 0 ${yl} L ${xl} ${yl} L ${xr} ${yr} L ${vbX - 1} ${yr}`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [in1, in2, out1, out2, max])

    const svgRef = useRef<SVGSVGElement | null>(null)
    const dragState = useRef<{ which: 1 | 2 | null }>({ which: null })

    const onPointerDown = (e: React.PointerEvent, which: 1 | 2) => {
        ;(e.target as Element).setPointerCapture(e.pointerId)
        dragState.current.which = which
    }
    const onPointerUp = (e: React.PointerEvent) => {
        try {
            ;(e.target as Element).releasePointerCapture(e.pointerId)
        } catch {
            console.log(e.target)
        }
        dragState.current.which = null
    }
    const onPointerMove = (e: React.PointerEvent) => {
        const which = dragState.current.which
        if (!which || !onDragPoint || !svgRef.current) return
        const rect = svgRef.current.getBoundingClientRect()
        const px = clamp((e.clientX - rect.left) / rect.width, 0, 1)
        const py = clamp((e.clientY - rect.top) / rect.height, 0, 1)
        const x = Math.round(px * (vbX - 1))
        const y = Math.round(py * (vbY - 1))
        const valueY = vbY - 1 - y
        onDragPoint(which, x, valueY)
    }

    const x1 = clamp(in1, 0, max)
    const x2 = clamp(in2, 0, max)
    const y1 = vbY - 1 - clamp(out1, 0, max)
    const y2 = vbY - 1 - clamp(out2, 0, max)

    return (
        <svg
            ref={svgRef}
            viewBox={`0 0 ${vbX} ${vbY}`}
            width={width}
            height={height}
            style={{
                background: '#0b0b0b',
                borderRadius: 8,
                display: 'block',
                width: '100%',
                height: 'auto',
            }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            {histR && (
                <path
                    d={lineFromHist(histR)}
                    fill='none'
                    stroke='rgba(255,0,0,.8)'
                    strokeWidth={1}
                />
            )}
            {histG && (
                <path
                    d={lineFromHist(histG)}
                    fill='none'
                    stroke='rgba(0,255,0,.8)'
                    strokeWidth={1}
                />
            )}
            {histB && (
                <path
                    d={lineFromHist(histB)}
                    fill='none'
                    stroke='rgba(0,192,255,.8)'
                    strokeWidth={1}
                />
            )}
            {histSingle && (
                <path
                    d={lineFromHist(histSingle)}
                    fill='none'
                    stroke='rgba(255,255,255,.9)'
                    strokeWidth={1}
                />
            )}
            <path d={curvePath} fill='none' stroke='#fff' strokeWidth={1.5} />
            <circle
                cx={x1}
                cy={y1}
                r={3}
                fill='#fff'
                onPointerDown={(e) => onPointerDown(e, 1)}
                style={{ cursor: 'grab' }}
            />
            <circle
                cx={x2}
                cy={y2}
                r={3}
                fill='#fff'
                onPointerDown={(e) => onPointerDown(e, 2)}
                style={{ cursor: 'grab' }}
            />
        </svg>
    )
}
