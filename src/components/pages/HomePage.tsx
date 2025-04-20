import { useState } from "react";
import { ImageDataType } from "../../types/ImageTypes";
import InputFile from "../atoms/InputFile";
import StatusBar from "../molecules/StatusBar";

function HomePage() {
	const [statusData, setStatusData] = useState<ImageDataType>({
		width: 0,
		height: 0,
		depth: 0,
	})

	const handleImage = (data: ImageDataType) => setStatusData(data)

	return (
		<>
			<InputFile label="upload image" onChange={handleImage}/>
			<StatusBar width={statusData.width} heigth={statusData.height} depth={statusData.depth}/>
		</>
	)
}

export default HomePage
