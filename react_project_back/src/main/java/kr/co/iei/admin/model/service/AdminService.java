package kr.co.iei.admin.model.service;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;



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
import kr.co.iei.campaign.model.vo.Campaign;
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
	
	 @Value("${gemini.api.key}")                           
     private String apiKey;
	 
	 @Value("${gemini.api.url}")               
     private String apiUrl;   

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

	// 승인 대기 캠페인 목록 조회
	public List<Campaign> selectPendingCampaignList() {
		List<Campaign> campaignList = adminDao.selectPendingCampaignList();
		return campaignList;
	}

	// 캠페인 승인 처리
	@Transactional
	public int approveCampaign(Integer campaignNo) {
		int result = adminDao.approveCampaign(campaignNo);
		return result;
	}

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

	public List<Log> getLogExcel(String memberId) {
		List<Log> logList = adminDao.getLogExcel(memberId);
		return logList;
	}
	
	@Transactional
	public Map<String, Object> askGemini(List<Map<String, Object>> messages) {
		RestTemplate restTemplate = new RestTemplate();

		System.out.println("apiKey: " + apiKey);
        System.out.println("apiUrl: " + apiUrl);

        // 시스템 프롬프트 - 챗봇 성격 지정
        Map<String, Object> systemInstruction = Map.of(
            "parts", List.of(Map.of(
                "text", "너는 탄소커넥트 관리자 도우미다. 회원/게시글/신고 관련 질문에 한국어로 간결히 답해라."
            ))
        );

        // Gemini 요청 바디 조립
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("systemInstruction", systemInstruction);
        requestBody.put("contents", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // Gemini 호출
        String url = apiUrl + "?key=" + apiKey;
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        // 응답에서 content 객체만 꺼내서 리턴 (프론트 messages에 그대로 push 가능한 형태)
        Map<String, Object> responseBody = response.getBody();
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");

        return content; // { role: "model", parts: [{ text: "..." }] }


	}

	// Gemini 단발 호출 헬퍼 - 시스템 프롬프트 + 유저 프롬프트 받아서 답변 텍스트만 리턴
	private String callGeminiOnce(String systemPrompt, String userPrompt) {
		RestTemplate restTemplate = new RestTemplate();

		Map<String, Object> systemInstruction = Map.of(
			"parts", List.of(Map.of("text", systemPrompt))
		);

		// Gemini contents 포맷: [{role:"user", parts:[{text:...}]}]
		List<Map<String, Object>> contents = List.of(Map.of(
			"role", "user",
			"parts", List.of(Map.of("text", userPrompt))
		));

		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("systemInstruction", systemInstruction);
		requestBody.put("contents", contents);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

		String url = apiUrl + "?key=" + apiKey;
		ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

		Map<String, Object> responseBody = response.getBody();
		List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
		Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
		List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
		return (String) parts.get(0).get("text");
	}

	// 공지사항 제목/본문 초안 생성
	// 응답에서 첫 "제목:" 줄은 title, 그 뒤 본문은 content로 분리
	public Map<String, String> draftNotice(String topic) {
		String systemPrompt = "너는 탄소커넥트 서비스의 관리자다. 회원 공지사항을 작성한다. 반드시 아래 형식만 지켜 출력하라.\n"
			+ "제목: [공지 제목 한 줄]\n"
			+ "[본문을 2~4문단, 공손하고 명료한 어투로 작성. 마크다운/이모지 금지]\n"
			+ "불필요한 머리말, 설명, 안내 문구는 절대 넣지 말 것.";
		String userPrompt = "다음 주제로 공지사항 초안을 작성해줘: " + topic;

		String raw = callGeminiOnce(systemPrompt, userPrompt);

		// "제목:" 시작 라인 찾아서 분리
		String title = "";
		String content = raw.trim();
		String[] lines = content.split("\n", 2);
		if (lines.length >= 1 && lines[0].startsWith("제목:")) {
			title = lines[0].substring("제목:".length()).trim();
			content = lines.length > 1 ? lines[1].trim() : "";
		}

		Map<String, String> result = new HashMap<>();
		result.put("title", title);
		result.put("content", content);
		return result;
	}

	// 신고 게시글 위반 여부 판단
	public Map<String, String> analyzeReport(String boardContent, String category, String reason) {
		String systemPrompt = "너는 탄소커넥트 서비스의 관리자 운영 도우미다. 신고된 게시글의 이용약관/커뮤니티 가이드라인 위반 여부를 판단한다.\n"
			+ "스팸/광고, 욕설/비방, 허위정보, 부적절한 컨텐츠 관점에서 간결히 분석하라.\n"
			+ "반드시 아래 형식으로 한국어 답변:\n"
			+ "판단: [위반 / 경계 / 정상 중 택1]\n"
			+ "근거: [2~3문장 간결하게]\n"
			+ "권고 조치: [비공개/삭제/경고/정지/조치없음 중 택1 + 이유 한 줄]";
		String userPrompt = "신고 카테고리: " + category + "\n"
			+ "신고 사유: " + reason + "\n"
			+ "대상 게시글 내용:\n" + boardContent;

		String analysis = callGeminiOnce(systemPrompt, userPrompt);

		Map<String, String> result = new HashMap<>();
		result.put("analysis", analysis);
		return result;
	}

	// 회원에게 보낼 경고/정지 메시지 초안 생성
	public Map<String, String> draftWarning(String category, String action, String extra) {
		String systemPrompt = "너는 탄소커넥트 서비스의 관리자다. 제재 받는 회원에게 보낼 안내 메시지를 작성한다.\n"
			+ "공손하지만 단호한 톤, 4~6줄 이내, 한국어로만 작성.\n"
			+ "위반 행위 → 조치 내용 → 재발 방지 당부 순서로 구성.\n"
			+ "머리말/서명/마크다운 없이 본문만 출력.";
		String userPrompt = "위반 카테고리: " + category + "\n"
			+ "조치: " + action + "\n"
			+ "참고 사유: " + (extra == null ? "" : extra);

		String text = callGeminiOnce(systemPrompt, userPrompt);

		Map<String, String> result = new HashMap<>();
		result.put("text", text.trim());
		return result;
	}

}
