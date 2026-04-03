package kr.co.iei.store.model.service.impl;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.store.model.dao.StoreBoardDAO;
import kr.co.iei.store.model.service.StoreBoardService;
import kr.co.iei.store.model.vo.StoreBoard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StoreBoardServiceImpl implements StoreBoardService {

    private final BoardDao boardDAO;
    private final StoreBoardDAO storeBoardDAO;

    @Transactional
    @Override
    public Long createStoreBoard(Board board, StoreBoard storeBoard) {

        // 1. 게시글 저장
        boardDAO.insertBoard(board);

        // 2. store_board 연결
        storeBoard.setBoardNo(board.getBoardNo());

        // 3. 중고상품 저장
        storeBoardDAO.insertStoreBoard(storeBoard);

        return storeBoard.getMarketNo();
    }

    @Override
    public StoreBoard getStoreBoard(Long marketNo) {
        return storeBoardDAO.selectStoreBoard(marketNo);
    }
}