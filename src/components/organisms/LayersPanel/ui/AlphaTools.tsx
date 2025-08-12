import LayersClearIcon from '@mui/icons-material/LayersClear'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { Tooltip } from '@mui/material'
import { FC } from 'react'

const btn = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
} as const

const AlphaTools: FC<{
    hasAlpha: boolean
    alphaHidden?: boolean
    onToggleHide: () => void
    onRemove: () => void
}> = ({ hasAlpha, alphaHidden, onToggleHide, onRemove }) => {
    if (!hasAlpha) return null
    return (
        <>
            <p>
                <strong>Альфа-канал:</strong>
            </p>
            <div className='alpha-buttons'>
                <Tooltip
                    title={alphaHidden ? 'Показать альфу' : 'Скрыть альфу'}
                >
                    <button onClick={onToggleHide} style={btn}>
                        <RemoveRedEyeIcon style={{ color: 'white' }} />
                    </button>
                </Tooltip>
                <Tooltip title='Удалить альфу'>
                    <button onClick={onRemove} style={btn} disabled={!hasAlpha}>
                        <LayersClearIcon style={{ color: 'white' }} />
                    </button>
                </Tooltip>
            </div>
        </>
    )
}

export default AlphaTools
