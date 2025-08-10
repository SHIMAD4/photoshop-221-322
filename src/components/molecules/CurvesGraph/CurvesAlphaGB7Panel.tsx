import { FC } from 'react'
import FieldNumber from '../../atoms/FieldNumber'

type GB7AlphaMode =
    | { mode: 'preserve' }
    | { mode: 'opaque' }
    | { mode: 'transparent' }
    | { mode: 'threshold'; threshold: number; invert?: boolean }

type Props = {
    histogram?: { y: Uint32Array; alpha: Uint32Array } | null
    mode: GB7AlphaMode
    setMode: (m: GB7AlphaMode) => void
    threshold: number
    setThreshold: (v: number) => void
    invert: boolean
    setInvert: (v: boolean) => void
}

const CurvesAlphaGB7Panel: FC<Props> = ({
    histogram,
    mode,
    setMode,
    threshold,
    setThreshold,
    invert,
    setInvert,
}) => (
    <fieldset
        style={{ border: '1px solid #333', borderRadius: 8, padding: 10 }}
    >
        <legend style={{ padding: '0 6px', color: '#ccc' }}>Альфа (GB7)</legend>
        {histogram && (
            <div style={{ fontSize: 12, color: '#aaa', marginBottom: 8 }}>
                Пикселей прозрачных: {histogram.alpha[0].toLocaleString()} •
                непрозрачных: {histogram.alpha[1].toLocaleString()}
            </div>
        )}

        <div style={{ display: 'grid', gap: 8 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                    type='radio'
                    name='gb7alpha'
                    checked={mode.mode === 'preserve'}
                    onChange={() => setMode({ mode: 'preserve' })}
                />
                Сохранить исходную альфу
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                    type='radio'
                    name='gb7alpha'
                    checked={mode.mode === 'opaque'}
                    onChange={() => setMode({ mode: 'opaque' })}
                />
                Сделать всё непрозрачным
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                    type='radio'
                    name='gb7alpha'
                    checked={mode.mode === 'transparent'}
                    onChange={() => setMode({ mode: 'transparent' })}
                />
                Сделать всё прозрачным
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                    type='radio'
                    name='gb7alpha'
                    checked={mode.mode === 'threshold'}
                    onChange={() =>
                        setMode({ mode: 'threshold', threshold, invert })
                    }
                />
                По порогу
            </label>
            {mode.mode === 'threshold' && (
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                        paddingLeft: 28,
                    }}
                >
                    <FieldNumber
                        label='Порог (0–127)'
                        min={0}
                        max={127}
                        value={threshold}
                        onChange={setThreshold}
                    />
                    <label
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type='checkbox'
                            checked={invert}
                            onChange={(e) => setInvert(e.target.checked)}
                        />
                        Инвертировать
                    </label>
                </div>
            )}
        </div>
    </fieldset>
)

export default CurvesAlphaGB7Panel
