/**
 * Creates an image from a Base64 string
 *
 * @export
 * @param {string} base64
 * @return {Promise<HTMLImageElement>}
 */
export function base64ToImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(new Error('Error reading image'));
    };

    img.src = base64;
  });
}

/**
 * Gets dimensions of an image
 *
 * @param {HTMLImageElement} img
 * @return {{width: number, height: number}}
 */
export function readImageDimensions(img) {
  return {
    width: img.width,
    height: img.height,
  };
}

/**
 * Converts image to canvas
 *
 * @param {HTMLImageElement} image
 */
export function imageToCanvas(image) {
  const { width, height } = readImageDimensions(image);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  return canvas;
}

/**
 * Converts canvas to blob
 *
 * @param {HTMLCanvasElement} canvas
 * @return {Promise<Blob>}
 */
export function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
}
