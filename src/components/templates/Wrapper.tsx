import { CSSProperties, FC, PropsWithChildren } from "react"

const styles: CSSProperties = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
	gap: '24px',
}

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<div style={styles}>
			{children}
			<canvas id="imagePreview"></canvas>
		</div>
	)
}

export default Wrapper
