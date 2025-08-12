import { FC } from 'react'
import { BlendMode, ImageDataType } from '../../../types/ImageTypes'
import './style.css'
import AddLayerMenu from './ui/AddLayerMenu'
import AlphaTools from './ui/AlphaTools'
import BlendModeSelect from './ui/BlendModeSelect'
import LayerPreviewItem from './ui/LayerPreviewItem'
import LayerRowActions from './ui/LayerRowActions'
import OpacityControl from './ui/OpacityControl'

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
    return (
        <div className='layers_panel'>
            <p>
                <strong>Превью:</strong>
            </p>

            {layers.map((layer, idx) => (
                <LayerPreviewItem
                    key={idx}
                    layer={layer}
                    active={idx === activeIndex}
                    onClick={() => setActiveIndex(idx)}
                />
            ))}

            <hr />
            <p>
                <strong>Активный слой</strong>
            </p>

            {typeof imageData.opacity === 'number' && (
                <OpacityControl
                    value={imageData.opacity}
                    onChange={(v) => onOpacityChange?.(v)}
                />
            )}

            <BlendModeSelect
                value={imageData.blendMode || 'normal'}
                onChange={(m) => onBlendModeChange?.(m)}
            />

            <AlphaTools
                hasAlpha={!!imageData.hasAlpha}
                alphaHidden={imageData.alphaHidden}
                onToggleHide={() => onAlphaHide?.(!imageData.alphaHidden)}
                onRemove={() => onAlphaRemove?.()}
            />

            <LayerRowActions
                visible={imageData.visible !== false}
                onToggleVisible={() =>
                    onToggleVisibility?.(!(imageData.visible ?? true))
                }
                onDelete={() => onDeleteLayer?.()}
                onMoveUp={() => onMoveLayerUp?.()}
                onMoveDown={() => onMoveLayerDown?.()}
            />

            <hr />
            {layers.length < 2 && (
                <AddLayerMenu
                    disabled={false}
                    onAddImage={onAddImageLayer}
                    onAddColor={onAddColorLayer}
                />
            )}
        </div>
    )
}

export default LayersPanel
