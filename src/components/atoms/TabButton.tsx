import { FC, PropsWithChildren } from 'react'

export const TabButton: FC<
    PropsWithChildren<{ active: boolean; onClick: () => void }>
> = ({ active, onClick, children }) => (
    <button
        style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #333',
            background: active ? '#3a3a3a' : '#242424',
            color: '#eee',
            cursor: 'pointer',
        }}
        onClick={onClick}
    >
        {children}
    </button>
)

export default TabButton
