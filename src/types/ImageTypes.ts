export type ImageFormat = "gb7" | "png" | "jpeg";

export type ImageDataType = {
    width: number;
    height: number;
    depth: number;
    format?: ImageFormat;
    pixels?: Uint8Array; // только для GB7
};