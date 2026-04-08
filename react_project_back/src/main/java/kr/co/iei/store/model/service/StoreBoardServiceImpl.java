package kr.co.iei.store.model.service;

import kr.co.iei.store.model.dao.StoreBoardDAO;
import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
import kr.co.iei.store.model.vo.StoreTradeInfo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreBoardServiceImpl implements StoreBoardService {

    private final StoreBoardDAO storeBoardDAO;

    public StoreBoardServiceImpl(StoreBoardDAO storeBoardDAO) {
        this.storeBoardDAO = storeBoardDAO;
    }

    @Override
    public Long createStoreBoard(StoreBoard storeBoard) {
        if (storeBoard == null) {
            return 0L;
        }
        normalizeStoreBoard(storeBoard);

        // 항상 BOARD_TBL에 먼저 저장
        storeBoardDAO.insertBoardForStore(storeBoard);
        if (storeBoard.getBoardNo() == null) {
            return 0L;
        }

        // STORE_BOARD_TBL에 저장
        storeBoardDAO.insertStoreBoard(storeBoard);
        return storeBoard.getMarketNo() != null ? storeBoard.getMarketNo() : 0L;
    }

    @Override
    public List<StoreBoard> getStoreBoardList() {
        List<StoreBoard> list = storeBoardDAO.selectStoreBoardList();
        for (StoreBoard sb : list) {
            sb.setProductStatus(convertStatus(sb.getProductStatus()));
        }
        return list;
    }

    @Override
    public StoreBoard getStoreBoard(Long marketNo) {
        StoreBoard sb = storeBoardDAO.selectStoreBoard(marketNo);
        if (sb != null) {
            sb.setProductStatus(convertStatus(sb.getProductStatus()));
        }
        return sb;
    }

    @Override
    public void updateProductStatus(Long marketNo, Integer status) {
        // status: 0, 1, 2
        storeBoardDAO.updateProductStatus(marketNo, status);
    }

    @Override
    public boolean isStoreBoardAuthor(Long marketNo, String memberId) {
        return storeBoardDAO.selectStoreBoardAuthor(marketNo, memberId) > 0;
    }

    @Override
    public void deleteStoreBoard(Long marketNo) {
        storeBoardDAO.deleteStoreBoard(marketNo);
    }

    @Override
    public Long updateStoreBoardItem(StoreBoard storeBoard) {
        if (storeBoard == null || storeBoard.getMarketNo() == null) {
            return 0L;
        }
        normalizeStoreBoard(storeBoard);
        storeBoardDAO.updateBoardForStore(storeBoard);
        storeBoardDAO.updateStoreBoard(storeBoard);
        return storeBoard.getMarketNo();
    }

    @Override
    public void incrementReadCount(Long marketNo) {
        storeBoardDAO.incrementReadCount(marketNo);
    }

    @Override
    public List<StoreReview> getReviewList(Long marketNo) {
        return storeBoardDAO.selectReviewList(marketNo);
    }

    @Override
    public StoreReview addReview(StoreReview review) {
        storeBoardDAO.insertReview(review);
        return review;
    }

    @Override
    public void editReview(StoreReview review) {
        storeBoardDAO.updateReview(review);
    }

    @Override
    public void removeReview(Long reviewNo, String memberId) {
        storeBoardDAO.deleteReview(reviewNo, memberId);
    }

    @Override
    public List<StoreReview> getLatestReviews(int limit) {
        return storeBoardDAO.selectLatestReviews(limit);
    }

    @Override
    public List<StoreRating> getRatingsByTrade(Long tradeNo) {
        return storeBoardDAO.selectRatingsByTrade(tradeNo);
    }

    @Override
    public List<StoreRating> getRatingsByMarket(Long marketNo) {
        return storeBoardDAO.selectRatingsByMarket(marketNo);
    }

    @Override
    public List<StoreRating> getRatingsBySeller(String sellerId) {
        return storeBoardDAO.selectRatingsBySeller(sellerId);
    }

    @Override
    public StoreRating addRating(StoreRating rating) {
        storeBoardDAO.insertRating(rating);
        return rating;
    }

    @Override
    public void editRating(StoreRating rating) {
        storeBoardDAO.updateRating(rating);
    }

    @Override
    public void removeRating(Long reviewNo, String buyerId) {
        storeBoardDAO.deleteRating(reviewNo, buyerId);
    }

    @Override
    public void saveTradeInfo(StoreTradeInfo tradeInfo) {
        if (tradeInfo == null || tradeInfo.getMarketNo() == null || tradeInfo.getBuyerId() == null) {
            return;
        }
        StoreTradeInfo existing = storeBoardDAO.selectTradeInfoByMarketNoAndBuyerId(tradeInfo.getMarketNo(), tradeInfo.getBuyerId());
        if (existing == null) {
            storeBoardDAO.insertTradeInfo(tradeInfo);
        }
    }

    @Override
    public void updateTradeInfo(StoreTradeInfo tradeInfo) {
        if (tradeInfo == null || tradeInfo.getTradeNo() == null) {
            return;
        }
        storeBoardDAO.updateTradeInfo(tradeInfo);
    }

    @Override
    public void updateTradeInfoByMarketNo(StoreTradeInfo tradeInfo) {
        if (tradeInfo == null || tradeInfo.getMarketNo() == null) {
            throw new IllegalArgumentException("거래 정보가 존재하지 않습니다.");
        }

        if (tradeInfo.getTradeNo() != null) {
            storeBoardDAO.updateTradeInfo(tradeInfo);
            return;
        }

        StoreTradeInfo existing = null;
        if (tradeInfo.getBuyerId() != null) {
            existing = storeBoardDAO.selectTradeInfoByMarketNoAndBuyerId(tradeInfo.getMarketNo(), tradeInfo.getBuyerId());
        }
        if (existing == null) {
            existing = storeBoardDAO.selectTradeInfoByMarketNo(tradeInfo.getMarketNo());
        }

        if (existing == null || existing.getTradeNo() == null) {
            if (tradeInfo.getSellerId() == null || tradeInfo.getBuyerId() == null || tradeInfo.getTradePrice() == null || tradeInfo.getTradeType() == null) {
                throw new IllegalArgumentException("거래 정보가 존재하지 않습니다.");
            }
            storeBoardDAO.insertTradeInfo(tradeInfo);
            return;
        }

        tradeInfo.setTradeNo(existing.getTradeNo());
        storeBoardDAO.updateTradeInfo(tradeInfo);
    }

    @Override
    public StoreTradeInfo getTradeInfoByMarketNo(Long marketNo) {
        return storeBoardDAO.selectTradeInfoByMarketNo(marketNo);
    }

    @Override
    public StoreTradeInfo getTradeInfoByMarketNoAndBuyerId(Long marketNo, String buyerId) {
        return storeBoardDAO.selectTradeInfoByMarketNoAndBuyerId(marketNo, buyerId);
    }

    private void normalizeStoreBoard(StoreBoard storeBoard) {
        if (storeBoard == null) {
            return;
        }

        String tradeType = storeBoard.getTradeType();
        if (tradeType != null) {
            if (tradeType.equals("0") || tradeType.equals("직거래/택배")) {
                storeBoard.setTradeType("직거래/택배");
            } else if (tradeType.equals("1") || tradeType.equals("직거래")) {
                storeBoard.setTradeType("직거래");
            } else if (tradeType.equals("2") || tradeType.equals("택배")) {
                storeBoard.setTradeType("택배");
            }
        }
        // productStatus는 0,1,2 문자열로 저장
        String status = storeBoard.getProductStatus();
        if (status == null || !(status.equals("0") || status.equals("1") || status.equals("2"))) {
            storeBoard.setProductStatus("0");
        }
    }

    // 0,1,2 -> 한글 변환
    private String convertStatus(String status) {
        if (status == null) return "판매중";
        switch (status) {
            case "0": return "판매중";
            case "1": return "예약중";
            case "2": return "판매완료";
            default: return "판매중";
        }
    }
}
