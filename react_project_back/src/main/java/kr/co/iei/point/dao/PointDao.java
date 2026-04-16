package kr.co.iei.point.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.point.vo.PointHistory;

@Mapper
public interface PointDao {

	Integer selectTotalPoint(String memberId);

	List<PointHistory> selectPointHistory(String memberId);

}