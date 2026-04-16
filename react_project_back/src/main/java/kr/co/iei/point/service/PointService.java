package kr.co.iei.point.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.point.dao.PointDao;
import kr.co.iei.point.vo.PointHistory;
import kr.co.iei.region.model.vo.RegionContribution;

@Service
public class PointService {
	@Autowired
	public PointDao pointDao;

	public int selectTotalPoint(String memberId) {
		//데이터베이스에서 값을 가져올 때 객체 타입인 Integer로 받기
		//-> 그 이유는 Integer은 null을 허용할 수 있음. 
		// 1. 요청이 들어왔는지 확인
	    System.out.println("컨트롤러로부터 넘어온 ID: [" + memberId + "]");
		Integer totalPoint = pointDao.selectTotalPoint(memberId);
		//만약 데이터가 없어서 null일 경우 0을 반환하라는 로직
		//여기에는 int가 없지만 자동으로 형변환 되서 나감. 
		// 2. DB가 준 값이 뭔지 확인
	    System.out.println("DB 조회 결과 포인트: " + totalPoint);
		return (totalPoint != null) ? totalPoint:0;
	}

	public List<PointHistory> selectPointHistory(String memberId) {
		return pointDao.selectPointHistory(memberId);
	}
}
