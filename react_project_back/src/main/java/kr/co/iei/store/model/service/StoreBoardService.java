package kr.co.iei.store.model.service;

import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
import kr.co.iei.store.model.vo.StoreTradeInfo;

import java.util.List;

public interface StoreBoardService {

    Long createStoreBoard(StoreBoard storeBoard);

    List<StoreBoard> getStoreBoardList();

    StoreBoard getStoreBoard(Long marketNo);

    void updateProductStatus(Long marketNo, Integer status);

    boolean isStoreBoardAuthor(Long marketNo, String memberId);

    void deleteStoreBoard(Long marketNo);

    Long updateStoreBoardItem(StoreBoard storeBoard);

    void incrementReadCount(Long marketNo);

    List<StoreReview> getReviewList(Long marketNo);

    StoreReview addReview(StoreReview review);

    void editReview(StoreReview review);

    void removeReview(Long reviewNo, String memberId);

    List<StoreReview> getLatestReviews(int limit);

    void saveTradeInfo(StoreTradeInfo tradeInfo);

    StoreTradeInfo getTradeInfoByMarketNo(Long marketNo);

    StoreTradeInfo getTradeInfoByMarketNoAndBuyerId(Long marketNo, String buyerId);

    StoreTradeInfo getTradeInfoByTradeNo(Long tradeNo);

    List<StoreTradeInfo> getTradesByBuyerId(String buyerId);

    List<StoreTradeInfo> getTradesBySellerId(String sellerId);

    void updateTradeInfo(StoreTradeInfo tradeInfo);

    void updateTradeInfoByMarketNo(StoreTradeInfo tradeInfo);

    List<StoreRating> getRatingsByTrade(Long tradeNo);

    List<StoreRating> getRatingsByMarket(Long marketNo);

    List<StoreRating> getRatingsBySeller(String sellerId);

    StoreRating addRating(StoreRating rating);

    void editRating(StoreRating rating);

    void removeRating(Long reviewNo, String buyerId);
}