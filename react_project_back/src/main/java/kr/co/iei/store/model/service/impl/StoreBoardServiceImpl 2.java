package kr.co.iei.store.model.service.impl;

import kr.co.iei.store.model.dao.StoreBoardDAO;
import kr.co.iei.store.model.service.StoreBoardService;
import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class StoreBoardServiceImpl implements StoreBoardService {

    private final StoreBoardDAO storeBoardDAO;

    public StoreBoardServiceImpl(StoreBoardDAO storeBoardDAO) {
        this.storeBoardDAO = storeBoardDAO;
    }

    @Transactional
    @Override
    public Long createStoreBoard(StoreBoard storeBoard) {
        if (storeBoard == null) {
            throw new IllegalArgumentException("요청 데이터가 비어 있습니다.");
        }
        if (storeBoard.getMemberId() == null || storeBoard.getMemberId().isBlank()) {
            throw new IllegalArgumentException("memberId가 필요합니다.");
        }
        if (storeBoard.getTradeType() == null || storeBoard.getTradeType().isBlank()) {
            throw new IllegalArgumentException("tradeType이 필요합니다.");
        }

        if (!"택배".equals(storeBoard.getTradeType())) {
            if (storeBoard.getCtpvsggId() == null || storeBoard.getCtpvsggId().isBlank()) {
                throw new IllegalArgumentException("ctpvsggId가 필요합니다.");
            }
            storeBoard.setCtpvsggId(normalizeRegionCode(storeBoard.getCtpvsggId()));
        } else {
            storeBoard.setCtpvsggId(null);
        }

        if (storeBoard.getProductStatus() == null) {
            storeBoard.setProductStatus(0);
        }

        storeBoardDAO.insertBoardForStore(storeBoard);
        storeBoardDAO.insertStoreBoard(storeBoard);
        return storeBoard.getMarketNo();
    }

    private String normalizeRegionCode(String raw) {
        String value = raw.trim();
        if (value.matches("\\d+")) {
            return value;
        }

        Map<String, String> regionCodeMap = Map.of(
                "서울 강남구", "11680",
                "서울 마포구", "11440",
                "서울 송파구", "11710",
                "서울 영등포구", "11560",
                "서울 성동구", "11200",
                "서울 용산구", "11170",
                "서울 서초구", "11650",
                "서울 동작구", "11590",
                "서울 은평구", "11380",
                "서울 강동구", "11740"
        );

        return regionCodeMap.getOrDefault(value, value);
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

    @Transactional
    @Override
    public Long updateStoreBoardItem(StoreBoard storeBoard) {
        if (storeBoard == null || storeBoard.getMarketNo() == null) {
            throw new IllegalArgumentException("수정 대상 정보가 없습니다.");
        }
        if (!"택배".equals(storeBoard.getTradeType())) {
            if (storeBoard.getCtpvsggId() == null || storeBoard.getCtpvsggId().isBlank()) {
                throw new IllegalArgumentException("ctpvsggId가 필요합니다.");
            }
        } else {
            storeBoard.setCtpvsggId(null);
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
        if (review == null || review.getMemberId() == null || review.getMemberId().isBlank()) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        if (review.getReviewContent() == null || review.getReviewContent().isBlank()) {
            throw new IllegalArgumentException("댓글 내용을 입력해주세요.");
        }
        if (review.getIsPrivate() == null) {
            review.setIsPrivate(0);
        }
        storeBoardDAO.insertReview(review);
        return review;
    }

    @Override
    public void editReview(StoreReview review) {
        if (review == null || review.getReviewNo() == null) {
            throw new IllegalArgumentException("수정 대상 댓글이 없습니다.");
        }
        storeBoardDAO.updateReview(review);
    }

    @Override
    public void removeReview(Long reviewNo, String memberId) {
        storeBoardDAO.deleteReview(reviewNo, memberId);
    }

    @Override
    public List<StoreReview> getLatestReviews(int limit) {
        return storeBoardDAO.selectLatestReviews(limit > 0 ? limit : 20);
    }

    @Override
    public List<StoreRating> getRatingsByTrade(Long tradeNo) {
        if (tradeNo == null) {
            throw new IllegalArgumentException("tradeNo가 필요합니다.");
        }
        return storeBoardDAO.selectRatingsByTrade(tradeNo);
    }

    @Override
    public List<StoreRating> getRatingsByMarket(Long marketNo) {
        if (marketNo == null) {
            throw new IllegalArgumentException("marketNo가 필요합니다.");
        }
        return storeBoardDAO.selectRatingsByMarket(marketNo);
    }

    @Transactional
    @Override
    public StoreRating addRating(StoreRating rating) {
        if (rating == null || (rating.getTradeNo() == null && rating.getMarketNo() == null)) {
            throw new IllegalArgumentException("거래 또는 상품 정보가 없습니다.");
        }
        if (rating.getBuyerId() == null || rating.getBuyerId().isBlank()) {
            throw new IllegalArgumentException("구매자 정보가 필요합니다.");
        }
        if (rating.getMarketNo() == null) {
            throw new IllegalArgumentException("상품 정보가 없습니다.");
        }
        if (rating.getReviewContent() == null || rating.getReviewContent().isBlank()) {
            throw new IllegalArgumentException("평가 내용을 입력해주세요.");
        }
        if (rating.getRating() == null || rating.getRating() < 1 || rating.getRating() > 5) {
            throw new IllegalArgumentException("평가 점수는 1점부터 5점까지 가능합니다.");
        }
        StoreRating existing = rating.getTradeNo() != null
                ? storeBoardDAO.selectRatingByTradeAndBuyer(rating.getTradeNo(), rating.getBuyerId())
                : storeBoardDAO.selectRatingByMarketAndBuyer(rating.getMarketNo(), rating.getBuyerId());
        if (existing != null) {
            throw new IllegalArgumentException("이미 해당 상품에 대한 평가를 등록했습니다.");
        }
        storeBoardDAO.insertRating(rating);
        return rating;
    }

    @Override
    public void editRating(StoreRating rating) {
        if (rating == null || rating.getReviewNo() == null) {
            throw new IllegalArgumentException("수정할 평가 정보가 없습니다.");
        }
        if (rating.getBuyerId() == null || rating.getBuyerId().isBlank()) {
            throw new IllegalArgumentException("구매자 정보가 필요합니다.");
        }
        if (rating.getReviewContent() == null || rating.getReviewContent().isBlank()) {
            throw new IllegalArgumentException("평가 내용을 입력해주세요.");
        }
        if (rating.getRating() == null || rating.getRating() < 1 || rating.getRating() > 5) {
            throw new IllegalArgumentException("평가 점수는 1점부터 5점까지 가능합니다.");
        }
        storeBoardDAO.updateRating(rating);
    }

    @Override
    public void removeRating(Long reviewNo, String buyerId) {
        if (reviewNo == null || buyerId == null || buyerId.isBlank()) {
            throw new IllegalArgumentException("삭제할 평가 정보가 없습니다.");
        }
        storeBoardDAO.deleteRating(reviewNo, buyerId);
    }
}