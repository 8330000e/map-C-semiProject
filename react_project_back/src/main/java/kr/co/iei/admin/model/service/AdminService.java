package kr.co.iei.admin.model.service;

import kr.co.iei.member.model.vo.Member;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.admin.model.dao.AdminDao;
import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.ListItem;
import kr.co.iei.admin.model.vo.ListResponse;
import kr.co.iei.admin.model.vo.Log;
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.admin.model.vo.ProcessReport;
import kr.co.iei.admin.model.vo.Qna;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.utils.FileUtils;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;

	@Autowired
	private FileUtils fileUtils;

	@Value("${file.root}")
	private String root;

	// 공지사항 등록 - DB 변경이라 트랜잭션 적용
	@Transactional
	public int insertNotice(Notice notice) {
		int result = adminDao.insertNotice(notice);
		return result;
	}

	// 공지사항 목록 조회 - 읽기 전용이라 트랜잭션 없음
	public List<Notice> selectNoticeList() {
		List<Notice> noticeList = adminDao.selectNoticeList();
		return noticeList;
	}

	// 공지사항 수정
	@Transactional
	public int editNotice(Notice notice) {
		int result = adminDao.editNotice(notice);
		return result;
	}

	// 대시보드 통계 데이터 조회
	public DashData getDashData() {
		DashData dashData = adminDao.getDashData();
		System.out.println(dashData);
		return dashData;
	}

	// 공지사항 삭제
	@Transactional
	public int deleteNotice(Integer noticeNo) {
		int result = adminDao.deleteNotice(noticeNo);
		return result;
	}

	// FAQ 목록 조회
	public List<Faq> selectFaqList() {
		List<Faq> faqList = adminDao.selectFaqList();
		return faqList;
	}

	// FAQ 등록
	@Transactional
	public int insertFaq(Faq faq) {
		int result = adminDao.insertFaq(faq);
		return result;
	}

	// FAQ 수정
	@Transactional
	public int editFaq(Faq faq) {
		int result = adminDao.editFaq(faq);
		return result;
	}

	// QnA 목록 조회 - 전체 건수로 totalPage 계산 후 ListResponse에 담아서 반환
	public ListResponse selectQnaList(ListItem listItem) {
		int totalCount = adminDao.getTotalCount();
		// 올림 처리 - 나머지 있으면 페이지 하나 더
		int totalPage = (int) Math.ceil((double) totalCount / listItem.getSize());

		List<Qna> qnaList = adminDao.selectQnaList(listItem);
		ListResponse response = new ListResponse(qnaList, totalPage);

		return response;
	}

	// 1:1 문의 답변 등록 - qna_status를 1(답변완료)로 변경
	@Transactional
	public int qnaAnswer(Qna qna) {
		return adminDao.qnaAnswer(qna);
	}

	// 회원 목록 조회 - 필터 조건은 mapper에서 동적 쿼리로 처리
	public List<Member> selectMemberList(Integer status, Integer grade, String keyword) {
		List<Member> memberList = adminDao.selectMemberList(status, grade, keyword);
		return memberList;
	}

	// 회원 최근 로그 4개 조회 - 상세 패널 미리보기용
	public List<Log> getRecentLog(String memberId) {
		List<Log> recentLogList = adminDao.getRecentLog(memberId);
		return recentLogList;
	}

	// 전체 로그 조회 - start(offset)부터 20개씩 가져옴
	public List<Log> getLogList(String memberId, Integer start, String action, Integer result, String sort) {
		// SQL injection 방지 - ASC/DESC만 허용
		if (!"ASC".equalsIgnoreCase(sort) && !"DESC".equalsIgnoreCase(sort)) {
			sort = "DESC";
		}
		List<Log> logList = adminDao.getLogList(memberId, start, action, result, sort.toUpperCase());
		return logList;
	}

	public Map<String, Object> getAnomalyCount(String memberId) {
		Map<String, Object> anomalyMap = adminDao.getAnomalyCount(memberId);
		return anomalyMap;
	}

	public List<Board> getBoardList(String keyword, String risk, String reportSort, String sort) {
		List<Board> boardList = adminDao.getBoardList(keyword, risk, reportSort, sort);
		return boardList;
	}

	@Transactional
	public int processReport(ProcessReport pr) {
		if (!pr.getBoardAction().equals("미처리")) {
			int boardResult = adminDao.updateBoardStatus(pr);
			if (boardResult == 0) {
				throw new RuntimeException("게시글 조치 실패");
			}
		}
		
		if (!pr.getMemberAction().equals("미처리") && !pr.getMemberAction().equals("경고 처리")) {
			int memberResult = adminDao.updateMemberStatus(pr);
				if (memberResult == 0) {
					throw new RuntimeException("회원 조치 실패");
				}
		}
		
		int reportResult = adminDao.updateReportStatus(pr);
			if (reportResult == 0) {
				throw new RuntimeException("신고 처리 실패");
		}
		
		int logResult = adminDao.insertAdminLog(pr);
			if (logResult == 0) {
				throw new RuntimeException("로그 저장 실패");
			}
		

		return 1;
	}

}
