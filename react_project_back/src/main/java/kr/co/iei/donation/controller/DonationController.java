package kr.co.iei.donation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import kr.co.iei.donation.model.service.DonationService;
import kr.co.iei.donation.model.vo.PointDonation;

@CrossOrigin("origins = \\\"http://localhost:5173\\\", allowCredentials = \\\"true\\\"")
@RestController
@RequestMapping(value = "/donations")
public class DonationController {
	@Autowired
	private DonationService donationService;
	
	@PostMapping(value = "/donate")
	public ResponseEntity<?> donate(@RequestBody PointDonation donation){
		System.out.println("기부 요청 데이터: " + donation);
		// 유저가 기부 포인트를 사용하는 로직 설정. 
		int result = donationService.userExecuteDonate(donation);
		
		//결과가 잘 들어와서 1이면 실행되게 하기
		if(result > 0) {
			
			return ResponseEntity.ok(result);
		}else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0);
		}
	}
}
