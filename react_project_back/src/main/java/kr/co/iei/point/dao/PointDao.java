package kr.co.iei.point.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PointDao {

	Integer selectTotalPoint(String memberId);

}
