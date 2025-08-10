import { Box, Tooltip, Typography } from '@mui/material'
import { FC } from 'react'
import { ColorInfo } from '../../molecules/EyedropperToolButton/EyedropperToolButton'

interface Props {
    color1?: ColorInfo
    color2?: ColorInfo
}

const ColorSwatch = ({ rgba }: { rgba: [number, number, number, number] }) => {
    const [r, g, b, a] = rgba

    return (
        <div
            style={{
                width: 30,
                height: 30,
                backgroundColor: `rgba(${r},${g},${b},${a / 255})`,
                border: '1px solid #000',
            }}
        />
    )
}

const LabeledValue = ({
    label,
    value,
    tooltip,
}: {
    label: string
    value: string
    tooltip: string
}) => (
    <Tooltip title={tooltip}>
        <Typography variant='body2'>
            <strong>{label}:</strong> {value}
        </Typography>
    </Tooltip>
)

const getLuminance = ([r, g, b]: [number, number, number]) => {
    const srgb = [r, g, b].map((c) => {
        const cNorm = c / 255

        return cNorm <= 0.03928
            ? cNorm / 12.92
            : Math.pow((cNorm + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

const getContrast = (
    c1: [number, number, number],
    c2: [number, number, number],
) => {
    const L1 = getLuminance(c1)
    const L2 = getLuminance(c2)

    return +((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2)
}

const ColorInfoPanel: FC<Props> = ({ color1, color2 }) => {
    const contrast =
        color1 && color2
            ? getContrast(
                  color1.rgba.slice(0, 3) as [number, number, number],
                  color2.rgba.slice(0, 3) as [number, number, number],
              )
            : undefined

    const renderColor = (color: ColorInfo) => (
        <Box display='flex' flexDirection='column' gap={1}>
            <Box display='flex' alignItems='center' gap={1}>
                <ColorSwatch rgba={color.rgba} />
                <Typography>
                    {color.label} — ({color.x}, {color.y})
                </Typography>
            </Box>

            <LabeledValue
                label='RGB'
                value={color.rgba.slice(0, 3).join(', ')}
                tooltip='Red, Green, Blue (0–255)'
            />
            <LabeledValue
                label='XYZ'
                value={`${color.xyz.x.toFixed(2)}, ${color.xyz.y.toFixed(
                    2,
                )}, ${color.xyz.z.toFixed(2)}`}
                tooltip='CIE 1931 X, Y, Z'
            />
            <LabeledValue
                label='Lab'
                value={`${color.lab.l.toFixed(1)}, ${color.lab.a.toFixed(
                    1,
                )}, ${color.lab.b.toFixed(1)}`}
                tooltip='L* (lightness), a*, b* (perceptual axes)'
            />
            <LabeledValue
                label='OKLch'
                value={`${color.oklch.l.toFixed(3)}, ${color.oklch.c.toFixed(
                    3,
                )}, ${color.oklch.h.toFixed(1)}`}
                tooltip='L (lightness), C (chroma), H (hue)'
            />
        </Box>
    )

    return (
        <Box display='flex' flexDirection='column' gap={1}>
            <Tooltip title={'Выбор доп.цвета через CTRL, SHIFT или ALT'}>
                <Typography
                    variant='body1'
                    color='gray'
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        top: 12,
                        right: 14,
                        zIndex: 3,
                    }}
                >
                    ?
                </Typography>
            </Tooltip>
            <Typography variant='body1'>Цвета</Typography>

            <Box display='flex' flexDirection='column' gap={4}>
                {color1 && renderColor(color1)}
                {color2 && renderColor(color2)}
            </Box>

            {contrast !== undefined && (
                <Typography>
                    Контраст: <strong>{contrast}:1</strong>{' '}
                    {contrast < 4.5 && (
                        <span style={{ color: 'red' }}>(недостаточный)</span>
                    )}
                </Typography>
            )}
        </Box>
    )
}

export default ColorInfoPanel
