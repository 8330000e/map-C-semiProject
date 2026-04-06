package kr.co.iei.store.model.service.impl;

import kr.co.iei.store.model.dao.StoreBoardDAO;
import kr.co.iei.store.model.service.StoreBoardService;
import kr.co.iei.store.model.vo.StoreBoard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreBoardServiceImpl implements StoreBoardService {

    private final StoreBoardDAO storeBoardDAO;

    @Transactional
    @Override
    public Long createStoreBoard(StoreBoard storeBoard) {
        if (storeBoard.getProductStatus() == null) {
            storeBoard.setProductStatus(0);
        }
        if (storeBoard.getMemberNickname() == null || storeBoard.getMemberNickname().isBlank()) {
            storeBoard.setMemberNickname(storeBoard.getMemberId());
        }

        // 1) BOARD_TBL 저장
        storeBoardDAO.insertBoardForStore(storeBoard);

        // 2) STORE_BOARD_TBL 저장
        storeBoardDAO.insertStoreBoard(storeBoard);

        return storeBoard.getMarketNo();
    }

    @Override
    public List<StoreBoard> getStoreBoardList() {
        return storeBoardDAO.selectStoreBoardList();
    }

    @Override
    public StoreBoard getStoreBoard(Long marketNo) {
        return storeBoardDAO.selectStoreBoard(marketNo);
    }
}