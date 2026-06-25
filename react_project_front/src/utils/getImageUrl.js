const BACKSERVER = import.meta.env.VITE_BACKSERVER || "/api";
  

export const isAbsoluteUrl = (url) => {
  return typeof url === "string" && /^(https?:)?\/\//i.test(url.trim());
};

export const normalizeImageUrl = (thumb, defaultPrefix = "board/editor") => {
  if (!thumb || typeof thumb !== "string") return null;
  let trimmed = thumb.trim();
  if (!trimmed) return null;
  if (["null", "undefined", "none", "NONE", "NULL"].includes(trimmed))
    return null;

  // S3 업로드 결과는 백엔드가 CloudFront 전체 URL로 내려주므로 그대로 사용함.
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  // 절대 URL이 아닌 값이 들어오면 잘못된 데이터이므로 처리하지 않음.
  return null;
};

export const getSafeImageUrl = (thumb, defaultPrefix = "board/editor") => {
  if (!thumb) return null;
  let value = thumb;
  if (typeof thumb === "object") {
    value =
      thumb.url ||
      thumb.path ||
      thumb.reviewThumb ||
      thumb.thumbnail ||
      thumb.downloadUrl ||
      thumb.fileUrl ||
      thumb.filePath ||
      null;
  }
  if (typeof value !== "string") return null;
  let trimmed = value.trim();
  if (!trimmed) return null;
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.substring(1, trimmed.length - 1).trim();
  }
  if (!trimmed) return null;
  return normalizeImageUrl(trimmed, defaultPrefix) || trimmed;
};
