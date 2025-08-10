import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import { ChangeEventHandler, FC } from 'react'
import { useImageUpload } from '../../hooks/useImageUpload'
import { ImageDataType } from '../../types/ImageTypes'

type InputFileProps = {
    icon: React.ReactNode
    onChange?: (data: ImageDataType) => void
}

const InputFile: FC<InputFileProps> = ({ icon, onChange }) => {
    const { handleUpload } = useImageUpload('imagePreview', onChange)

    const onChangeFile: ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0]
        if (file) handleUpload(file)
    }

    return (
        <Tooltip title='Выбрать изображение'>
            <Button
                style={{ minWidth: 40, width: 40, height: 40, padding: 0 }}
                variant='contained'
                component='label'
            >
                {icon}
                <input
                    accept='.png,.jpg,.jpeg,.gb7'
                    type='file'
                    onChange={onChangeFile}
                    hidden
                />
            </Button>
        </Tooltip>
    )
}

export default InputFile
