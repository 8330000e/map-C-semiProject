package kr.co.iei.store.model.dao;

import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StoreBoardDAO {

    int insertBoardForStore(StoreBoard storeBoard);

    int insertStoreBoard(StoreBoard storeBoard);

    List<StoreBoard> selectStoreBoardList();

    StoreBoard selectStoreBoard(@Param("marketNo") Long marketNo);

    int updateProductStatus(@Param("marketNo") Long marketNo, @Param("status") Integer status);

    int selectStoreBoardAuthor(@Param("marketNo") Long marketNo, @Param("memberId") String memberId);

    int deleteStoreBoard(@Param("marketNo") Long marketNo);

    int updateBoardForStore(StoreBoard storeBoard);

    int updateStoreBoard(StoreBoard storeBoard);

    int incrementReadCount(@Param("marketNo") Long marketNo);

    List<StoreReview> selectReviewList(@Param("marketNo") Long marketNo);

    int insertReview(StoreReview review);

    int updateReview(StoreReview review);

    int deleteReview(@Param("reviewNo") Long reviewNo, @Param("memberId") String memberId);

    List<StoreReview> selectLatestReviews(@Param("limit") int limit);

    List<StoreRating> selectRatingsByTrade(@Param("tradeNo") Long tradeNo);

    List<StoreRating> selectRatingsByMarket(@Param("marketNo") Long marketNo);

    StoreRating selectRatingByTradeAndBuyer(@Param("tradeNo") Long tradeNo,
                                            @Param("buyerId") String buyerId);

    StoreRating selectRatingByMarketAndBuyer(@Param("marketNo") Long marketNo,
                                             @Param("buyerId") String buyerId);

    int insertRating(StoreRating rating);

    int updateRating(StoreRating rating);

    int deleteRating(@Param("reviewNo") Long reviewNo, @Param("buyerId") String buyerId);
}
