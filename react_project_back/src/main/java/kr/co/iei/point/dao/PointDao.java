package kr.co.iei.point.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.region.model.vo.RegionContribution;

@Mapper
public interface PointDao {

	Integer selectTotalPoint(String memberId);

	List<RegionContribution> selectPointHistory(String memberId);

}
