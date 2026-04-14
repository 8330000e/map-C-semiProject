const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
const FIREBASE_BUCKET = import.meta.env.VITE_FIREBASE_BUCKET || "semiproject-carbon.firebasestorage.app";

export const isAbsoluteUrl = (url) => {
  return typeof url === "string" && /^(https?:)?\/\//i.test(url.trim());
};

const getFirebaseUrl = (objectPath) => {
  const encodedObjectName = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_BUCKET}/o/${encodedObjectName}?alt=media`;
};

const getDefaultUrl = (trimmed, defaultPrefix) => {
  if (trimmed.startsWith("/upload/")) {
    const objectPath = trimmed.substring(trimmed.indexOf("/upload/") + "/upload/".length);
    return getFirebaseUrl(objectPath);
  }

  if (trimmed.startsWith("/board/editor/")) {
    return getFirebaseUrl(trimmed.replace(/^\//, ""));
  }

  if (trimmed.startsWith("/campaign/memo/")) {
    return getFirebaseUrl(trimmed.replace(/^\//, ""));
  }

  if (trimmed.startsWith("/member/thumb/")) {
    return getFirebaseUrl(trimmed.replace(/^\//, ""));
  }

  if (trimmed.startsWith("/notice/")) {
    return getFirebaseUrl(trimmed.replace(/^\//, ""));
  }

  if (trimmed.startsWith("/qna/")) {
    return getFirebaseUrl(trimmed.replace(/^\//, ""));
  }

  if (trimmed.startsWith("/")) {
    return `${BACKSERVER}${trimmed}`;
  }

  if (trimmed.match(/^.+\.(jpg|jpeg|png|gif|bmp)$/i)) {
    return getFirebaseUrl(`${defaultPrefix}/${trimmed.replace(/^\//, "")}`);
  }

  return `${BACKSERVER}/${defaultPrefix}/${trimmed}`;
};

export const normalizeImageUrl = (thumb, defaultPrefix = "board/editor") => {
  if (!thumb || typeof thumb !== "string") return null;
  let trimmed = thumb.trim();
  if (!trimmed) return null;

  trimmed = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const driveMatch = trimmed.match(/^[A-Za-z]:\//);
  if (driveMatch) {
    const boardIndex = trimmed.indexOf("/board/editor/");
    if (boardIndex !== -1) {
      const suffix = trimmed.substring(boardIndex);
      return `${BACKSERVER}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
    }
    trimmed = trimmed.substring(trimmed.indexOf("/") + 1);
  }

  return getDefaultUrl(trimmed, defaultPrefix);
};
