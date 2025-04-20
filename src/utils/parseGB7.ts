export type GB7Image = {
	width: number;
	height: number;
	hasMask: boolean;
	pixels: Uint8Array;
}

// Читает GB7-формат из ArrayBuffer, возвращает GB7Image объект (width, height, hasMask, pixels).
export function parseGB7(buffer: ArrayBuffer): GB7Image {
	const view = new DataView(buffer);

	if (view.getUint32(0) !== 0x4742371d) throw new Error("Неверная сигнатура GB7");
	if (view.getUint8(4) !== 0x01) throw new Error("Неподдерживаемая версия");

	const flag = view.getUint8(5);
	const hasMask = (flag & 1) === 1;

	const width = view.getUint16(6, false);
	const height = view.getUint16(8, false);
	const pixelData = new Uint8Array(buffer.slice(12));

	return { width, height, hasMask, pixels: pixelData };
}
