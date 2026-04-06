package kr.co.iei.store.model.service;

import kr.co.iei.store.model.vo.StoreBoard;

import java.util.List;

public interface StoreBoardService {

    Long createStoreBoard(StoreBoard storeBoard);

    List<StoreBoard> getStoreBoardList();

    StoreBoard getStoreBoard(Long marketNo);
}