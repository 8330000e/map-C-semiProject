package kr.co.iei.store.controller;

import kr.co.iei.board.model.vo.Board;
import kr.co.iei.store.model.service.StoreBoardService;
import kr.co.iei.store.model.vo.StoreBoard;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class StoreBoardController {

    private final StoreBoardService storeBoardService;

    @PostMapping("/boards")
    public ResponseEntity<Long> createStoreBoard(@RequestBody StoreBoard storeBoard) {

        Board board = new Board();
        board.setWriterId(storeBoard.getMemberId());
        board.setBoardTitle(storeBoard.getMarketTitle());
        board.setBoardContent(storeBoard.getMarketContent());
        board.setBoardThumb(storeBoard.getProductThumb());
        board.setBoardStatus(0);

        Long marketNo = storeBoardService.createStoreBoard(board, storeBoard);
        return ResponseEntity.ok(marketNo);
    }

    @GetMapping("/boards/{marketNo}")
    public ResponseEntity<StoreBoard> getStoreBoard(@PathVariable Long marketNo) {
        return ResponseEntity.ok(storeBoardService.getStoreBoard(marketNo));
    }
}