import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Tooltip } from '@mui/material'
import { FC } from 'react'

const btn = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
} as const

const LayerRowActions: FC<{
    visible: boolean
    onToggleVisible: () => void
    onDelete: () => void
    onMoveUp: () => void
    onMoveDown: () => void
}> = ({ visible, onToggleVisible, onDelete, onMoveUp, onMoveDown }) => (
    <>
        <p>
            <strong>Слой:</strong>
        </p>
        <div className='layer-buttons'>
            <Tooltip title={visible ? 'Скрыть слой' : 'Показать слой'}>
                <button onClick={onToggleVisible} style={btn}>
                    {visible ? (
                        <VisibilityOffIcon style={{ color: 'white' }} />
                    ) : (
                        <VisibilityIcon style={{ color: 'white' }} />
                    )}
                </button>
            </Tooltip>
            <Tooltip title='Удалить слой'>
                <button onClick={onDelete} style={btn}>
                    <DeleteIcon style={{ color: 'white' }} />
                </button>
            </Tooltip>
            <Tooltip title='Переместить вверх'>
                <button onClick={onMoveUp} style={btn}>
                    <ArrowUpwardIcon style={{ color: 'white' }} />
                </button>
            </Tooltip>
            <Tooltip title='Переместить вниз'>
                <button onClick={onMoveDown} style={btn}>
                    <ArrowDownwardIcon style={{ color: 'white' }} />
                </button>
            </Tooltip>
        </div>
    </>
)

export default LayerRowActions
