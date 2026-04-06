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
}
