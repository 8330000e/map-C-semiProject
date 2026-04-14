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
  const normalized = trimmed.replace(/^\//, "");

  if (normalized.startsWith("upload/semiproject/")) {
    return getFirebaseUrl(normalized.substring("upload/".length));
  }

  if (normalized.startsWith("upload/")) {
    return getFirebaseUrl(normalized.substring("upload/".length));
  }

  if (normalized.startsWith("board/editor/")) {
    return getFirebaseUrl(normalized);
  }

  if (normalized.startsWith("campaign/memo/")) {
    return getFirebaseUrl(normalized);
  }

  if (normalized.startsWith("member/thumb/")) {
    return getFirebaseUrl(normalized);
  }

  if (normalized.startsWith("notice/")) {
    return getFirebaseUrl(normalized);
  }

  if (normalized.startsWith("qna/")) {
    return getFirebaseUrl(normalized);
  }

  if (trimmed.startsWith("/")) {
    return `${BACKSERVER}${trimmed}`;
  }

  if (normalized.match(/^.+\.(jpg|jpeg|png|gif|bmp)$/i)) {
    return getFirebaseUrl(`${defaultPrefix}/${normalized}`);
  }

  return `${BACKSERVER}/${defaultPrefix}/${normalized}`;
};

export const normalizeImageUrl = (thumb, defaultPrefix = "board/editor") => {
  if (!thumb || typeof thumb !== "string") return null;
  let trimmed = thumb.trim();
  if (!trimmed) return null;
  if (["null", "undefined", "none", "NONE", "NULL"].includes(trimmed)) return null;

  trimmed = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const driveMatch = trimmed.match(/^[A-Za-z]:/);
  if (driveMatch) {
    trimmed = trimmed.substring(driveMatch[0].length);
  }
  if (trimmed.startsWith("/")) {
    trimmed = trimmed.substring(1);
  }

  const pathMarkers = [
    "upload/semiproject/",
    "upload/",
    "board/editor/",
    "campaign/memo/",
    "member/thumb/",
    "notice/",
    "qna/",
  ];

  for (const marker of pathMarkers) {
    const idx = trimmed.indexOf(marker);
    if (idx !== -1) {
      trimmed = trimmed.substring(idx);
      break;
    }
  }

  return getDefaultUrl(trimmed, defaultPrefix);
};
