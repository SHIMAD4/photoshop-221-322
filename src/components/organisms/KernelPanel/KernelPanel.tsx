import { FC, useEffect, useMemo, useState } from 'react'
import {
    KERNEL_PRESETS,
    Kernel3x3,
    convolveAlpha3x3,
    convolveRGB3x3,
} from '../../../utils/image/convolution'

type Props = {
    imageData: ImageData
    mode: 'rgb' | 'alpha'
    onPreview?: (img: ImageData | null) => void
    onApply: (img: ImageData) => void
    onClose?: () => void
}

const PRESET_LIST = [
    { key: 'identity', label: 'Тождественное отображение' },
    { key: 'sharpen', label: 'Повышение резкости' },
    { key: 'gauss3', label: 'Фильтр Гаусса (3×3)' },
    { key: 'box', label: 'Прямоугольное размытие' },
    { key: 'prewittX', label: 'Оператор Прюитта (X)' },
    { key: 'prewittY', label: 'Оператор Прюитта (Y)' },
] as const

const toArray = (m: Kernel3x3['m']) => [...m] as number[]

type Num9 = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
]
const asKernel = (
    vals: number[],
    divisor?: number,
    bias?: number,
): Kernel3x3 => {
    const nine = [...vals, 0, 0, 0, 0, 0, 0, 0, 0].slice(
        0,
        9,
    ) as unknown as Num9
    return { m: nine, divisor, bias }
}

const KernelPanel: FC<Props> = ({
    imageData,
    mode,
    onPreview,
    onApply,
    onClose,
}) => {
    const [preset, setPreset] =
        useState<(typeof PRESET_LIST)[number]['key']>('identity')
    const [vals, setVals] = useState<number[]>(
        toArray(KERNEL_PRESETS.identity.m),
    )
    const [divisor, setDivisor] = useState<number | ''>('')
    const [bias, setBias] = useState<number | ''>('')
    const [live, setLive] = useState(true)

    const kernel = useMemo(
        () =>
            asKernel(
                vals,
                divisor === '' ? undefined : Number(divisor),
                bias === '' ? undefined : Number(bias),
            ),
        [vals, divisor, bias],
    )

    const applyKernel = (k: Kernel3x3) =>
        mode === 'alpha'
            ? convolveAlpha3x3(imageData, k)
            : convolveRGB3x3(imageData, k)

    const loadPreset = (key: (typeof PRESET_LIST)[number]['key']) => {
        const k = KERNEL_PRESETS[key]
        setPreset(key)
        setVals(toArray(k.m))
        setDivisor(k.divisor ?? '')
        setBias(k.bias ?? '')
    }

    useEffect(() => {
        loadPreset('identity')
    }, [])

    // Live preview
    useEffect(() => {
        if (!live) return
        const out = applyKernel(kernel)
        onPreview?.(out)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [live, vals, divisor, bias, mode, imageData])

    const handleChangeCell = (idx: number, v: string) => {
        const n = Number(v)
        setVals((prev) =>
            prev.map((x, i) => (i === idx ? (Number.isFinite(n) ? n : 0) : x)),
        )
    }

    const handleApply = () => {
        const out = applyKernel(kernel)
        onApply(out)
        onPreview?.(null)
    }

    const handleReset = () => loadPreset('identity')

    const handleClose = () => {
        onPreview?.(null)
        onClose?.()
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
                    Custom фильтр (3×3) —{' '}
                    {mode === 'alpha' ? 'альфа‑канал' : 'RGB'}
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
                            checked={live}
                            onChange={(e) => setLive(e.target.checked)}
                        />
                        Предпросмотр
                    </label>
                    {onClose && (
                        <button
                            aria-label='Закрыть'
                            onClick={handleClose}
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

            {/* Preset */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ display: 'grid', gap: 6, minWidth: 280 }}>
                    <span style={{ fontSize: 12, color: '#bbb' }}>
                        Предустановка
                    </span>
                    <select
                        value={preset}
                        onChange={(e) =>
                            loadPreset(
                                e.target
                                    .value as (typeof PRESET_LIST)[number]['key'],
                            )
                        }
                        style={{
                            background: '#2b2b2b',
                            color: '#fff',
                            border: '1px solid #3a3a3a',
                            borderRadius: 8,
                            padding: '6px 10px',
                        }}
                    >
                        {PRESET_LIST.map((p) => (
                            <option key={p.key} value={p.key}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {/* 3×3 */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                }}
            >
                {vals.map((v, i) => (
                    <input
                        key={i}
                        type='number'
                        value={v}
                        onChange={(e) => handleChangeCell(i, e.target.value)}
                        step='1'
                        style={{
                            background: '#2b2b2b',
                            color: '#fff',
                            border: '1px solid #3a3a3a',
                            borderRadius: 8,
                            padding: '6px 10px',
                        }}
                    />
                ))}
            </div>

            {/* Divisor / Bias */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#bbb' }}>
                        Divisor (∑, если пусто)
                    </span>
                    <input
                        type='number'
                        value={divisor}
                        onChange={(e) =>
                            setDivisor(
                                e.target.value === ''
                                    ? ''
                                    : Number(e.target.value),
                            )
                        }
                        step='1'
                        style={{
                            background: '#2b2b2b',
                            color: '#fff',
                            border: '1px solid #3a3a3a',
                            borderRadius: 8,
                            padding: '6px 10px',
                            minWidth: 140,
                        }}
                    />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#bbb' }}>Bias</span>
                    <input
                        type='number'
                        value={bias}
                        onChange={(e) =>
                            setBias(
                                e.target.value === ''
                                    ? ''
                                    : Number(e.target.value),
                            )
                        }
                        step='1'
                        style={{
                            background: '#2b2b2b',
                            color: '#fff',
                            border: '1px solid #3a3a3a',
                            borderRadius: 8,
                            padding: '6px 10px',
                            minWidth: 140,
                        }}
                    />
                </label>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    onClick={handleApply}
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
                    onClick={handleReset}
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

export default KernelPanel
