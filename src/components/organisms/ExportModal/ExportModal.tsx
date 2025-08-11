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
import { downloadBlob } from '../../../utils/encode/download'
import { encodeGB7 } from '../../../utils/encode/encodeGB7'
import { toAlphaImageData, toImageData } from '../../../utils/encode/rasterize'

type Props = {
    open: boolean
    onClose: () => void
    image: ImageDataType
}

type RadioSelect = 'png' | 'jpeg' | 'gb7'

const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v))

const ExportModal: FC<Props> = ({ open, onClose, image }) => {
    const [fmt, setFmt] = useState<RadioSelect>('png')
    const [jpegQ, setJpegQ] = useState(92)
    const [alphaOnly, setAlphaOnly] = useState(false)

    const fileBase = useMemo(
        () => `export_${image.width}x${image.height}`,
        [image],
    )

    const handleExport = async () => {
        try {
            if (fmt === 'gb7') {
                const buf = encodeGB7(image)
                const blob = new Blob([buf], {
                    type: 'application/octet-stream',
                })
                downloadBlob(blob, `${fileBase}.gb7`)
                onClose()
                return
            }

            const imgData = alphaOnly
                ? toAlphaImageData(image)
                : toImageData(image)

            const c = document.createElement('canvas')
            c.width = imgData.width
            c.height = imgData.height
            const ctx = c.getContext('2d')!
            ctx.putImageData(imgData, 0, 0)

            if (fmt === 'png') {
                const blob = await new Promise<Blob>((resolve) => {
                    return c.toBlob((b) => resolve(b!), 'image/png')
                })

                downloadBlob(blob, `${fileBase}.png`)
            } else {
                const q = clamp(jpegQ, 0, 100) / 100
                const blob = await new Promise<Blob>((resolve) => {
                    return c.toBlob((b) => resolve(b!), 'image/jpeg', q)
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
