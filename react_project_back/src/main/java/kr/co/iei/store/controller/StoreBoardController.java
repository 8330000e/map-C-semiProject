package kr.co.iei.store.controller;

import kr.co.iei.store.model.service.StoreBoardService;
import kr.co.iei.store.model.vo.StoreBoard;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store")
public class StoreBoardController {

    private final StoreBoardService storeBoardService;

    public StoreBoardController(StoreBoardService storeBoardService) {
        this.storeBoardService = storeBoardService;
    }

    @PostMapping("/boards")
    public ResponseEntity<Long> createStoreBoard(@RequestBody StoreBoard storeBoard) {
        Long marketNo = storeBoardService.createStoreBoard(storeBoard);
        return ResponseEntity.ok(marketNo);
    }

    @GetMapping("/boards")
    public ResponseEntity<List<StoreBoard>> getStoreBoardList() {
        return ResponseEntity.ok(storeBoardService.getStoreBoardList());
    }

    @GetMapping("/boards/{marketNo}")
    public ResponseEntity<StoreBoard> getStoreBoard(@PathVariable Long marketNo) {
        return ResponseEntity.ok(storeBoardService.getStoreBoard(marketNo));
    }
}