// 이미지 파일을 브라우저에서 미리 압축한 뒤 업로드함.
// 이미지가 아닌 파일은 그대로 반환함.
export async function compressImageFile(file, options = {}) {
  if (!file || !file.type.startsWith("image/")) return file;

  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.8,
    mimeType = file.type === "image/png" ? "image/png" : "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            const compressedFile = new File([blob], file.name, { type: mimeType });
            resolve(compressedFile);
          },
          mimeType,
          quality,
        );
      };
      img.onerror = (err) => reject(err);
      img.src = reader.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
