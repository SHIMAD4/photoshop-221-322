import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Radio,
    RadioGroup,
    Slider,
    Stack,
    Typography,
} from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { ImageDataType } from '../../../types/ImageTypes'
import { renderLayersToCanvas } from '../../../utils'
import { downloadBlob } from '../../../utils/encode/download'

type Props = {
    open: boolean
    onClose: () => void
    layers: ImageDataType[]
    scale: number
    baseScale: number
    interpolation: 'nearest' | 'bilinear'
}

type RadioSelect = 'png' | 'jpeg' | 'gb7'

const ExportModal: FC<Props> = ({ open, onClose, layers, interpolation }) => {
    const [fmt, setFmt] = useState<RadioSelect>('png')
    const [jpegQ, setJpegQ] = useState(92)
    const [alphaOnly, setAlphaOnly] = useState(false)

    const fileBase = useMemo(() => {
        if (!layers.length) return 'export'
        const w = layers[0].width
        const h = layers[0].height
        return `export_${w}x${h}`
    }, [layers])

    const handleExport = async () => {
        try {
            const tmpCanvas = document.createElement('canvas')
            renderLayersToCanvas(tmpCanvas, layers, 1, 1, interpolation)

            if (fmt === 'png') {
                const blob = await new Promise<Blob>((resolve) => {
                    tmpCanvas.toBlob((b) => resolve(b!), 'image/png')
                })
                downloadBlob(blob, `${fileBase}.png`)
            } else if (fmt === 'jpeg') {
                const q = Math.max(0, Math.min(100, jpegQ)) / 100
                const blob = await new Promise<Blob>((resolve) => {
                    tmpCanvas.toBlob((b) => resolve(b!), 'image/jpeg', q)
                })
                downloadBlob(blob, `${fileBase}.jpg`)
            }

            onClose()
        } catch (e) {
            console.error(e)

            onClose()
        }
    }
    return (
        <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
            <DialogTitle>Экспорт</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <RadioGroup
                        value={fmt}
                        onChange={(e) => setFmt(e.target.value as RadioSelect)}
                        row
                    >
                        <FormControlLabel
                            value='png'
                            control={<Radio />}
                            label='PNG'
                        />
                        <FormControlLabel
                            value='jpeg'
                            control={<Radio />}
                            label='JPEG'
                        />
                        <FormControlLabel
                            value='gb7'
                            control={<Radio />}
                            label='GB7'
                        />
                    </RadioGroup>

                    {fmt === 'jpeg' && (
                        <Stack spacing={1}>
                            <Typography variant='body2'>
                                JPEG Quality: {jpegQ}%
                            </Typography>
                            <Slider
                                value={jpegQ}
                                onChange={(_, v) => setJpegQ(v as number)}
                                min={0}
                                max={100}
                            />
                        </Stack>
                    )}

                    {(fmt === 'png' || fmt === 'jpeg') && (
                        <FormControlLabel
                            control={
                                <Radio
                                    checked={alphaOnly}
                                    onChange={() => setAlphaOnly(!alphaOnly)}
                                />
                            }
                            label='Экспортировать только альфа-канал (в оттенках серого)'
                        />
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='inherit'>
                    Закрыть
                </Button>
                <Button onClick={handleExport} variant='contained'>
                    Скачать
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ExportModal
