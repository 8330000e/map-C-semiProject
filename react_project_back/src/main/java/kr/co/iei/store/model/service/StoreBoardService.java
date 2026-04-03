package kr.co.iei.store.model.service;

import kr.co.iei.board.model.vo.Board;
import kr.co.iei.store.model.vo.StoreBoard;

public interface StoreBoardService {

    Long createStoreBoard(Board board, StoreBoard storeBoard);

    StoreBoard getStoreBoard(Long marketNo);
}