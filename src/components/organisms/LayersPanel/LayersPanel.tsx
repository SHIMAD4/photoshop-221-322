import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DeleteIcon from '@mui/icons-material/Delete'
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'
import LayersClearIcon from '@mui/icons-material/LayersClear'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Menu,
    MenuItem,
    Select,
    Slider,
    Tooltip,
} from '@mui/material'
import { FC, useEffect, useRef, useState } from 'react'
import { ChromePicker } from 'react-color'
import { BlendMode, ImageDataType } from '../../../types/ImageTypes'
import { drawAlphaPreviewToCanvas } from '../../../utils/render/previews/drawAlphaPreviewToCanvas'
import { drawPreviewToCanvas } from '../../../utils/render/previews/drawPreviewToCanvas'
import './style.css'

const blendModes: { value: BlendMode; label: string; tooltip: string }[] = [
    {
        value: 'normal',
        label: 'Обычный',
        tooltip:
            'Обычный режим: верхний слой полностью перекрывает нижний в зависимости от прозрачности.',
    },
    {
        value: 'multiply',
        label: 'Умножение',
        tooltip:
            'Умножение: делает изображение темнее, умножая значения цветов слоёв.',
    },
    {
        value: 'screen',
        label: 'Экран',
        tooltip:
            'Экран: делает изображение светлее, инвертируя, умножая, затем инвертируя снова.',
    },
    {
        value: 'overlay',
        label: 'Наложение',
        tooltip:
            'Наложение: сочетание multiply и screen, усиливающее контраст.',
    },
]

type Props = {
    imageData: ImageDataType
    layers: ImageDataType[]
    activeIndex: number
    setActiveIndex: (index: number) => void
    onAddImageLayer: () => void
    onAddColorLayer: (color: string) => void
    onOpacityChange?: (opacity: number) => void
    onAlphaHide?: (hidden: boolean) => void
    onAlphaRemove?: () => void
    onToggleVisibility?: (visible: boolean) => void
    onDeleteLayer?: () => void
    onMoveLayerUp?: () => void
    onMoveLayerDown?: () => void
    onBlendModeChange?: (mode: BlendMode) => void
}

