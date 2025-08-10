import { Button, Tooltip } from '@mui/material'
import { FC } from 'react'

type ToolButtonProps = {
    title: string
    icon: React.ReactNode
    active?: boolean
    disabled?: boolean
    onClick: () => void
}

const ToolButton: FC<ToolButtonProps> = ({
    title,
    icon,
    active = false,
    disabled = false,
    onClick,
}) => (
    <Tooltip title={title}>
        <Button
            variant={active ? 'contained' : 'outlined'}
            onClick={onClick}
            disabled={disabled}
            style={{
                minWidth: 40,
                width: 40,
                height: 40,
                padding: 0,
            }}
        >
            {icon}
        </Button>
    </Tooltip>
)

export default ToolButton
