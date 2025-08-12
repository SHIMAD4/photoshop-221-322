import { FC, useEffect, useMemo, useState } from 'react'
import {
    KERNEL_PRESETS,
    Kernel3x3,
    convolveAlpha3x3,
    convolveRGB3x3,
} from '../../../utils/image/convolution'
import KernelActions from './ui/KernelActions'
import KernelDivisorBias from './ui/KernelDivisorBias'
import KernelMatrix3x3 from './ui/KernelMatrix3x3'
import KernelPanelHeader from './ui/KernelPanelHeader'
import KernelPresetSelect from './ui/KernelPresetSelect'

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

    // live preview
    useEffect(() => {
        if (!live) return
        const out = applyKernel(kernel)
        onPreview?.(out)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [live, vals, divisor, bias, mode, imageData])

    const handleApply = () => {
        const out = applyKernel(kernel)
        onApply(out)
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
            <KernelPanelHeader
                modeLabel={mode === 'alpha' ? 'альфа‑канал' : 'RGB'}
                live={live}
                onToggleLive={setLive}
                onClose={() => {
                    onPreview?.(null)
                    onClose?.()
                }}
            />

            <KernelPresetSelect
                value={preset}
                options={PRESET_LIST}
                onChange={(key) =>
                    loadPreset(key as (typeof PRESET_LIST)[number]['key'])
                }
            />

            <KernelMatrix3x3
                values={vals}
                onChangeCell={(idx, n) =>
                    setVals((prev) =>
                        prev.map((x, i) =>
                            i === idx ? (Number.isFinite(n) ? n : 0) : x,
                        ),
                    )
                }
            />

            <KernelDivisorBias
                divisor={divisor}
                bias={bias}
                onChangeDivisor={setDivisor}
                onChangeBias={setBias}
            />

            <KernelActions
                onApply={handleApply}
                onReset={() => loadPreset('identity')}
            />
        </aside>
    )
}

export default KernelPanel
