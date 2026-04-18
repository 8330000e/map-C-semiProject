package kr.co.iei.carbon.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.carbon.model.service.CarbonService;
import kr.co.iei.carbon.model.vo.CarbonHistory;

@RestController
@RequestMapping("/carbon")
public class CarbonController {

    private final CarbonService carbonService;

    // 이 컨트롤러는 탄소 배출량 관련 API를 노출함.
    // 프론트엔드에서 요청받은 지역명(ctpv, sgg)을 서비스로 전달해서 결과를 응답함.
    public CarbonController(CarbonService carbonService) {
        this.carbonService = carbonService;
    }

    @GetMapping("/region")
    public ResponseEntity<Double> getRegionEmission(
            @RequestParam String ctpv,
            @RequestParam String sgg) {
        // 프론트엔드에서 전달된 지역명을 서비스에 전달하여 실제 탄소 배출량을 조회함.
        double emission = carbonService.selectRegionEmission(ctpv, sgg);
        return ResponseEntity.ok(emission);
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotalEmission() {
        // 한국 전체 지역의 탄소 배출량을 조회하여 반환함.
        double emission = carbonService.selectTotalEmission();
        return ResponseEntity.ok(emission);
    }

    @GetMapping("/region/history")
    public ResponseEntity<List<CarbonHistory>> getRegionEmissionHistory(
            @RequestParam String ctpv,
            @RequestParam String sgg) {
        // 선택된 지역의 월별 탄소 배출 이력을 조회하는 API임.
        // 프론트엔드는 이 결과를 받아서 차트로 보여줌.
        List<CarbonHistory> history = carbonService.selectRegionEmissionHistory(ctpv, sgg);
        return ResponseEntity.ok(history);
    }
}
