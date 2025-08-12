import { FC, ReactNode } from 'react'

const IconButton: FC<{
    title?: string
    onClick: () => void
    children?: ReactNode
}> = ({ title, onClick, children = '×' }) => (
    <button
        aria-label={title || 'button'}
        title={title}
        onClick={onClick}
        style={{
            width: 32,
            height: 32,
            lineHeight: '30px',
            borderRadius: 8,
            border: '1px solid #3a3a3a',
            background: '#2b2b2b',
            color: '#fff',
            textAlign: 'center',
            fontSize: 18,
            padding: 0,
            cursor: 'pointer',
        }}
    >
        {children}
    </button>
)

export default IconButton
