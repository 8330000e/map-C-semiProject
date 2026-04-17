package kr.co.iei.carbon.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.iei.carbon.model.dao.CarbonDao;
import kr.co.iei.carbon.model.vo.CarbonHistory;

@Service
public class CarbonService {

    private final CarbonDao carbonDao;

    public CarbonService(CarbonDao carbonDao) {
        this.carbonDao = carbonDao;
    }

    // DAO를 호출하여 선택된 지역의 최신 탄소 배출량을 가져오는 서비스 메서드임.
    // 지역 정보가 없거나 결과가 없으면 0.0을 반환해서 화면에 표시할 값이 항상 존재하게 함.
    public double selectRegionEmission(String ctpv, String sgg) {
        Double emission = carbonDao.selectRegionEmission(ctpv, sgg);
        return emission == null ? 0.0 : emission;
    }

    // DAO를 호출하여 한국 전체 지역의 총 탄소 배출량을 가져오는 서비스 메서드임.
    public double selectTotalEmission() {
        Double emission = carbonDao.selectTotalEmission();
        return emission == null ? 0.0 : emission;
    }

    // DAO를 호출하여 선택된 지역의 월별 탄소 배출량 이력 데이터를 가져오는 서비스 메서드임.
    // 프론트엔드에서는 이 데이터를 받아서 월별 차트를 그리는 데 사용함.
    public List<CarbonHistory> selectRegionEmissionHistory(String ctpv, String sgg) {
        List<CarbonHistory> history = carbonDao.selectRegionEmissionHistory(ctpv, sgg);
        return history == null ? List.of() : history;
    }
}
