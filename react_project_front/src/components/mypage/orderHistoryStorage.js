const COMPLETED_PURCHASES_KEY = "completed-purchase-history";
const PENDING_PURCHASE_PREFIX = "pending-purchase-order:";

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const getCompletedPurchases = () => {
  if (typeof window === "undefined") return [];
  return parseJson(window.localStorage.getItem(COMPLETED_PURCHASES_KEY), []);
};

export const saveCompletedPurchases = (items) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COMPLETED_PURCHASES_KEY, JSON.stringify(items));
};

export const addCompletedPurchase = (purchase) => {
  const current = getCompletedPurchases();
  const next = [purchase, ...current.filter((item) => item.id !== purchase.id)];
  saveCompletedPurchases(next);
  return next;
};

export const getCompletedPurchaseById = (id) => {
  return getCompletedPurchases().find((item) => String(item.id) === String(id)) || null;
};

export const setPendingPurchase = (orderId, payload) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(`${PENDING_PURCHASE_PREFIX}${orderId}`, JSON.stringify(payload));
};

export const getPendingPurchase = (orderId) => {
  if (typeof window === "undefined") return null;
  return parseJson(window.sessionStorage.getItem(`${PENDING_PURCHASE_PREFIX}${orderId}`), null);
};

export const clearPendingPurchase = (orderId) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(`${PENDING_PURCHASE_PREFIX}${orderId}`);
};
