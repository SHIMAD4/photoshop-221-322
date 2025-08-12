import { ButtonHTMLAttributes, FC } from 'react'

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <button
        {...props}
        style={{
            background: '#2b2b2b',
            color: '#fff',
            border: '1px solid #3a3a3a',
            borderRadius: 8,
            padding: '6px 10px',
            cursor: 'pointer',
            ...(props.style || {}),
        }}
    />
)

export default Button
