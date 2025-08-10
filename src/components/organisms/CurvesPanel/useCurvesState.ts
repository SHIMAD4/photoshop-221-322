import { useEffect, useMemo, useRef, useState } from 'react'
import {
    Channel,
    clamp127,
    clamp255,
    LutsRGB,
    Point,
} from '../../../types/curves'
import {
    applyCurves,
    applyCurvesGB7,
    type GB7AlphaMode,
} from '../../../utils/curves/applyCurves'
import { asU8 } from '../../../utils/curves/asU8'
import { buildLUT } from '../../../utils/curves/buildLUT'
import {
    calcHistogram,
    calcHistogramGB7,
} from '../../../utils/curves/calcHistogram'

type HistRGB = { r: Uint32Array; g: Uint32Array; b: Uint32Array }
type HistA = { a: Uint32Array }
type HistGB7 = { y: Uint32Array; alpha: Uint32Array }

export type Props =
    | {
          kind: 'rgba'
          imageData: ImageData
          hasAlpha?: boolean
          onPreview?: (img: ImageData | null) => void
          onApply: (img: ImageData) => void
      }
    | {
          kind: 'gb7'
          pixels: Uint8Array
          onPreview?: (pix: Uint8Array | null) => void
          onApply: (pix: Uint8Array) => void
      }

export type DragRef =
    | { scope: 'rgb'; ch: Channel; which: 'p1' | 'p2' }
    | { scope: 'rgbaA'; which: 'p1' | 'p2' }
    | { scope: 'gb7'; which: 'p1' | 'p2' }
    | { scope: 'gb7A' }
    | null

