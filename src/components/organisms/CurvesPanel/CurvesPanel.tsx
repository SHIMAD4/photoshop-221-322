import { FC } from 'react'
import { Channel, channelColor } from '../../../types/curves'
import { histPath127 } from '../../../utils/curves/ui'
import FieldNumber from '../../atoms/FieldNumber'
import TabButton from '../../atoms/TabButton'
import CurvesAlphaGB7Panel from '../../molecules/CurvesGraph/CurvesAlphaGB7Panel'
import CurvesGraphAlpha from '../../molecules/CurvesGraph/CurvesGraphAlpha'
import CurvesGraphGB7Y from '../../molecules/CurvesGraph/CurvesGraphGB7Y'
import CurvesGraphRGB from '../../molecules/CurvesGraph/CurvesGraphRGB'
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
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                }}
            >
                <div style={{ fontWeight: 600 }}>
                    {s.isRGBA
                        ? s.tabRGBA === 'rgb'
                            ? 'Кривые (RGBA) — RGB'
                            : 'Кривые (RGBA) — Alpha'
                        : s.tabGB7 === 'y'
                        ? 'Кривые (GB7) — Y'
                        : 'Кривые (GB7) — Alpha'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type='checkbox'
                            checked={s.preview}
                            onChange={(e) => s.setPreview(e.target.checked)}
                        />
                        Предпросмотр
                    </label>
                    {'onClose' in props && props.onClose && (
                        <button
                            aria-label='Закрыть'
                            onClick={props.onClose}
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

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8 }}>
                {s.isRGBA ? (
                    <>
                        <TabButton
                            active={s.tabRGBA === 'rgb'}
                            onClick={() => s.setTabRGBA('rgb')}
                        >
                            RGB
                        </TabButton>
                        {s.hasAlpha && (
                            <TabButton
                                active={s.tabRGBA === 'alpha'}
                                onClick={() => s.setTabRGBA('alpha')}
                            >
                                Alpha
                            </TabButton>
                        )}
                    </>
                ) : (
                    <>
                        <TabButton
                            active={s.tabGB7 === 'y'}
                            onClick={() => s.setTabGB7('y')}
                        >
                            Y
                        </TabButton>
                        <TabButton
                            active={s.tabGB7 === 'alpha'}
                            onClick={() => s.setTabGB7('alpha')}
                        >
                            Alpha
                        </TabButton>
                    </>
                )}
            </div>

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
                    {/* Threshold chart */}
                    <svg
                        width={128}
                        height={128}
                        onMouseMove={onMouseMove}
                        onMouseUp={() => (s.dragRef.current = null)}
                        onMouseDown={onMouseDownGB7A}
                        style={{
                            background: '#111',
                            borderRadius: 8,
                            touchAction: 'none',
                            userSelect: 'none',
                            width: '100%',
                            height: 'auto',
                            cursor: 'ew-resize',
                        }}
                        viewBox={`0 0 128 128`}
                    >
                        <path
                            d={`M0 128 L 128 0`}
                            stroke='#555'
                            strokeWidth='1'
                        />
                        {s.histGB7?.y && (
                            <polyline
                                points={histPath127(s.histGB7.y)}
                                fill='none'
                                stroke='#bbbbff66'
                                strokeWidth='1'
                            />
                        )}
                        <line
                            x1={s.alphaThreshold}
                            y1={0}
                            x2={s.alphaThreshold}
                            y2={128}
                            stroke='#bbbbff'
                            strokeWidth='2'
                            strokeDasharray='4 4'
                        />
                        <circle
                            cx={s.alphaThreshold}
                            cy={Math.floor(128 * 0.15)}
                            r={4}
                            fill='#bbbbff'
                            onMouseDown={onMouseDownGB7A}
                        />
                    </svg>
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
                    <>
                        <label
                            style={{
                                display: 'flex',
                                gap: 8,
                                alignItems: 'center',
                            }}
                        >
                            <input
                                type='checkbox'
                                checked={s.linkRGB}
                                onChange={(e) => s.setLinkRGB(e.target.checked)}
                            />
                            Связать каналы (двигать одну линию по всем 3
                            каналам)
                        </label>
                        {(['r', 'g', 'b'] as Channel[]).map((ch) => (
                            <div
                                key={ch}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 8,
                                    alignItems: 'center',
                                }}
                            >
                                <strong
                                    style={{
                                        color: channelColor[ch],
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {ch}
                                </strong>
                                <FieldNumber
                                    label='x₁'
                                    min={0}
                                    max={255}
                                    value={s.pts[ch].p1.x}
                                    onChange={(v) =>
                                        s.setPts((prev) => ({
                                            ...prev,
                                            [ch]: {
                                                ...prev[ch],
                                                p1: { ...prev[ch].p1, x: v },
                                            },
                                        }))
                                    }
                                />
                                <FieldNumber
                                    label='y₁'
                                    min={0}
                                    max={255}
                                    value={s.pts[ch].p1.y}
                                    onChange={(v) =>
                                        s.setPts((prev) => ({
                                            ...prev,
                                            [ch]: {
                                                ...prev[ch],
                                                p1: { ...prev[ch].p1, y: v },
                                            },
                                        }))
                                    }
                                />
                                <span />
                                <span />
                                <FieldNumber
                                    label='x₂'
                                    min={0}
                                    max={255}
                                    value={s.pts[ch].p2.x}
                                    onChange={(v) =>
                                        s.setPts((prev) => ({
                                            ...prev,
                                            [ch]: {
                                                ...prev[ch],
                                                p2: { ...prev[ch].p2, x: v },
                                            },
                                        }))
                                    }
                                />
                                <FieldNumber
                                    label='y₂'
                                    min={0}
                                    max={255}
                                    value={s.pts[ch].p2.y}
                                    onChange={(v) =>
                                        s.setPts((prev) => ({
                                            ...prev,
                                            [ch]: {
                                                ...prev[ch],
                                                p2: { ...prev[ch].p2, y: v },
                                            },
                                        }))
                                    }
                                />
                                <span />
                            </div>
                        ))}
                    </>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 8,
                        }}
                    >
                        <strong style={{ color: '#bbbbff' }}>
                            Alpha (0..255)
                        </strong>
                        <FieldNumber
                            label='x₁'
                            min={0}
                            max={255}
                            value={s.ptsA.p1.x}
                            onChange={(v) =>
                                s.setPtsA((p) => ({
                                    ...p,
                                    p1: { ...p.p1, x: v },
                                }))
                            }
                        />
                        <FieldNumber
                            label='y₁'
                            min={0}
                            max={255}
                            value={s.ptsA.p1.y}
                            onChange={(v) =>
                                s.setPtsA((p) => ({
                                    ...p,
                                    p1: { ...p.p1, y: v },
                                }))
                            }
                        />
                        <span />
                        <span />
                        <FieldNumber
                            label='x₂'
                            min={0}
                            max={255}
                            value={s.ptsA.p2.x}
                            onChange={(v) =>
                                s.setPtsA((p) => ({
                                    ...p,
                                    p2: { ...p.p2, x: v },
                                }))
                            }
                        />
                        <FieldNumber
                            label='y₂'
                            min={0}
                            max={255}
                            value={s.ptsA.p2.y}
                            onChange={(v) =>
                                s.setPtsA((p) => ({
                                    ...p,
                                    p2: { ...p.p2, y: v },
                                }))
                            }
                        />
                        <span />
                    </div>
                )
            ) : s.tabGB7 === 'y' ? (
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
                        value={s.ptsGB.p1.x}
                        onChange={(v) =>
                            s.setPtsGB((p) => ({ ...p, p1: { ...p.p1, x: v } }))
                        }
                    />
                    <FieldNumber
                        label='y₁'
                        min={0}
                        max={127}
                        value={s.ptsGB.p1.y}
                        onChange={(v) =>
                            s.setPtsGB((p) => ({ ...p, p1: { ...p.p1, y: v } }))
                        }
                    />
                    <span />
                    <span />
                    <FieldNumber
                        label='x₂'
                        min={0}
                        max={127}
                        value={s.ptsGB.p2.x}
                        onChange={(v) =>
                            s.setPtsGB((p) => ({ ...p, p2: { ...p.p2, x: v } }))
                        }
                    />
                    <FieldNumber
                        label='y₂'
                        min={0}
                        max={127}
                        value={s.ptsGB.p2.y}
                        onChange={(v) =>
                            s.setPtsGB((p) => ({ ...p, p2: { ...p.p2, y: v } }))
                        }
                    />
                    <span />
                </div>
            ) : null}

            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    onClick={s.applyNow}
                    style={{
                        background: '#2b2b2b',
                        color: '#fff',
                        border: '1px solid #3a3a3a',
                        borderRadius: 8,
                        padding: '6px 10px',
                    }}
                >
                    Применить
                </button>
                <button
                    onClick={s.resetAll}
                    style={{
                        background: '#2b2b2b',
                        color: '#fff',
                        border: '1px solid #3a3a3a',
                        borderRadius: 8,
                        padding: '6px 10px',
                    }}
                >
                    Сброс
                </button>
            </div>
        </aside>
    )
}

export default CurvesPanel
