package kr.co.iei.admin.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.admin.model.dao.AdminDao;
import kr.co.iei.admin.model.vo.AdminLog;
import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.ListItem;
import kr.co.iei.admin.model.vo.ListResponse;
import kr.co.iei.admin.model.vo.Log;
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.admin.model.vo.ProcessReport;
import kr.co.iei.admin.model.vo.Qna;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.utils.FileUtils;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;

	@Autowired
	private FileUtils fileUtils;

	@Value("${file.root}")
	private String root;

	// ============================== 대시보드 ==============================

	// 대시보드 통계 데이터 조회
	public DashData getDashData() {
		DashData dashData = adminDao.getDashData();
		return dashData;
	}

	// ============================== 공지사항 ==============================

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

	// 공지사항 삭제
	@Transactional
	public int deleteNotice(Integer noticeNo) {
		int result = adminDao.deleteNotice(noticeNo);
		return result;
	}

	// ============================== FAQ ==============================

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

	// FAQ 삭제
	@Transactional
	public int deleteFaq(Integer faqNo) {
		int result = adminDao.deleteFaq(faqNo);
		return result;
	}

	// ============================== 1:1 문의 (QnA) ==============================

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
		int result = adminDao.qnaAnswer(qna);
		return result;
	}

	// ============================== 회원 관리 ==============================

	// 회원 목록 조회 - 필터 조건은 mapper에서 동적 쿼리로 처리
	public List<Member> selectMemberList(Integer status, Integer grade, String keyword) {
		List<Member> memberList = adminDao.selectMemberList(status, grade, keyword);
		return memberList;
	}

	// 회원이 작성한 댓글 목록 - 회원 상세 모달용
	public List<BoardComment> getCommentList(String memberId) {
		List<BoardComment> bcList = adminDao.getCommentList(memberId);
		return bcList;
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

	// 이상기록 카운트 - 최근 24시간 로그인 실패 / 위치변경 건수
	public Map<String, Object> getAnomalyCount(String memberId) {
		Map<String, Object> anomalyMap = adminDao.getAnomalyCount(memberId);
		return anomalyMap;
	}

	// 회원 정지 해제 - 해제 후 admin_log에 기록
	@Transactional
	public int releaseMember(ProcessReport pr) {
		if (pr.getMemberId() != null && pr.getTargetId() != null) {
			int releaseResult = adminDao.releaseMember(pr.getTargetId());
			if (releaseResult != 0) {
				pr.setLogAction("회원 정지 해제");
				int result = adminDao.insertAdminLog2(pr);
				if (result != 0) {
					return result;
				} else {
					return -1;
				}
			}
		}
		return -1;
	}

	// ============================== 게시글 모니터링 ==============================

	// 게시글 목록 조회 - 키워드/위험도/신고수 필터
	public List<Board> getBoardList(String keyword, String risk, String reportSort, String sort, String memberId) {
		List<Board> boardList = adminDao.getBoardList(keyword, risk, reportSort, sort, memberId);
		return boardList;
	}

	// ============================== 신고 처리 ==============================

	// 신고 처리 - 게시글/댓글 조치 + 회원 조치 + report_status 갱신 + admin_log 삽입
	// 하나라도 실패하면 런타임 예외 던져서 @Transactional로 전체 롤백
	@Transactional
	public int processReport(ProcessReport pr) {
		// logAction 결정 - 회원 조치가 있으면 회원조치 기준, 없으면 게시글/댓글 조치 기준
		String logAction;
		if (!pr.getMemberAction().equals("미처리")) {
			logAction = pr.getMemberAction().equals("경고 처리") ? "회원경고" : "회원정지";
		} else if ("comment".equals(pr.getTargetType()) && !"미처리".equals(pr.getCommentAction())) {
			logAction = "댓글조치";
		} else if ("board".equals(pr.getTargetType()) && !"미처리".equals(pr.getBoardAction())) {
			logAction = "게시글조치";
		} else {
			logAction = "조치없음";
		}
		pr.setLogAction(logAction);

		// 게시글 조치
		if ("board".equals(pr.getTargetType())
				&& pr.getBoardAction() != null
				&& !pr.getBoardAction().equals("미처리")) {
			int boardResult = adminDao.updateBoardStatus(pr);
			if (boardResult == 0) {
				throw new RuntimeException("게시글 조치 실패");
			}
		}

		// 댓글 조치
		if ("comment".equals(pr.getTargetType())
				&& pr.getCommentAction() != null
				&& !pr.getCommentAction().equals("미처리")) {
			int commentResult = adminDao.updateCommentStatus(pr);
			if (commentResult == 0) {
				throw new RuntimeException("댓글 조치 실패");
			}
		}

		// 회원 조치 - 경고는 상태 변경 없이 로그만 남기므로 여기서 제외
		if (!pr.getMemberAction().equals("미처리") && !pr.getMemberAction().equals("경고 처리")) {
			int memberResult = adminDao.updateMemberStatus(pr);
			if (memberResult == 0) {
				throw new RuntimeException("회원 조치 실패");
			}
		}

		// 신고 상태 처리완료로 변경
		int reportResult = adminDao.updateReportStatus(pr);
		if (reportResult == 0) {
			throw new RuntimeException("신고 처리 실패");
		}

		// admin_log 삽입 - 그룹(target_no + target_type) 내 모든 신고 건에 로그 기록
		int logResult = adminDao.insertAdminLog(pr);
		if (logResult == 0) {
			throw new RuntimeException("로그 저장 실패");
		}

		return 1;
	}

	// 처리완료된 신고의 admin_log 조회
	public AdminLog selectAdminLog(Integer reportNo) {
		AdminLog adminLog = adminDao.selectAdminLog(reportNo);
		return adminLog;
	}

	// ============================== 시스템 로그 ==============================

	// 시스템(관리자) 로그 목록 조회 - 키워드/조치유형/정렬 필터
	public List<AdminLog> getAdminLogList(String keyword, String action, String sort) {
		List<AdminLog> adminLogList = adminDao.getAdminLogList(keyword, action, sort);
		return adminLogList;
	}

}
