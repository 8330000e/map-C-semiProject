package kr.co.iei.region.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.session.SqlSession;

import kr.co.iei.region.model.vo.Region;

@Mapper
public interface RegionDao {

	List<Region> selectRegionList();

	int increaseTreeExp(int regionNo, int point);

	int insertContribution(String memberId, int regionNo, int point);

	int resetWeeklyTree();

}
