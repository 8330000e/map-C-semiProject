package kr.co.iei.store.model.service;

import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Minimal stub implementation so Spring can create a StoreBoardService bean.
 *
 * Replace with a full implementation wired to DAOs/MyBatis mappers when ready.
 */
@Service
public class StoreBoardServiceImpl implements StoreBoardService {

    @Override
    public Long createStoreBoard(StoreBoard storeBoard) {
        if (storeBoard == null) return 0L;
        return storeBoard.getMarketNo() != null ? storeBoard.getMarketNo() : 0L;
    }

    @Override
    public List<StoreBoard> getStoreBoardList() {
        return Collections.emptyList();
    }

    @Override
    public StoreBoard getStoreBoard(Long marketNo) {
        return null;
    }

    @Override
    public void updateProductStatus(Long marketNo, Integer status) {
        // no-op stub
    }

    @Override
    public void deleteStoreBoard(Long marketNo) {
        // no-op stub
    }

    @Override
    public Long updateStoreBoardItem(StoreBoard storeBoard) {
        if (storeBoard == null) return 0L;
        return storeBoard.getMarketNo() != null ? storeBoard.getMarketNo() : 0L;
    }

    @Override
    public void incrementReadCount(Long marketNo) {
        // no-op stub
    }

    @Override
    public List<StoreReview> getReviewList(Long marketNo) {
        return Collections.emptyList();
    }

    @Override
    public StoreReview addReview(StoreReview review) {
        return review;
    }

    @Override
    public void editReview(StoreReview review) {
        // no-op stub
    }

    @Override
    public void removeReview(Long reviewNo, String memberId) {
        // no-op stub
    }

    @Override
    public List<StoreReview> getLatestReviews(int limit) {
        return Collections.emptyList();
    }

    @Override
    public List<StoreRating> getRatingsByTrade(Long tradeNo) {
        return Collections.emptyList();
    }

    @Override
    public List<StoreRating> getRatingsByMarket(Long marketNo) {
        return Collections.emptyList();
    }

    @Override
    public StoreRating addRating(StoreRating rating) {
        return rating;
    }

    @Override
    public void editRating(StoreRating rating) {
        // no-op stub
    }

    @Override
    public void removeRating(Long reviewNo, String buyerId) {
        // no-op stub
    }
}
