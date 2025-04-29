import { CSSProperties, FC } from "react";
import { ImageDataType } from "../../types/ImageTypes";
import Canvas from "../atoms/Canvas";
import InputFile from "../atoms/InputFile";
import StatusBar from "../molecules/StatusBar";
import ResizeModal from "../organisms/ResizeModal";

type HomeTemplateProps = {
	content: {
		input: {
			label: string,
			onChange: (data: ImageDataType) => void,
		},
		statusBar: {
			width: number,
			height: number,
			depth: number,
		},
		canvas: {
			id: string,
		},
		resizeModal: {
			isResizeModalOpen: boolean;
			setIsResizeModalOpen: (open: boolean) => void;
			handleResize: (width: number, height: number, method: "nearest" | "bilinear") => void;
			onResizeClick: () => void;
		}		
	}
};

const styles: CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
	gap: '24px',
	position: 'relative',
}

const HomeTemplate: FC<HomeTemplateProps> = ({ content }) => {
	const {
		statusBar,
		input,
		canvas,
		resizeModal
	} = content;

	return (
		<div style={styles}>
			<InputFile
				label={input.label}
				onChange={input.onChange}
			/>
			<StatusBar
				width={statusBar.width}
				height={statusBar.height}
				depth={statusBar.depth}
			/>
			<Canvas id={canvas.id} />
			<ResizeModal
				isOpen={resizeModal.isResizeModalOpen}
				onClose={() => resizeModal.setIsResizeModalOpen(false)}
				onApply={(w, h, method) => {
					resizeModal.handleResize(w, h, method);
					resizeModal.setIsResizeModalOpen(false);
				}}
				originalWidth={statusBar.width}
				originalHeight={statusBar.height}
			/>
			<button
				style={{
					position: 'fixed',
					top: '20px',
					right: '20px',
					padding: '10px 20px',
					fontSize: '16px',
					cursor: 'pointer'
				}}
				onClick={resizeModal.onResizeClick}
			>
				Изменить размер
			</button>
		</div>
	);
};

export default HomeTemplate;
