import CropIcon from '@mui/icons-material/Crop';
import UploadIcon from '@mui/icons-material/Upload';
import { useState } from "react";
import { ImageDataType } from "../../types/ImageTypes";
import HomeTemplate from "../templates/HomeTemplate/HomeTemplate";

function HomePage() {
	const [statusData, setStatusData] = useState<ImageDataType>({
		width: 0,
		height: 0,
		depth: 0,
		format: 'gb7',
	})

	const handleImage = (data: ImageDataType) => setStatusData(data)

	return (
		<HomeTemplate 
			content={{
				input: {
					icon: <UploadIcon />,
					onChange: handleImage,
				},
				buttons: {
					modalButton: {
						icon: <CropIcon />
					}
				},
				statusBar: {
					width: statusData.width,
					height: statusData.height,
					depth: statusData.depth,
				},
				canvas: {
					id: 'imagePreview',
				}
			}}
		/>
	)
}

export default HomePage
