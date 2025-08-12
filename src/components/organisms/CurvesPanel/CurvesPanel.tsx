import { FC } from 'react'
import { Channel } from '../../../types/curves'
import CurvesAlphaGB7Panel from '../../molecules/CurvesGraph/CurvesAlphaGB7Panel'
import CurvesGraphAlpha from '../../molecules/CurvesGraph/CurvesGraphAlpha'
import CurvesGraphGB7Y from '../../molecules/CurvesGraph/CurvesGraphGB7Y'
import CurvesGraphRGB from '../../molecules/CurvesGraph/CurvesGraphRGB'
import ActionsBar from './ui/ActionsBar'
import AlphaControls from './ui/AlphaControls'
import CurvesPanelHeader from './ui/CurvesPanelHeader'
import CurvesTabs from './ui/CurvesTabs'
import GB7Controls from './ui/GB7Controls'
import GB7Threshold from './ui/GB7Threshold'
import RGBAControls from './ui/RGBControls'
import { Props as UseCurvesProps, useCurvesState } from './useCurvesState'

export type Props =
    | {
          kind: 'rgba'
          imageData: ImageData
          hasAlpha?: boolean
          onPreview?: (img: ImageData | null) => void
          onApply: (img: ImageData) => void
          onClose?: () => void
      }
    | {
          kind: 'gb7'
          pixels: Uint8Array
          onPreview?: (pix: Uint8Array | null) => void
          onApply: (pix: Uint8Array) => void
          onClose?: () => void
      }

