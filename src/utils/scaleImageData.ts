export function scaleImageData(
	original: ImageData,
	newWidth: number,
	newHeight: number,
	interp: 'nearest' | 'bilinear'
): ImageData {
	const tempCanvas = document.createElement('canvas');
	tempCanvas.width = newWidth;
	tempCanvas.height = newHeight;

	const ctx = tempCanvas.getContext('2d');
	if (!ctx) throw new Error('Canvas context not available');

	const inputCanvas = document.createElement('canvas');
	inputCanvas.width = original.width;
	inputCanvas.height = original.height;
	inputCanvas.getContext('2d')?.putImageData(original, 0, 0);

	ctx.imageSmoothingEnabled = interp === 'bilinear';
	
	ctx.drawImage(inputCanvas, 0, 0, newWidth, newHeight);

	return ctx.getImageData(0, 0, newWidth, newHeight);
}
