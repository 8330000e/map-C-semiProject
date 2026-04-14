package kr.co.iei.point.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



import kr.co.iei.point.service.PointService;
import kr.co.iei.region.model.vo.RegionContribution;

@CrossOrigin("origins = \"http://localhost:5173\", allowCredentials = \"true\"")
@RestController
//@RequestMapping(value = "/points")
public class PointController {
	@Autowired
	public PointService pointService;
	
	//memberId를 사용하여 memberPointTbl에서 포인트 데이터를 받아오기
	@GetMapping(value = "/point-give/{memberId}")
	public ResponseEntity<?> donationPointGive(@PathVariable String memberId){
		System.out.println("★연결 성공★ 요청받은 ID: " + memberId);
		
		Integer totalPoint = pointService.selectTotalPoint(memberId);
		return ResponseEntity.ok(totalPoint);
	}
	// 나무 키우기에 사용한 포인트 내역 조회
		@GetMapping(value = "/point-history/{memberId}")
		public ResponseEntity<?> selectPointHistory(@PathVariable String memberId){
			System.out.println("★포인트 내역 조회 요청★ ID : " + memberId);
			
			List<RegionContribution> historyList = pointService.selectPointHistory(memberId);
			return ResponseEntity.ok(historyList);
		}
	
}
