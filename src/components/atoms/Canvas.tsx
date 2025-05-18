import { FC, forwardRef } from "react";

type CanvasProps = {
	id: string;
};

// Используем forwardRef, чтобы родительский компонент мог получить доступ к <canvas>
const Canvas: FC<CanvasProps & React.RefAttributes<HTMLCanvasElement>> = forwardRef(
	({ id }, ref) => {
		return (
			<canvas id={id} ref={ref}></canvas>
		);
	}
);

export default Canvas;
