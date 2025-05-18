export type ImageFormat = "gb7" | "png" | "jpeg";

export type ImageDataType = {
	width: number;
	height: number;
	depth: number;
	format: 'gb7' | 'png' | 'jpeg';
	pixels?: Uint8Array;
	original?: HTMLImageElement;
};