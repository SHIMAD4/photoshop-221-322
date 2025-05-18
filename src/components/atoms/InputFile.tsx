import Button from "@mui/material/Button";
import { ChangeEventHandler, FC } from "react";
import { useImageUpload } from "../../hooks/useImageUpload";
import { ImageDataType } from "../../types/ImageTypes";

type InputFileProps = {
	icon: React.ReactNode;
	onChange?: (data: ImageDataType) => void;
};

const InputFile: FC<InputFileProps> = ({ icon, onChange }) => {
	const { handleUpload } = useImageUpload("imagePreview", onChange);

	const onChangeFile: ChangeEventHandler<HTMLInputElement> = (event) => {
		const file = event.target.files?.[0];
		if (file) handleUpload(file);
	};

	return (
		<Button variant="contained" component="label">
			{icon}
			<input type="file" onChange={onChangeFile} hidden />
		</Button>
	);
};

export default InputFile;
