import { FC } from "react"

type CanvasProps = {
    id: string,
}

const Canvas: FC<CanvasProps> = ({ id }) => {

    return (
        <canvas id={id}></canvas>
    )
}

export default Canvas