const CurvesPanel: FC<Props> = (props) => {
    const s = useCurvesState(props as UseCurvesProps)

    const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const svg = (e.target as SVGElement).closest('svg')
        if (!svg) return
        const rect = svg.getBoundingClientRect()
        const is127 = !s.isRGBA
        const w = is127 ? 128 : 256
        const h = is127 ? 128 : 256
        const clampX = (v: number) =>
            Math.max(0, Math.min(w - 1, Math.round(v)))
        const clampY = (v: number) =>
            Math.max(0, Math.min(h - 1, Math.round(v)))
        const x = clampX(((e.clientX - rect.left) / rect.width) * (w - 1))
        const y = clampY(
            h - 1 - ((e.clientY - rect.top) / rect.height) * (h - 1),
        )

        const drag = s.dragRef.current
        if (!drag) return
        if (drag.scope === 'rgb') {
            s.setPts((prev) => {
                const next = structuredClone(prev)
                if (s.linkRGB)
                    (['r', 'g', 'b'] as Channel[]).forEach(
                        (cc) => (next[cc][drag.which] = { x, y }),
                    )
                else next[drag.ch][drag.which] = { x, y }
                return next
            })
        } else if (drag.scope === 'rgbaA') {
            s.setPtsA((prev) => ({ ...prev, [drag.which]: { x, y } }))
        } else if (drag.scope === 'gb7') {
            s.setPtsGB((prev) => ({ ...prev, [drag.which]: { x, y } }))
        } else if (drag.scope === 'gb7A') {
            s.setAlphaThreshold(x)
        }
    }

    const onMouseDownRGB = (
        ch: Channel,
        which: 'p1' | 'p2',
        e: React.MouseEvent<SVGCircleElement>,
    ) => {
        e.preventDefault()
        s.dragRef.current = { scope: 'rgb', ch, which }
    }
    const onMouseDownA = (
        which: 'p1' | 'p2',
        e: React.MouseEvent<SVGCircleElement>,
    ) => {
        e.preventDefault()
        s.dragRef.current = { scope: 'rgbaA', which }
    }
    const onMouseDownGB7 = (
        which: 'p1' | 'p2',
        e: React.MouseEvent<SVGCircleElement>,
    ) => {
        e.preventDefault()
        s.dragRef.current = { scope: 'gb7', which }
    }
    const onMouseDownGB7A = (e: React.MouseEvent<SVGElement>) => {
        e.preventDefault()
        s.dragRef.current = { scope: 'gb7A' }
        const svg = (e.target as SVGElement).closest('svg')
        if (!svg) return
        const rect = svg.getBoundingClientRect()
        const x = Math.max(
            0,
            Math.min(
                127,
                Math.round(((e.clientX - rect.left) / rect.width) * 127),
            ),
        )
        s.setAlphaThreshold(x)
    }

    const title = s.isRGBA
        ? s.tabRGBA === 'rgb'
            ? 'Кривые (RGBA) — RGB'
            : 'Кривые (RGBA) — Alpha'
        : s.tabGB7 === 'y'
        ? 'Кривые (GB7) — Y'
        : 'Кривые (GB7) — Alpha'

    return (
        <aside
            style={{
                width: 420,
                minWidth: 420,
                background: '#1e1e1e',
                color: '#eee',
                borderLeft: '1px solid #2a2a2a',
                padding: 12,
                display: 'grid',
                gap: 12,
            }}
        >
            {/* Header */}
            <CurvesPanelHeader
                title={title}
                preview={s.preview}
                onTogglePreview={s.setPreview}
                onClose={'onClose' in props ? props.onClose : undefined}
            />

            {/* Tabs */}
            <CurvesTabs
                {...(s.isRGBA
                    ? {
                          kind: 'rgba' as const,
                          tab: s.tabRGBA,
                          setTab: s.setTabRGBA,
                          hasAlpha: s.hasAlpha,
                      }
                    : {
                          kind: 'gb7' as const,
                          tab: s.tabGB7,
                          setTab: s.setTabGB7,
                      })}
            />

            {/* Graphs */}
            {s.isRGBA ? (
                s.tabRGBA === 'rgb' ? (
                    <CurvesGraphRGB
                        points={s.pts}
                        luts={{
                            r: s.lutsRGB?.r,
                            g: s.lutsRGB?.g,
                            b: s.lutsRGB?.b,
                        }}
                        hist={s.histRGBA_RGB}
                        onMouseDown={onMouseDownRGB}
                        onMouseMove={onMouseMove}
                        onMouseUp={() => (s.dragRef.current = null)}
                    />
                ) : (
                    <CurvesGraphAlpha
                        p1={s.ptsA.p1}
                        p2={s.ptsA.p2}
                        lut={s.lutA ?? undefined}
                        hist={s.histRGBA_A?.a ?? null}
                        onMouseDown={onMouseDownA}
                        onMouseMove={onMouseMove}
                        onMouseUp={() => (s.dragRef.current = null)}
                    />
                )
            ) : s.tabGB7 === 'y' ? (
                <CurvesGraphGB7Y
                    p1={s.ptsGB.p1}
                    p2={s.ptsGB.p2}
                    lut={s.lutGB7 ?? undefined}
                    hist={s.histGB7?.y ?? null}
                    onMouseDown={onMouseDownGB7}
                    onMouseMove={onMouseMove}
                    onMouseUp={() => (s.dragRef.current = null)}
                />
            ) : (
                <>
                    <GB7Threshold
                        histY={s.histGB7?.y ?? null}
                        threshold={s.alphaThreshold}
                        setThreshold={s.setAlphaThreshold}
                        onMouseMove={onMouseMove}
                        onMouseUp={() => (s.dragRef.current = null)}
                        onMouseDown={onMouseDownGB7A}
                    />
                    <CurvesAlphaGB7Panel
                        histogram={s.histGB7}
                        mode={s.alphaMode}
                        setMode={s.setAlphaMode}
                        threshold={s.alphaThreshold}
                        setThreshold={s.setAlphaThreshold}
                        invert={s.alphaInvert}
                        setInvert={s.setAlphaInvert}
                    />
                </>
            )}

            {/* Controls */}
            {s.isRGBA ? (
                s.tabRGBA === 'rgb' ? (
                    <RGBAControls
                        pts={s.pts}
                        setPts={s.setPts}
                        linkRGB={s.linkRGB}
                        setLinkRGB={s.setLinkRGB}
                    />
                ) : (
                    <AlphaControls
                        p1={s.ptsA.p1}
                        p2={s.ptsA.p2}
                        setP1={(p) => s.setPtsA((prev) => ({ ...prev, p1: p }))}
                        setP2={(p) => s.setPtsA((prev) => ({ ...prev, p2: p }))}
                    />
                )
            ) : s.tabGB7 === 'y' ? (
                <GB7Controls
                    p1={s.ptsGB.p1}
                    p2={s.ptsGB.p2}
                    setP1={(p) => s.setPtsGB((prev) => ({ ...prev, p1: p }))}
                    setP2={(p) => s.setPtsGB((prev) => ({ ...prev, p2: p }))}
                />
            ) : null}

            <ActionsBar
                onApply={() => {
                    s.applyNow()
                    if ('onClose' in props && props.onClose) props.onClose()
                }}
                onReset={s.resetAll}
            />
        </aside>
    )
}

export default CurvesPanel
