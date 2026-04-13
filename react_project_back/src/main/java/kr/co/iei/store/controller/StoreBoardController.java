package kr.co.iei.store.controller;

import kr.co.iei.store.model.service.StoreBoardService;
import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreCart;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;
import kr.co.iei.store.model.vo.StoreTradeInfo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store")
public class StoreBoardController {

    private static final Logger log = LoggerFactory.getLogger(StoreBoardController.class);
    private final StoreBoardService storeBoardService;

    public StoreBoardController(StoreBoardService storeBoardService) {
        this.storeBoardService = storeBoardService;
    }

    // 중고상품 등록 기능임. 새 상품 정보를 서버에 저장하고 상품 번호를 리턴함.
    @PostMapping("/boards")
    public ResponseEntity<?> createStoreBoard(@RequestBody StoreBoard storeBoard) {
        try {
            Long marketNo = storeBoardService.createStoreBoard(storeBoard);
            return ResponseEntity.ok(marketNo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("상품 등록 실패 payload={}", storeBoard, e);
            Throwable cause = e.getCause();
            if (cause instanceof java.sql.SQLIntegrityConstraintViolationException
                    || e instanceof java.sql.SQLIntegrityConstraintViolationException) {
                return ResponseEntity.badRequest().body("회원 정보가 유효하지 않습니다. 다시 로그인 후 시도해주세요.");
            }
            return ResponseEntity.internalServerError().body("상품 등록 실패: " + e.getMessage());
        }
    }

    // 중고거래 리스트 기능임. 판매 중인 상품 목록을 전체 조회함.
    //  - 프론트는 이 데이터를 중고거래 메인 목록에 렌더링함.
    //  - 필터나 검색은 프론트 쪽에서 추가로 처리될 수 있음.
    @GetMapping("/boards")
    public ResponseEntity<List<StoreBoard>> getStoreBoardList() {
        return ResponseEntity.ok(storeBoardService.getStoreBoardList());
    }

    // 중고상품 상세보기 기능임. 상품 번호로 상세 정보를 가져옴.
    @GetMapping("/boards/{marketNo}")
    public ResponseEntity<StoreBoard> getStoreBoard(@PathVariable Long marketNo) {
        return ResponseEntity.ok(storeBoardService.getStoreBoard(marketNo));
    }

    @PatchMapping("/boards/{marketNo}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long marketNo,
                                          @RequestParam Integer status,
                                          @RequestParam String memberId) {
        try {
            if (!storeBoardService.isStoreBoardAuthor(marketNo, memberId)) {
                return ResponseEntity.status(403).body("작성자만 상태를 변경할 수 있습니다.");
            }
            storeBoardService.updateProductStatus(marketNo, status);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("상태 변경 실패 marketNo={} status={}", marketNo, status, e);
            return ResponseEntity.internalServerError().body("상태 변경 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/boards/{marketNo}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long marketNo, @RequestParam String memberId) {
        try {
            if (!storeBoardService.isStoreBoardAuthor(marketNo, memberId)) {
                return ResponseEntity.status(403).body("작성자만 삭제할 수 있습니다.");
            }
            storeBoardService.deleteStoreBoard(marketNo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("상품 삭제 실패 marketNo={}", marketNo, e);
            return ResponseEntity.internalServerError().body("상품 삭제 실패: " + e.getMessage());
        }
    }

    @PutMapping("/boards/{marketNo}")
    public ResponseEntity<?> updateBoard(@PathVariable Long marketNo, @RequestBody StoreBoard storeBoard) {
        try {
            storeBoard.setMarketNo(marketNo);
            Long no = storeBoardService.updateStoreBoardItem(storeBoard);
            return ResponseEntity.ok(no);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("상품 수정 실패 payload={}", storeBoard, e);
            return ResponseEntity.internalServerError().body("상품 수정 실패: " + e.getMessage());
        }
    }

    /** 조회수 증가 */
    @GetMapping("/boards/{marketNo}/read")
    public ResponseEntity<?> incrementRead(@PathVariable Long marketNo) {
        try {
            storeBoardService.incrementReadCount(marketNo);
            StoreBoard updated = storeBoardService.getStoreBoard(marketNo);
            return ResponseEntity.ok(updated != null ? updated.getReadCount() : 0);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("조회수 증가 실패: " + e.getMessage());
        }
    }

    // 실시간 댓글 리스트 기능임. 최신 리뷰를 받아와서 메인 화면에 보여줌.
    @GetMapping("/reviews/latest")
    public ResponseEntity<List<StoreReview>> getLatestReviews(
            @RequestParam(defaultValue = "30") int limit) {
        return ResponseEntity.ok(storeBoardService.getLatestReviews(limit));
    }

    // 상품 댓글 목록 기능임. 해당 상품에 달린 리뷰를 모두 조회함.
    //  - 상품 상세 페이지에서 댓글 리스트를 렌더링할 때 사용됨.
    //  - 최신 순 또는 정렬은 프론트에서 결정할 수 있음.
    @GetMapping("/boards/{marketNo}/reviews")
    public ResponseEntity<List<StoreReview>> getReviews(@PathVariable Long marketNo) {
        return ResponseEntity.ok(storeBoardService.getReviewList(marketNo));
    }

    // 댓글 등록 기능임. 상품에 리뷰를 새로 추가함.
    //  - review 객체에 marketNo를 설정한 뒤 DB에 저장함.
    //  - 등록 성공 시 저장된 댓글 정보를 반환함.
    @PostMapping("/boards/{marketNo}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long marketNo, @RequestBody StoreReview review) {
        try {
            review.setMarketNo(marketNo);
            StoreReview saved = storeBoardService.addReview(review);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("댓글 등록 실패", e);
            return ResponseEntity.internalServerError().body("댓글 등록 실패: " + e.getMessage());
        }
    }

    @PostMapping("/cart")
    public ResponseEntity<?> addCartItem(@RequestBody StoreCart cart) {
        try {
            storeBoardService.addOrUpdateCartItem(cart);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("장바구니 추가 실패 payload={}", cart, e);
            return ResponseEntity.internalServerError().body("장바구니 추가 실패: " + e.getMessage());
        }
    }

    @GetMapping("/cart")
    public ResponseEntity<?> getCartItems(@RequestParam String memberId) {
        try {
            return ResponseEntity.ok(storeBoardService.getCartByMemberId(memberId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("장바구니 조회 실패 memberId={}", memberId, e);
            return ResponseEntity.internalServerError().body("장바구니 조회 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/cart/{cartNo}")
    public ResponseEntity<?> deleteCartItem(@PathVariable Long cartNo, @RequestParam String memberId) {
        try {
            storeBoardService.removeCartItem(cartNo, memberId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("장바구니 삭제 실패 cartNo={} memberId={}", cartNo, memberId, e);
            return ResponseEntity.internalServerError().body("장바구니 삭제 실패: " + e.getMessage());
        }
    }

    /** 댓글 수정 */
    @PutMapping("/boards/{marketNo}/reviews/{reviewNo}")
    public ResponseEntity<?> editReview(@PathVariable Long marketNo,
                                        @PathVariable Long reviewNo,
                                        @RequestBody StoreReview review) {
        try {
            review.setReviewNo(reviewNo);
            review.setMarketNo(marketNo);
            storeBoardService.editReview(review);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("댓글 수정 실패", e);
            return ResponseEntity.internalServerError().body("댓글 수정 실패: " + e.getMessage());
        }
    }

    /** 댓글 삭제 */
    @DeleteMapping("/boards/{marketNo}/reviews/{reviewNo}")
    public ResponseEntity<?> deleteReview(@PathVariable Long marketNo,
                                          @PathVariable Long reviewNo,
                                          @RequestParam String memberId) {
        try {
            storeBoardService.removeReview(reviewNo, memberId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("댓글 삭제 실패", e);
            return ResponseEntity.internalServerError().body("댓글 삭제 실패: " + e.getMessage());
        }
    }

    @GetMapping("/trades/{tradeNo}/ratings")
    public ResponseEntity<?> getRatings(@PathVariable Long tradeNo) {
        try {
            return ResponseEntity.ok(storeBoardService.getRatingsByTrade(tradeNo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 조회 실패 tradeNo={}", tradeNo, e);
            return ResponseEntity.internalServerError().body("평가 조회 실패: " + e.getMessage());
        }
    }

    @GetMapping("/markets/{marketNo}/ratings")
    public ResponseEntity<?> getRatingsByMarket(@PathVariable Long marketNo) {
        try {
            return ResponseEntity.ok(storeBoardService.getRatingsByMarket(marketNo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 조회 실패 marketNo={}", marketNo, e);
            return ResponseEntity.internalServerError().body("평가 조회 실패: " + e.getMessage());
        }
    }

    @GetMapping("/sellers/{sellerId}/ratings")
    public ResponseEntity<?> getRatingsBySeller(@PathVariable String sellerId) {
        try {
            return ResponseEntity.ok(storeBoardService.getRatingsBySeller(sellerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 조회 실패 sellerId={}", sellerId, e);
            return ResponseEntity.internalServerError().body("평가 조회 실패: " + e.getMessage());
        }
    }

    @PostMapping("/markets/{marketNo}/ratings")
    public ResponseEntity<?> addRatingByMarket(@PathVariable Long marketNo, @RequestBody StoreRating rating) {
        try {
            rating.setMarketNo(marketNo);
            StoreRating saved = storeBoardService.addRating(rating);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 등록 실패 marketNo={} payload={}", marketNo, rating, e);
            return ResponseEntity.internalServerError().body("평가 등록 실패: " + e.getMessage());
        }
    }

    @PutMapping("/markets/{marketNo}/ratings/{reviewNo}")
    public ResponseEntity<?> editRatingByMarket(@PathVariable Long marketNo,
                                                @PathVariable Long reviewNo,
                                                @RequestBody StoreRating rating) {
        try {
            rating.setMarketNo(marketNo);
            rating.setReviewNo(reviewNo);
            storeBoardService.editRating(rating);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 수정 실패 marketNo={} reviewNo={}", marketNo, reviewNo, e);
            return ResponseEntity.internalServerError().body("평가 수정 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/markets/{marketNo}/ratings/{reviewNo}")
    public ResponseEntity<?> deleteRatingByMarket(@PathVariable Long marketNo,
                                                  @PathVariable Long reviewNo,
                                                  @RequestParam String buyerId) {
        try {
            storeBoardService.removeRating(reviewNo, buyerId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 삭제 실패 marketNo={} reviewNo={}", marketNo, reviewNo, e);
            return ResponseEntity.internalServerError().body("평가 삭제 실패: " + e.getMessage());
        }
    }

    @PostMapping("/trades")
    public ResponseEntity<?> saveTradeInfo(@RequestBody StoreTradeInfo tradeInfo) {
        try {
            storeBoardService.saveTradeInfo(tradeInfo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("결제 정보 저장 실패 payload={}", tradeInfo, e);
            return ResponseEntity.internalServerError().body("결제 정보 저장 실패: " + e.getMessage());
        }
    }

    @GetMapping("/trades")
    public ResponseEntity<?> getTrades(@RequestParam(required = false) String buyerId,
                                       @RequestParam(required = false) String sellerId) {
        try {
            if (buyerId != null) {
                return ResponseEntity.ok(storeBoardService.getTradesByBuyerId(buyerId));
            }
            if (sellerId != null) {
                return ResponseEntity.ok(storeBoardService.getTradesBySellerId(sellerId));
            }
            return ResponseEntity.badRequest().body("buyerId 또는 sellerId 중 하나를 지정해야 합니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("거래 목록 조회 실패 buyerId={} sellerId={}", buyerId, sellerId, e);
            return ResponseEntity.internalServerError().body("거래 목록 조회 실패: " + e.getMessage());
        }
    }

    @GetMapping("/trades/{tradeNo}")
    public ResponseEntity<?> getTradeByTradeNo(@PathVariable Long tradeNo) {
        try {
            StoreTradeInfo tradeInfo = storeBoardService.getTradeInfoByTradeNo(tradeNo);
            if (tradeInfo == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(tradeInfo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("거래 정보 조회 실패 tradeNo={}", tradeNo, e);
            return ResponseEntity.internalServerError().body("거래 정보 조회 실패: " + e.getMessage());
        }
    }

    // 거래 정보 조회 기능임. 상품 번호와 구매자 정보로 거래 상태를 가져옴.
    @GetMapping("/markets/{marketNo}/trade-info")
    public ResponseEntity<?> getTradeInfo(@PathVariable Long marketNo,
                                          @RequestParam(required = false) String buyerId) {
        try {
            StoreTradeInfo tradeInfo = null;
            if (buyerId != null) {
                tradeInfo = storeBoardService.getTradeInfoByMarketNoAndBuyerId(marketNo, buyerId);
                if (tradeInfo == null) {
                    tradeInfo = storeBoardService.getTradeInfoByMarketNo(marketNo);
                }
            } else {
                tradeInfo = storeBoardService.getTradeInfoByMarketNo(marketNo);
            }
            if (tradeInfo == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(tradeInfo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("거래 정보 조회 실패 marketNo={} buyerId={}", marketNo, buyerId, e);
            return ResponseEntity.internalServerError().body("거래 정보 조회 실패: " + e.getMessage());
        }
    }

    @PatchMapping("/trades/{tradeNo}")
    public ResponseEntity<?> updateTradeInfo(@PathVariable Long tradeNo, @RequestBody StoreTradeInfo tradeInfo) {
        try {
            tradeInfo.setTradeNo(tradeNo);
            storeBoardService.updateTradeInfo(tradeInfo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("거래 정보 수정 실패 tradeNo={} payload={}", tradeNo, tradeInfo, e);
            return ResponseEntity.internalServerError().body("거래 정보 수정 실패: " + e.getMessage());
        }
    }

    @RequestMapping(value = "/markets/{marketNo}/trade-info", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<?> updateTradeInfoByMarketNo(@PathVariable Long marketNo, @RequestBody StoreTradeInfo tradeInfo) {
        try {
            tradeInfo.setMarketNo(marketNo);
            storeBoardService.updateTradeInfoByMarketNo(tradeInfo);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("거래 정보 수정 실패 marketNo={} payload={}", marketNo, tradeInfo, e);
            return ResponseEntity.internalServerError().body("거래 정보 수정 실패: " + e.getMessage());
        }
    }

    @PostMapping("/trades/{tradeNo}/ratings")
    public ResponseEntity<?> addRating(@PathVariable Long tradeNo, @RequestBody StoreRating rating) {
        try {
            rating.setTradeNo(tradeNo);
            StoreRating saved = storeBoardService.addRating(rating);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 등록 실패 tradeNo={} payload={}", tradeNo, rating, e);
            return ResponseEntity.internalServerError().body("평가 등록 실패: " + e.getMessage());
        }
    }

    @PutMapping("/trades/{tradeNo}/ratings/{reviewNo}")
    public ResponseEntity<?> editRating(@PathVariable Long tradeNo,
                                        @PathVariable Long reviewNo,
                                        @RequestBody StoreRating rating) {
        try {
            rating.setTradeNo(tradeNo);
            rating.setReviewNo(reviewNo);
            storeBoardService.editRating(rating);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 수정 실패 tradeNo={} reviewNo={}", tradeNo, reviewNo, e);
            return ResponseEntity.internalServerError().body("평가 수정 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/trades/{tradeNo}/ratings/{reviewNo}")
    public ResponseEntity<?> deleteRating(@PathVariable Long tradeNo,
                                          @PathVariable Long reviewNo,
                                          @RequestParam String buyerId) {
        try {
            storeBoardService.removeRating(reviewNo, buyerId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("평가 삭제 실패 tradeNo={} reviewNo={}", tradeNo, reviewNo, e);
            return ResponseEntity.internalServerError().body("평가 삭제 실패: " + e.getMessage());
        }
    }
}