package kr.co.iei.region.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.region.model.dao.RegionDao;
import kr.co.iei.region.model.vo.Region;

@Service
public class RegionService {

    @Autowired
    private RegionDao regionDao;
    
    @Autowired
    private MemberDao memberDao;

    public List<Region> selectRegionList() {
        return regionDao.selectRegionList();
    }

 
    @Transactional
    public int contributePoint(String memberId, int regionNo, int point) {

        // 1. 현재 포인트 조회
        int currentPoint = memberDao.selectMemberPoint(memberId);

        // ❗ 포인트 부족 방지
        if (currentPoint < point) {
            throw new RuntimeException("포인트 부족");
        }

        // 2. 회원 포인트 차감
        int result1 = memberDao.decreasePoint(memberId, point);

        // 3. 지역 경험치 증가
        int result2 = regionDao.increaseTreeExp(regionNo, point);

        // 4. 기여 기록 저장
        int result3 = regionDao.insertContribution(memberId, regionNo, point);

        // 5. 하나라도 실패하면 롤백
        if (result1 == 0 || result2 == 0 || result3 == 0) {
            throw new RuntimeException("DB 처리 실패");
        }

        return 1;
    }
}