package kr.co.iei.store.controller;

import kr.co.iei.store.model.service.StoreBoardService;
import kr.co.iei.store.model.vo.StoreBoard;
import kr.co.iei.store.model.vo.StoreRating;
import kr.co.iei.store.model.vo.StoreReview;

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

    @GetMapping("/boards")
    public ResponseEntity<List<StoreBoard>> getStoreBoardList() {
        return ResponseEntity.ok(storeBoardService.getStoreBoardList());
    }

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

    /** 전체 최신 공개 댓글 */
    @GetMapping("/reviews/latest")
    public ResponseEntity<List<StoreReview>> getLatestReviews(
            @RequestParam(defaultValue = "30") int limit) {
        return ResponseEntity.ok(storeBoardService.getLatestReviews(limit));
    }

    /** 댓글 목록 */
    @GetMapping("/boards/{marketNo}/reviews")
    public ResponseEntity<List<StoreReview>> getReviews(@PathVariable Long marketNo) {
        return ResponseEntity.ok(storeBoardService.getReviewList(marketNo));
    }

    /** 댓글 등록 */
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