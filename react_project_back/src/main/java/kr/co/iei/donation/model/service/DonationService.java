package kr.co.iei.donation.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.donation.model.dao.DonationDao;
import kr.co.iei.donation.model.vo.PointDonation;

@Service
public class DonationService {
	@Autowired
	private DonationDao donationDao;

	@Transactional // 차감하다가 문제 생기면 다 취소해야 함으로 설정, 한마디로 롤백 설정
	public int userExecuteDonate(PointDonation donation) {
		System.out.println("기부 요청 데이터: " + donation); // 1. 데이터가 잘 들어왔나?

		// 1. 환산 금액 세팅 (10P -> 1000원 계산)
		// donation에 있는 포인트를 끄집어 와서 돈으로 환산하는 로직

		int cashAmount = donation.getDonationPoint() * 100;
		donation.setDonationCash(cashAmount);
		// 2. 유저 포인트 차감 실행 (Update)
		int userResult = donationDao.updateMemberPoint(donation);
		System.out.println("포인트 차감 결과: " + userResult); // 2. 차감이 됐나? (1이면 성공)

		// 3. 단체 누적 포인트 증가
		// donation 객체 안의 groupId와 donationPoint를 활용

		int groupResult = donationDao.updateGroupTotalPoint(donation);
		System.out.println("단체 포인트 증가 결과: " + groupResult );
		
		
		//4. 기부 내역 남기기  (POINT_DONATION 테이블에 영수증 남기기)
		int pointRecordResult = donationDao.insertPointRecordResult(donation);
		
		
		return (userResult > 0 && groupResult > 0 && pointRecordResult > 0 ? 1 : 0);
	}
}
