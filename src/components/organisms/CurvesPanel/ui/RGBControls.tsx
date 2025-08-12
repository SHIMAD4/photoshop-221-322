import { FC } from 'react'
import { Channel, channelColor } from '../../../../types/curves'
import FieldNumber from '../../../atoms/FieldNumber'

type Pt = { x: number; y: number }
type PtsRGB = Record<Channel, { p1: Pt; p2: Pt }>
type Props = {
    pts: PtsRGB
    setPts: (updater: (prev: PtsRGB) => PtsRGB) => void
    linkRGB: boolean
    setLinkRGB: (v: boolean) => void
}

const RGBAControls: FC<Props> = ({ pts, setPts, linkRGB, setLinkRGB }) => (
    <>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
                type='checkbox'
                checked={linkRGB}
                onChange={(e) => setLinkRGB(e.target.checked)}
            />
            Связать каналы (двигать одну линию по всем 3 каналам)
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
                    value={pts[ch].p1.x}
                    onChange={(v) =>
                        setPts((prev) => ({
                            ...prev,
                            [ch]: { ...prev[ch], p1: { ...prev[ch].p1, x: v } },
                        }))
                    }
                />
                <FieldNumber
                    label='y₁'
                    min={0}
                    max={255}
                    value={pts[ch].p1.y}
                    onChange={(v) =>
                        setPts((prev) => ({
                            ...prev,
                            [ch]: { ...prev[ch], p1: { ...prev[ch].p1, y: v } },
                        }))
                    }
                />
                <span />

                <span />
                <FieldNumber
                    label='x₂'
                    min={0}
                    max={255}
                    value={pts[ch].p2.x}
                    onChange={(v) =>
                        setPts((prev) => ({
                            ...prev,
                            [ch]: { ...prev[ch], p2: { ...prev[ch].p2, x: v } },
                        }))
                    }
                />
                <FieldNumber
                    label='y₂'
                    min={0}
                    max={255}
                    value={pts[ch].p2.y}
                    onChange={(v) =>
                        setPts((prev) => ({
                            ...prev,
                            [ch]: { ...prev[ch], p2: { ...prev[ch].p2, y: v } },
                        }))
                    }
                />
                <span />
            </div>
        ))}
    </>
)
export default RGBAControls
