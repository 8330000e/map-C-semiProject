package kr.co.iei.store.model.dao;

import kr.co.iei.store.model.vo.StoreBoard;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StoreBoardDAO {

    int insertBoardForStore(StoreBoard vo);

    int insertStoreBoard(StoreBoard vo);

    java.util.List<StoreBoard> selectStoreBoardList();

    StoreBoard selectStoreBoard(Long marketNo);
}