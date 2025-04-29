export function nearestNeighborInterpolation(
    source: ImageData,
    targetWidth: number,
    targetHeight: number
  ): ImageData {
    const targetCanvas = document.createElement("canvas");
    targetCanvas.width = targetWidth;
    targetCanvas.height = targetHeight;
    const targetCtx = targetCanvas.getContext("2d")!;
  
    const targetImageData = targetCtx.createImageData(targetWidth, targetHeight);
    const scaleX = source.width / targetWidth;
    const scaleY = source.height / targetHeight;
  
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const srcX = Math.floor(x * scaleX);
        const srcY = Math.floor(y * scaleY);
        const srcIndex = (srcY * source.width + srcX) * 4;
        const destIndex = (y * targetWidth + x) * 4;
  
        targetImageData.data[destIndex] = source.data[srcIndex];
        targetImageData.data[destIndex + 1] = source.data[srcIndex + 1];
        targetImageData.data[destIndex + 2] = source.data[srcIndex + 2];
        targetImageData.data[destIndex + 3] = source.data[srcIndex + 3];
      }
    }
  
    return targetImageData;
  }
  