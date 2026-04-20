package kr.co.iei.region.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.region.model.dao.RegionDao;
import kr.co.iei.region.model.vo.Region;
import kr.co.iei.region.model.vo.RegionContribution;

@Service
public class RegionService {

    @Autowired
    private RegionDao regionDao;
    
    @Autowired
    private MemberDao memberDao;
    
	@Autowired
	private MemberService memberService;

    public List<Region> selectRegionList() {
        return regionDao.selectRegionList();
    }

 
    @Transactional
    public int contributePoint(String memberId, int regionNo, int point) {

        int currentPoint = memberDao.selectMemberPoint(memberId);

        if (currentPoint < point) {
            throw new RuntimeException("포인트 부족");
        }

        double multiplier = getRegionMultiplier(regionNo);
        int appliedPoint = (int)Math.round(point * multiplier);

        int result1 = memberDao.decreasePoint(memberId, point);
        int result2 = regionDao.increaseTreeExp(regionNo, appliedPoint);
        int result3 = regionDao.insertContribution(memberId, regionNo, point);

        if (result1 == 0 || result2 == 0 || result3 == 0) {
            throw new RuntimeException("DB 처리 실패");
        }
        memberService.insertPointHistory(memberId, -point, "USE", "나무 물주기");

        return 1;
    }

    private double getRegionMultiplier(int regionNo) {
        switch (regionNo) {
            case 2: return 1.2; // 서울
            case 3: return 1.0; // 경기
            case 4: return 2.1; // 인천
            case 5: return 3.0; // 강원
            case 6: return 1.6; // 충청
            case 7: return 1.7; // 전라
            case 8: return 1.1; // 경상
            case 9: return 3.0; // 제주
            default: return 1.0;
        }
    }
    @Transactional
    public int resetWeeklyTree() {
        return regionDao.resetWeeklyTree();
    }


    public List<RegionContribution> selectRecentContributionList() {
        return regionDao.selectRecentContributionList();
    }
}