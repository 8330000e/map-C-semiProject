package kr.co.iei.region.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.region.model.vo.Region;
import kr.co.iei.region.model.vo.RegionContribution;

@Mapper
public interface RegionDao {

    List<Region> selectRegionList();

    int increaseTreeExp(@Param("regionNo") int regionNo,
                        @Param("appliedPoint") int appliedPoint);

    int insertContribution(@Param("memberId") String memberId,
                           @Param("regionNo") int regionNo,
                           @Param("point") int point);

    int resetWeeklyTree();

	List<RegionContribution> selectRecentContributionList();
}