const LayersPanel: FC<Props> = ({
    imageData,
    layers,
    activeIndex,
    setActiveIndex,
    onAddImageLayer,
    onAddColorLayer,
    onOpacityChange,
    onAlphaHide,
    onAlphaRemove,
    onToggleVisibility,
    onDeleteLayer,
    onMoveLayerUp,
    onMoveLayerDown,
    onBlendModeChange,
}) => {
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
    const alphaRefs = useRef<(HTMLCanvasElement | null)[]>([])
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [colorDialogOpen, setColorDialogOpen] = useState(false)
    const [pendingColor, setPendingColor] = useState('#ff0000')

    useEffect(() => {
        layers.forEach((layer, i) => {
            const canvas = canvasRefs.current[i]
            const alpha = alphaRefs.current[i]

            if (canvas) drawPreviewToCanvas(canvas, layer)
            if (alpha) drawAlphaPreviewToCanvas(alpha, layer)
        })
    }, [layers, activeIndex])

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null)
    }

    return (
        <div className='layers_panel'>
            <p>
                <strong>Превью:</strong>
            </p>

            {layers.map((layer, index) => (
                <div
                    key={index}
                    className={`layer-item ${
                        index === activeIndex ? 'active-layer' : ''
                    }`}
                    onClick={() => setActiveIndex(index)}
                >
                    <p>
                        Слой {index + 1} ({layer.type})
                    </p>
                    <canvas
                        ref={(el) => {
                            canvasRefs.current[index] = el
                        }}
                        width={64}
                        height={64}
                        className='preview'
                    />
                    {layer.hasAlpha && (
                        <>
                            <p>Альфа-канал</p>
                            <canvas
                                ref={(el) => {
                                    alphaRefs.current[index] = el
                                }}
                                width={64}
                                height={64}
                                className='preview'
                            />
                        </>
                    )}
                </div>
            ))}

            <hr />
            <p>
                <strong>Активный слой</strong>
            </p>

            {imageData.opacity !== undefined && (
                <>
                    <p>
                        <strong>Непрозрачность</strong>
                    </p>
                    <Slider
                        value={imageData.opacity}
                        onChange={(_, val) => onOpacityChange?.(val as number)}
                        getAriaValueText={(v) => `${Math.round(v * 100)}%`}
                        valueLabelDisplay='auto'
                        step={0.01}
                        min={0}
                        max={1}
                    />
                </>
            )}

            <p>
                <strong>Режим наложения</strong>
            </p>
            <FormControl fullWidth size='small'>
                <Select
                    value={imageData.blendMode || 'normal'}
                    onChange={(e) =>
                        onBlendModeChange?.(e.target.value as BlendMode)
                    }
                    style={{
                        color: 'white',
                    }}
                    displayEmpty
                >
                    {blendModes.map((mode) => (
                        <MenuItem
                            key={mode.value}
                            value={mode.value}
                            title={mode.tooltip}
                            color='white'
                        >
                            {mode.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <p>
                <strong>Альфа-канал:</strong>
            </p>
            {imageData.hasAlpha && (
                <div className='alpha-buttons'>
                    <Tooltip
                        title={
                            imageData.alphaHidden
                                ? 'Показать альфу'
                                : 'Скрыть альфу'
                        }
                    >
                        <button
                            onClick={() =>
                                onAlphaHide?.(!imageData.alphaHidden)
                            }
                        >
                            <RemoveRedEyeIcon style={{ color: 'white' }} />
                        </button>
                    </Tooltip>
                    <Tooltip title='Удалить альфу'>
                        <button
                            onClick={onAlphaRemove}
                            disabled={!imageData.hasAlpha}
                        >
                            <LayersClearIcon style={{ color: 'white' }} />
                        </button>
                    </Tooltip>
                </div>
            )}

            <p>
                <strong>Слой:</strong>
            </p>
            <div className='layer-buttons'>
                <Tooltip
                    title={
                        imageData.visible === false
                            ? 'Показать слой'
                            : 'Скрыть слой'
                    }
                >
                    <button
                        onClick={() =>
                            onToggleVisibility?.(!(imageData.visible ?? true))
                        }
                    >
                        {imageData.visible === false ? (
                            <VisibilityIcon style={{ color: 'white' }} />
                        ) : (
                            <VisibilityOffIcon style={{ color: 'white' }} />
                        )}
                    </button>
                </Tooltip>
                <Tooltip title='Удалить слой'>
                    <button onClick={onDeleteLayer}>
                        <DeleteIcon style={{ color: 'white' }} />
                    </button>
                </Tooltip>
                <Tooltip title='Переместить вверх'>
                    <button onClick={onMoveLayerUp}>
                        <ArrowUpwardIcon style={{ color: 'white' }} />
                    </button>
                </Tooltip>
                <Tooltip title='Переместить вниз'>
                    <button onClick={onMoveLayerDown}>
                        <ArrowDownwardIcon style={{ color: 'white' }} />
                    </button>
                </Tooltip>
            </div>

            <hr />
            {layers.length < 2 && (
                <div className='add-layer' style={{ marginTop: 8 }}>
                    <Tooltip title='Добавить слой'>
                        <Button variant='outlined' onClick={handleOpenMenu}>
                            Добавить слой
                        </Button>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={!!anchorEl}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem
                            onClick={() => {
                                handleCloseMenu()
                                onAddImageLayer()
                            }}
                        >
                            <AddPhotoAlternateIcon
                                fontSize='small'
                                style={{ marginRight: 8 }}
                            />
                            Картинка
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleCloseMenu()
                                setColorDialogOpen(true)
                            }}
                        >
                            <FormatColorFillIcon
                                fontSize='small'
                                style={{ marginRight: 8 }}
                            />
                            Цвет
                        </MenuItem>
                    </Menu>

                    <Dialog
                        open={colorDialogOpen}
                        onClose={() => setColorDialogOpen(false)}
                    >
                        <DialogTitle>Выберите цвет слоя</DialogTitle>
                        <DialogContent>
                            <ChromePicker
                                color={pendingColor}
                                onChange={(color) => setPendingColor(color.hex)}
                                disableAlpha
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setColorDialogOpen(false)}>
                                Отмена
                            </Button>
                            <Button
                                onClick={() => {
                                    onAddColorLayer(pendingColor)
                                    setColorDialogOpen(false)
                                }}
                                variant='contained'
                            >
                                Добавить
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </div>
    )
}

export default LayersPanel
