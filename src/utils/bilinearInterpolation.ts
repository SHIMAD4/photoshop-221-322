export function bilinearInterpolation(
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
  
    const getPixel = (x: number, y: number, c: number) => {
      const idx = (y * source.width + x) * 4 + c;
      return source.data[idx];
    };
  
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const gx = x * scaleX;
        const gy = y * scaleY;
  
        const gxi = Math.floor(gx);
        const gyi = Math.floor(gy);
  
        const tx = gx - gxi;
        const ty = gy - gyi;
  
        for (let c = 0; c < 4; c++) {
          const c00 = getPixel(gxi, gyi, c);
          const c10 = getPixel(Math.min(gxi + 1, source.width - 1), gyi, c);
          const c01 = getPixel(gxi, Math.min(gyi + 1, source.height - 1), c);
          const c11 = getPixel(Math.min(gxi + 1, source.width - 1), Math.min(gyi + 1, source.height - 1), c);
  
          const value = (c00 * (1 - tx) + c10 * tx) * (1 - ty) +
                        (c01 * (1 - tx) + c11 * tx) * ty;
  
          const destIndex = (y * targetWidth + x) * 4 + c;
          targetImageData.data[destIndex] = value;
        }
      }
    }
  
    return targetImageData;
  }
  