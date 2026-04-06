export const mockPurchaseHistory = [
  {
    id: 1,
    tradeNo: 1,
    marketNo: 2,
    title: "재생 우드 의자",
    date: "2026-03-22",
    amount: 75000,
    status: "구매완료",
    tradeType: 0,
    tradeTypeText: "직거래/택배",
    seller: "업사이클샵",
    sellerId: "upcycleshop",
  },
  {
    id: 2,
    tradeNo: 2,
    marketNo: 3,
    title: "중고 노트북",
    date: "2026-03-18",
    amount: 430000,
    status: "배송대기",
    tradeType: 2,
    tradeTypeText: "택배",
    seller: "노트북박사",
    sellerId: "laptopmaster",
  },
];

export const tradeTypeLabel = (type, text) => {
  if (text) return text;
  if (type === 0) return "직거래/택배";
  if (type === 1) return "직거래";
  if (type === 2) return "택배";
  return "-";
};