export function useCurvesState(props: Props) {
    const isRGBA = props.kind === 'rgba'
    const hasAlpha = isRGBA ? props.hasAlpha ?? true : false

    const [tabRGBA, setTabRGBA] = useState<'rgb' | 'alpha'>('rgb')
    const [tabGB7, setTabGB7] = useState<'y' | 'alpha'>('y')
    const [preview, setPreview] = useState(true)
    const [linkRGB, setLinkRGB] = useState(true)

    const [pts, setPts] = useState<Record<Channel, { p1: Point; p2: Point }>>({
        r: { p1: { x: 0, y: 0 }, p2: { x: 255, y: 255 } },
        g: { p1: { x: 0, y: 0 }, p2: { x: 255, y: 255 } },
        b: { p1: { x: 0, y: 0 }, p2: { x: 255, y: 255 } },
    })
    const [ptsA, setPtsA] = useState<{ p1: Point; p2: Point }>({
        p1: { x: 0, y: 0 },
        p2: { x: 255, y: 255 },
    })
    const [ptsGB, setPtsGB] = useState<{ p1: Point; p2: Point }>({
        p1: { x: 0, y: 0 },
        p2: { x: 127, y: 127 },
    })

    const [alphaMode, setAlphaMode] = useState<GB7AlphaMode>({
        mode: 'preserve',
    })
    const [alphaThreshold, setAlphaThreshold] = useState(64)
    const [alphaInvert, setAlphaInvert] = useState(false)

    const dragRef = useRef<DragRef>(null)

    const rgbaProps = isRGBA ? props : undefined
    const gb7Props = !isRGBA ? props : undefined

    const histRGBA_RGB: HistRGB | null = useMemo(() => {
        if (!isRGBA || !rgbaProps) return null
        return calcHistogram(rgbaProps.imageData) as unknown as HistRGB
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRGBA, rgbaProps?.imageData])

    const histRGBA_A: HistA | null = useMemo(() => {
        if (!isRGBA || !rgbaProps) return null
        return calcHistogram(rgbaProps.imageData, {
            alphaOnly: true,
        }) as unknown as HistA
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRGBA, rgbaProps?.imageData])

    const histGB7: HistGB7 | null = useMemo(() => {
        if (isRGBA || !gb7Props) return null
        return calcHistogramGB7(gb7Props.pixels) as unknown as HistGB7
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRGBA, gb7Props?.pixels])

    const lutsRGB: LutsRGB | null = useMemo(() => {
        if (!isRGBA) return null
        return {
            r: buildLUT(pts.r.p1.x, pts.r.p1.y, pts.r.p2.x, pts.r.p2.y, 255),
            g: buildLUT(pts.g.p1.x, pts.g.p1.y, pts.g.p2.x, pts.g.p2.y, 255),
            b: buildLUT(pts.b.p1.x, pts.b.p1.y, pts.b.p2.x, pts.b.p2.y, 255),
        }
    }, [isRGBA, pts])

    const lutA: Uint8ClampedArray | null = useMemo(() => {
        if (!isRGBA) return null
        return buildLUT(ptsA.p1.x, ptsA.p1.y, ptsA.p2.x, ptsA.p2.y, 255)
    }, [isRGBA, ptsA])

    const lutGB7: Uint8ClampedArray | null = useMemo(() => {
        if (isRGBA) return null
        return buildLUT(ptsGB.p1.x, ptsGB.p1.y, ptsGB.p2.x, ptsGB.p2.y, 127)
    }, [isRGBA, ptsGB])

    useEffect(() => {
        if (!preview) return

        if (isRGBA && rgbaProps) {
            const { imageData, onPreview } = rgbaProps
            if (tabRGBA === 'rgb' && lutsRGB) {
                onPreview?.(
                    applyCurves(imageData, {
                        r: asU8(lutsRGB.r),
                        g: asU8(lutsRGB.g),
                        b: asU8(lutsRGB.b),
                    }),
                )
            } else if (tabRGBA === 'alpha' && lutA) {
                onPreview?.(applyCurves(imageData, { a: asU8(lutA) }))
            }
        } else if (!isRGBA && gb7Props) {
            const { pixels, onPreview } = gb7Props
            if (tabGB7 === 'y' && lutGB7) {
                onPreview?.(
                    applyCurvesGB7(pixels, lutGB7, { mode: 'preserve' }),
                )
            } else if (tabGB7 === 'alpha') {
                if (alphaMode.mode === 'preserve') {
                    onPreview?.(
                        applyCurvesGB7(pixels, undefined, { mode: 'preserve' }),
                    )
                } else {
                    onPreview?.(
                        applyCurvesGB7(
                            pixels,
                            undefined,
                            alphaMode.mode === 'threshold'
                                ? {
                                      mode: 'threshold',
                                      threshold: alphaThreshold,
                                      invert: alphaInvert,
                                  }
                                : alphaMode,
                        ),
                    )
                }
            }
        }
    }, [
        preview,
        isRGBA,
        rgbaProps,
        gb7Props,
        tabRGBA,
        tabGB7,
        lutsRGB,
        lutA,
        lutGB7,
        alphaMode,
        alphaThreshold,
        alphaInvert,
    ])

    const applyNow = () => {
        if (isRGBA && rgbaProps) {
            const { imageData, onApply } = rgbaProps
            if (tabRGBA === 'rgb' && lutsRGB) {
                onApply(
                    applyCurves(imageData, {
                        r: asU8(lutsRGB.r)!,
                        g: asU8(lutsRGB.g)!,
                        b: asU8(lutsRGB.b)!,
                    }),
                )
            } else if (tabRGBA === 'alpha' && lutA) {
                onApply(applyCurves(imageData, { a: asU8(lutA)! }))
            }
        } else if (!isRGBA && gb7Props) {
            const { pixels, onApply } = gb7Props
            if (tabGB7 === 'y' && lutGB7) {
                onApply(
                    applyCurvesGB7(pixels, asU8(lutGB7), { mode: 'preserve' }),
                )
            } else if (tabGB7 === 'alpha') {
                onApply(
                    applyCurvesGB7(
                        pixels,
                        undefined,
                        alphaMode.mode === 'threshold'
                            ? {
                                  mode: 'threshold',
                                  threshold: alphaThreshold,
                                  invert: alphaInvert,
                              }
                            : alphaMode,
                    ),
                )
            }
        }
    }

    const resetAll = () => {
        setPts({
            r: { p1: { x: 0, y: 0 }, p2: { x: 255, y: 255 } },
            g: { p1: { x: 0, y: 0 }, p2: { x: 255, y: 255 } },
            b: { p1: { x: 0, y: 0 }, p2: { x: 255, y: 255 } },
        })
        setPtsA({ p1: { x: 0, y: 0 }, p2: { x: 255, y: 255 } })
        setPtsGB({ p1: { x: 0, y: 0 }, p2: { x: 127, y: 127 } })
        setAlphaMode({ mode: 'preserve' })
        setAlphaThreshold(64)
        setAlphaInvert(false)
    }

    return {
        // discriminators
        isRGBA,
        hasAlpha,
        // tabs & preview
        tabRGBA,
        setTabRGBA,
        tabGB7,
        setTabGB7,
        preview,
        setPreview,
        // link channels
        linkRGB,
        setLinkRGB,
        // points
        pts,
        setPts,
        ptsA,
        setPtsA,
        ptsGB,
        setPtsGB,
        // alpha (gb7)
        alphaMode,
        setAlphaMode,
        alphaThreshold,
        setAlphaThreshold,
        alphaInvert,
        setAlphaInvert,
        // histograms
        histRGBA_RGB,
        histRGBA_A,
        histGB7,
        // LUTs
        lutsRGB,
        lutA,
        lutGB7,
        // drag
        dragRef,
        // helpers (если нужны вне)
        clampX255: (v: number) => clamp255(v),
        clampX127: (v: number) => clamp127(v),
        // actions
        applyNow,
        resetAll,
    }
}
