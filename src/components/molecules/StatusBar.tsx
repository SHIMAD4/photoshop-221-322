import { CSSProperties, FC } from "react";

type StatusBarProps = {
    width?: number;
    height?: number;
    depth?: number;
}

const styles: CSSProperties = {
    position: 'fixed',
    bottom: '16px',
    left: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px'
}

const StatusBar: FC<StatusBarProps> = ({ width, height, depth }) => {
    return (
        <div style={styles}>
            <p><span style={{ fontWeight: 'bold' }}>Ширина:</span> {width} px</p>
            <p><span style={{ fontWeight: 'bold' }}>Высота:</span> {height} px</p>
            <p><span style={{ fontWeight: 'bold' }}>Глубина:</span> {depth} bit</p>
        </div>
    )
}

export default StatusBar
