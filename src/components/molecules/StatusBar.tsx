import { CSSProperties, FC } from "react";

type StatusBarProps = {
    width?: number;
    heigth?: number;
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

const StatusBar: FC<StatusBarProps> = ({ width, heigth, depth }) => {
    return (
        <div style={styles}>
            <p><span style={{ fontWeight: 'bold' }}>Ширина:</span> {width} px</p>
            <p><span style={{ fontWeight: 'bold' }}>Высота:</span> {heigth} px</p>
            <p><span style={{ fontWeight: 'bold' }}>Глубина:</span> {depth} bit</p>
        </div>
    )
}

export default StatusBar
