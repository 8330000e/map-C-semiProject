package kr.co.iei.store.model.dao;

import kr.co.iei.store.model.vo.StoreBoard;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StoreBoardDAO {

    int insertStoreBoard(StoreBoard vo);

    StoreBoard selectStoreBoard(Long marketNo);
}