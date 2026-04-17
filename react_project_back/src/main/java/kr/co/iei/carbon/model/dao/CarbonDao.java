package kr.co.iei.carbon.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.carbon.model.vo.CarbonHistory;

@Mapper
public interface CarbonDao {
    // MyBatis가 SQL을 실행할 때 ctpv, sgg 파라미터를 넘겨주는 메서드임.
    // 이 메서드는 선택된 지역의 현재 배출량을 조회함.
    Double selectRegionEmission(@Param("ctpv") String ctpv, @Param("sgg") String sgg);

    // 한국 전체 지역의 총 배출량을 조회하는 메서드임.
    Double selectTotalEmission();

    // 선택된 지역의 월별 탄소 배출 이력 데이터를 조회하는 메서드임.
    // 프론트엔드에서 차트에 쓸 데이터로 사용됨.
    List<CarbonHistory> selectRegionEmissionHistory(@Param("ctpv") String ctpv, @Param("sgg") String sgg);
}
