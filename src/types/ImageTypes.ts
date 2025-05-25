export type ImageFormat = "gb7" | "png" | "jpeg";

export type BlendMode = "normal" | "multiply" | "screen" | "overlay";

export type ImageDataType = {
	width: number;
	height: number;
	depth: number;
	format: ImageFormat;
	pixels?: Uint8Array;
	original?: HTMLImageElement;
	imageData?: ImageData;
	hasAlpha?: boolean;
	opacity?: number;
	alphaHidden?: boolean;
	alphaRemoved?: boolean;
	visible?: boolean;
	deleted?: boolean;
	type?: "image" | "color";
	color?: string;
	blendMode?: BlendMode;
};
