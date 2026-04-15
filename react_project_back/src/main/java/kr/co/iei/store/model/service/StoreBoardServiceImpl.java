package kr.co.iei.store.model.service;

import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.store.model.dao.StoreBoardDAO;
import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreCart;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
import kr.co.iei.store.model.vo.StoreTradeInfo;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StoreBoardServiceImpl implements StoreBoardService {

    private final StoreBoardDAO storeBoardDAO;
    private final MemberService memberService;

    public StoreBoardServiceImpl(StoreBoardDAO storeBoardDAO, MemberService memberService) {
        this.storeBoardDAO = storeBoardDAO;
        this.memberService = memberService;
    }

    // 문자열이 null, 빈 문자열, "null", "undefined"로 들어올 때 모두 비어있다고 판정함.
    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty() || value.trim().equalsIgnoreCase("null") || value.trim().equalsIgnoreCase("undefined");
    }

    private void fillMissingMemberInfo(StoreBoard storeBoard) {
        if (storeBoard == null || isBlank(storeBoard.getMemberId())) {
            return;
        }
        if (!isBlank(storeBoard.getMemberNickname()) && !isBlank(storeBoard.getWriterNickname()) && !isBlank(storeBoard.getMemberThumb())) {
            return;
        }
        Member member = memberService.selectOneMember(storeBoard.getMemberId());
        if (member == null) {
            return;
        }
        if (isBlank(storeBoard.getMemberNickname()) && !isBlank(member.getMemberNickname())) {
            storeBoard.setMemberNickname(member.getMemberNickname());
        }
        if (isBlank(storeBoard.getWriterNickname()) && !isBlank(member.getMemberNickname())) {
            storeBoard.setWriterNickname(member.getMemberNickname());
        }
        if (isBlank(storeBoard.getMemberThumb()) && !isBlank(member.getMemberThumb())) {
            storeBoard.setMemberThumb(member.getMemberThumb());
        }
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
            fillMissingMemberInfo(sb);
        }
        return list;
    }

    @Override
    public StoreBoard getStoreBoard(Long marketNo) {
        StoreBoard sb = storeBoardDAO.selectStoreBoard(marketNo);
        if (sb != null) {
            sb.setProductStatus(convertStatus(sb.getProductStatus()));
            fillMissingMemberInfo(sb);
            // 상세 페이지 불러오기 시 작성자 썸네일이 없으면 회원 정보에서 추가로 채워줌.
            if (isBlank(sb.getMemberThumb()) && sb.getMemberId() != null) {
                Member member = memberService.selectOneMember(sb.getMemberId());
                if (member != null && !isBlank(member.getMemberThumb())) {
                    sb.setMemberThumb(member.getMemberThumb());
                }
            }
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
        List<StoreReview> reviews = storeBoardDAO.selectReviewList(marketNo);
        if (reviews == null || reviews.isEmpty()) {
            return reviews;
        }

        // 리뷰 목록에서 작성자 썸네일이 누락된 경우, 회원 정보로 보강함.
        Map<String, Member> memberCache = new HashMap<>();
        for (StoreReview review : reviews) {
            if (isBlank(review.getMemberThumb()) && review.getMemberId() != null) {
                Member member = memberCache.computeIfAbsent(review.getMemberId(), memberService::selectOneMember);
                if (member != null && !isBlank(member.getMemberThumb())) {
                    review.setMemberThumb(member.getMemberThumb());
                }
            }
        }

        return reviews;
    }

    @Override
    public StoreReview addReview(StoreReview review) {
        storeBoardDAO.insertReview(review);
        // 댓글 등록 후에도 작성자 썸네일이 빈 경우, 회원 정보로 채워서 반환함.
        if (isBlank(review.getMemberThumb()) && review.getMemberId() != null) {
            Member member = memberService.selectOneMember(review.getMemberId());
            if (member != null && !isBlank(member.getMemberThumb())) {
                review.setMemberThumb(member.getMemberThumb());
            }
        }
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
    public List<StoreCart> getCartByMemberId(String memberId) {
        if (memberId == null || memberId.isBlank()) {
            return List.of();
        }
        return storeBoardDAO.selectCartByMemberId(memberId);
    }

    @Override
    public void addOrUpdateCartItem(StoreCart cart) {
        if (cart == null || cart.getMemberId() == null || cart.getMemberId().isBlank() || cart.getMarketNo() == null) {
            return;
        }
        if (cart.getQuantity() == null || cart.getQuantity() <= 0) {
            cart.setQuantity(1);
        }
        StoreCart existing = storeBoardDAO.selectCartItem(cart.getMemberId(), cart.getMarketNo());
        if (existing == null) {
            storeBoardDAO.insertCartItem(cart);
            return;
        }
        Integer nextQuantity = (existing.getQuantity() != null ? existing.getQuantity() : 0) + cart.getQuantity();
        storeBoardDAO.updateCartQuantity(existing.getCartNo(), nextQuantity);
    }

    @Override
    public void removeCartItem(Long cartNo, String memberId) {
        if (cartNo == null || memberId == null || memberId.isBlank()) {
            return;
        }
        storeBoardDAO.deleteCartItem(cartNo, memberId);
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

    @Override
    public StoreTradeInfo getTradeInfoByTradeNo(Long tradeNo) {
        return storeBoardDAO.selectTradeInfoByTradeNo(tradeNo);
    }

    @Override
    public List<StoreTradeInfo> getTradesByBuyerId(String buyerId) {
        if (buyerId == null || buyerId.isBlank()) {
            return List.of();
        }
        return storeBoardDAO.selectTradeInfoByBuyerId(buyerId);
    }

    @Override
    public List<StoreTradeInfo> getTradesBySellerId(String sellerId) {
        if (sellerId == null || sellerId.isBlank()) {
            return List.of();
        }
        return storeBoardDAO.selectTradeInfoBySellerId(sellerId);
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
