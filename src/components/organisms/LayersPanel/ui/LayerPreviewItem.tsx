import { FC, useEffect, useRef } from 'react'
import { ImageDataType } from '../../../../types/ImageTypes'
import {
    drawAlphaPreviewToCanvas,
    drawPreviewToCanvas,
} from '../../../../utils'
type Props = {
    layer: ImageDataType
    active?: boolean
    onClick?: () => void
}

const LayerPreviewItem: FC<Props> = ({ layer, active, onClick }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const alphaRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (canvasRef.current) drawPreviewToCanvas(canvasRef.current, layer)
        if (alphaRef.current) drawAlphaPreviewToCanvas(alphaRef.current, layer)
    }, [layer])

    return (
        <div
            className={`layer-item ${active ? 'active-layer' : ''}`}
            onClick={onClick}
        >
            <p>Слой ({layer.type})</p>
            <canvas
                ref={canvasRef}
                width={64}
                height={64}
                className='preview'
            />
            {layer.hasAlpha && (
                <>
                    <p>Альфа-канал</p>
                    <canvas
                        ref={alphaRef}
                        width={64}
                        height={64}
                        className='preview'
                    />
                </>
            )}
        </div>
    )
}

export default LayerPreviewItem
