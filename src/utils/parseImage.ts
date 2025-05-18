import { ImageDataType } from "../types/ImageTypes";
import { getColorDepth } from "./getColorDepth";
import { parseGB7 } from "./parseGB7";

export async function parseImage(file: File): Promise<ImageDataType> {
	const ext = file.name.split(".").pop()?.toLowerCase();

	if (ext === "gb7") {
		const buffer = await file.arrayBuffer();
		const gb7 = parseGB7(buffer);

		return {
			width: gb7.width,
			height: gb7.height,
			depth: gb7.hasMask ? 8 : 7,
			format: "gb7",
			pixels: gb7.pixels,
		};
	} else {
		const img = document.createElement("img");

		const dataUrl = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = () => {
				if (typeof reader.result !== "string") reject();
				else resolve(reader.result as string);
			};

			reader.readAsDataURL(file);
		});

		img.src = dataUrl;

		await new Promise<void>((resolve) => {
			img.onload = () => resolve();
		});

		const tmpCanvas = document.createElement("canvas");
		tmpCanvas.width = img.width;
		tmpCanvas.height = img.height;

		const ctx = tmpCanvas.getContext("2d");

		if (!ctx) throw new Error("Canvas context error");

		ctx.drawImage(img, 0, 0);

		const depth = getColorDepth(ctx);

		console.log(ext)

		return {
			width: img.width,
			height: img.height,
			depth,
			format: ext === "png" ? "png" : "jpeg",
			original: img,
		};
	}
}
