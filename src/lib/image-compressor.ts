function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

/**
 * Resizes and compresses an image on the client before upload.
 *
 * - Maintains aspect ratio while downscaling to `maxDimension` on the longer side.
 * - Small images are kept at their original size (never upscaled).
 * - Re-encodes to WebP (falls back to JPEG) and lowers quality from 0.95 by 0.05
 *   until the result is `<= maxSizeKB`, stopping at quality 0.4.
 */
export async function compressImage(
  file: File,
  maxSizeKB = 200,
  maxDimension = 600,
): Promise<File> {
  const image = await loadImage(file);

  let width = image.width;
  let height = image.height;

  if (width > 0 && height > 0) {
    if (width > height && width > maxDimension) {
      height = Math.max(1, Math.round((height * maxDimension) / width));
      width = maxDimension;
    } else if (height >= width && height > maxDimension) {
      width = Math.max(1, Math.round((width * maxDimension) / height));
      height = maxDimension;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("ไม่รองรับการปรับรูปภาพในเบราว์เซอร์นี้");

  ctx.drawImage(image, 0, 0, width, height);

  const maxBytes = maxSizeKB * 1024;
  const baseName = file.name.replace(/\.[^.]+$/, "") || "avatar";

  for (let quality = 0.95; quality >= 0.4; quality -= 0.05) {
    const blob =
      (await canvasToBlob(canvas, "image/webp", quality)) ??
      (await canvasToBlob(canvas, "image/jpeg", quality));
    if (blob && blob.size <= maxBytes) {
      return new File([blob], `${baseName}.webp`, { type: "image/webp" });
    }
  }

  const fallback =
    (await canvasToBlob(canvas, "image/webp", 0.4)) ??
    (await canvasToBlob(canvas, "image/jpeg", 0.8))!;
  return new File([fallback], `${baseName}.webp`, { type: "image/webp" });
}
