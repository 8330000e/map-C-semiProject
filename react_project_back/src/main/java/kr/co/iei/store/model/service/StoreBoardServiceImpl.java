package kr.co.iei.store.model.service;

import kr.co.iei.store.model.dao.StoreBoardDAO;
import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
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
        storeBoardDAO.insertBoardForStore(storeBoard);
        if (storeBoard.getBoardNo() == null) {
            return 0L;
        }
        storeBoardDAO.insertStoreBoard(storeBoard);
        return storeBoard.getMarketNo() != null ? storeBoard.getMarketNo() : 0L;
    }

    @Override
    public List<StoreBoard> getStoreBoardList() {
        return storeBoardDAO.selectStoreBoardList();
    }

    @Override
    public StoreBoard getStoreBoard(Long marketNo) {
        return storeBoardDAO.selectStoreBoard(marketNo);
    }

    @Override
    public void updateProductStatus(Long marketNo, Integer status) {
        storeBoardDAO.updateProductStatus(marketNo, status);
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

        String productStatus = storeBoard.getProductStatus();
        if (productStatus == null) {
            storeBoard.setProductStatus("0");
        } else if (productStatus.equals("1") || productStatus.equals("예약중")) {
            storeBoard.setProductStatus("1");
        } else if (productStatus.equals("2") || productStatus.equals("판매완료")) {
            storeBoard.setProductStatus("2");
        } else {
            storeBoard.setProductStatus("0");
        }
    }
}
