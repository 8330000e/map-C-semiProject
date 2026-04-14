// 이미지 파일을 브라우저에서 미리 압축한 뒤 업로드함.
// 이미지가 아닌 파일은 그대로 반환함.
export async function compressImageFile(file, options = {}) {
  if (!file || !file.type.startsWith("image/")) return file;

  const {
    // 최대 해상도를 낮춰서 업로드 전 트래픽을 줄임.
    // 목록용 이미지는 1000px 정도로 충분하기 때문에 기본값을 더 보수적으로 설정함.
    maxWidth = 1000,
    maxHeight = 1000,
    // 압축 품질도 약간 낮춰서 데이터 사용량을 절감함.
    quality = 0.75,
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
