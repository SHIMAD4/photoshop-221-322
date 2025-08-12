import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
} from '@mui/material'
import { FC, useState } from 'react'
import { ChromePicker } from 'react-color'

const AddLayerMenu: FC<{
    disabled?: boolean
    onAddImage: () => void
    onAddColor: (hex: string) => void
}> = ({ disabled, onAddImage, onAddColor }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [openColor, setOpenColor] = useState(false)
    const [hex, setHex] = useState('#ff0000')

    return (
        <div className='add-layer' style={{ marginTop: 8 }}>
            <Button
                variant='outlined'
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={disabled}
            >
                Добавить слой
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null)
                        onAddImage()
                    }}
                >
                    <AddPhotoAlternateIcon
                        fontSize='small'
                        style={{ marginRight: 8 }}
                    />{' '}
                    Картинка
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null)
                        setOpenColor(true)
                    }}
                >
                    <FormatColorFillIcon
                        fontSize='small'
                        style={{ marginRight: 8 }}
                    />{' '}
                    Цвет
                </MenuItem>
            </Menu>

            <Dialog open={openColor} onClose={() => setOpenColor(false)}>
                <DialogTitle>Выберите цвет слоя</DialogTitle>
                <DialogContent>
                    <ChromePicker
                        color={hex}
                        onChange={(c) => setHex(c.hex)}
                        disableAlpha
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenColor(false)}>Отмена</Button>
                    <Button
                        onClick={() => {
                            onAddColor(hex)
                            setOpenColor(false)
                        }}
                        variant='contained'
                    >
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AddLayerMenu
