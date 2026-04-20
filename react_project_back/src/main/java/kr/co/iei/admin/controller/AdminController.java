package kr.co.iei.admin.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.admin.model.service.AdminService;
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

// 관리자 전용 REST 컨트롤러 - 기본 URL: /admins
// 대시보드 / 공지 / FAQ / QnA / 회원 / 게시글 / 신고 / 로그 담당
@RequestMapping(value="admins")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
public class AdminController {

	@Autowired
	private AdminService adminService;

	private final BCryptPasswordEncoder bcrypt;

	// 파일 업로드 루트 경로 - application.properties에서 가져옴
	@Value("${file.root}")
	private String root;

	AdminController(BCryptPasswordEncoder bcrypt) {
		this.bcrypt = bcrypt;
	}

	// ============================== 대시보드 ==============================

	// 대시보드 통계 데이터 조회 - 회원수/신고수/주간가입자 한 번에 다 가져옴
	@GetMapping(value="dashdata")
	public ResponseEntity<?> getDashData() {
		DashData dashData = adminService.getDashData();
		return ResponseEntity.ok(dashData);
	}

	// ============================== 공지사항 ==============================

	// 공지사항 등록 - 이미지 있으면 /notice 폴더에 저장 후 경로 set
	@PostMapping(value="notice")
	public ResponseEntity<?> insertNotice(@ModelAttribute Notice notice, @RequestParam(value = "upfile", required = false) MultipartFile upfile) {
		if (upfile != null && !upfile.isEmpty()) {
			// 이미지 저장할 경로
			File saveDir = new File(new File(root), "notice");
			// 폴더 없으면 만들어
			if (!saveDir.exists()) {
				saveDir.mkdir();
			}
			String fileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
			notice.setNoticeImagePath(fileName);
		}
		int result = adminService.insertNotice(notice);
		return ResponseEntity.ok(result);
	}

	// 공지사항 목록 조회 - 고정글 우선, 날짜 내림차순
	@GetMapping
	public ResponseEntity<?> selectNoticeList() {
		List<Notice> noticeList = adminService.selectNoticeList();
		return ResponseEntity.ok(noticeList);
	}

	// 공지사항 수정 - 새 이미지 있으면 경로 갱신, 없으면 기존 유지
	@PatchMapping(value="notice")
	public ResponseEntity<?> editNotice(@ModelAttribute Notice notice, @RequestParam(value = "upfile", required = false) MultipartFile upfile) {
		if (upfile != null && !upfile.isEmpty()) {
			File saveDir = new File(new File(root), "notice");
			if (!saveDir.exists()) {
				saveDir.mkdir();
			}
			String fileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
			notice.setNoticeImagePath(fileName);
		}
		int result = adminService.editNotice(notice);
		return ResponseEntity.ok(result);
	}

	// 공지사항 삭제
	@DeleteMapping(value="notice/{noticeNo}")
	public ResponseEntity<?> deleteNotice(@PathVariable Integer noticeNo) {
		int result = adminService.deleteNotice(noticeNo);
		return ResponseEntity.ok(result);
	}

	// ============================== FAQ ==============================

	// FAQ 목록 조회 전체
	@GetMapping(value="faq")
	public ResponseEntity<?> selectFaqList() {
		List<Faq> faqList = adminService.selectFaqList();
		return ResponseEntity.ok(faqList);
	}

	// FAQ 등록
	@PostMapping(value="faq")
	public ResponseEntity<?> insertFaq(@RequestBody Faq faq) {
		int result = adminService.insertFaq(faq);
		return ResponseEntity.ok(result);
	}

	// FAQ 수정
	@PatchMapping(value="faq")
	public ResponseEntity<?> editFaq(@RequestBody Faq faq) {
		int result = adminService.editFaq(faq);
		return ResponseEntity.ok(result);
	}

	// FAQ 삭제
	@DeleteMapping(value="faq/{faqNo}")
	public ResponseEntity<?> deleteFaq(@PathVariable Integer faqNo) {
		int result = adminService.deleteFaq(faqNo);
		return ResponseEntity.ok(result);
	}

	// ============================== 1:1 문의 (QnA) ==============================

	// 1:1 문의 목록 조회 - page/size 파라미터로 페이지네이션
	@GetMapping(value="qna")
	public ResponseEntity<?> selectQnaList(@ModelAttribute ListItem listItem) {
		ListResponse response = adminService.selectQnaList(listItem);
		return ResponseEntity.ok(response);
	}

	// 1:1 문의 답변 등록 - 이미지 있으면 /qna 폴더에 저장
	@PatchMapping(value="qna")
	public ResponseEntity<?> qnaAnswer(@ModelAttribute Qna qna, @RequestParam(value="upfile", required = false) MultipartFile upfile) {
		if (upfile != null && !upfile.isEmpty()) {
			File saveDir = new File(new File(root), "qna");
			if (!saveDir.exists()) {
				saveDir.mkdir();
			}
			String fileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
			qna.setQnaAnswerImage(fileName);
		}
		int result = adminService.qnaAnswer(qna);
		return ResponseEntity.ok(result);
	}

	// ============================== 회원 관리 ==============================

	// 승인 대기 캠페인 목록 조회
	@GetMapping(value="campaign")
	public ResponseEntity<?> selectPendingCampaignList() {
		List<Campaign> campaignList = adminService.selectPendingCampaignList();
		return ResponseEntity.ok(campaignList);
	}

	// 캠페인 승인 처리 - 승인대기(0) 캠페인을 승인완료(1)로 변경
	@PatchMapping(value="campaign/{campaignNo}/approve")
	public ResponseEntity<?> approveCampaign(@PathVariable Integer campaignNo) {
		int result = adminService.approveCampaign(campaignNo);
		return ResponseEntity.ok(result);
	}

	// 회원 목록 조회 - status/grade/keyword 필터 선택 적용 (null이면 전체)
	@GetMapping(value="member")
	public ResponseEntity<?> selectMemberList(@RequestParam(required = false) Integer status,
											  @RequestParam(required = false) Integer grade,
											  @RequestParam(required = false) String keyword) {
		List<Member> memberList = adminService.selectMemberList(status, grade, keyword);
		return ResponseEntity.ok(memberList);
	}

	// 회원이 작성한 댓글 목록 - 회원 상세 모달용
	@GetMapping(value="comment/{memberId}")
	public ResponseEntity<?> selectCommentList(@PathVariable String memberId) {
		List<BoardComment> bcList = adminService.getCommentList(memberId);
		return ResponseEntity.ok(bcList);
	}

	// 최근 로그 4개 조회 - 회원 상세 패널 미리보기용
	@GetMapping(value="recentLog/{memberId}")
	public ResponseEntity<?> getRecentLog(@PathVariable String memberId) {
		List<Log> recentLogList = adminService.getRecentLog(memberId);
		return ResponseEntity.ok(recentLogList);
	}

	// 전체 로그 조회 - 20개씩 페이지네이션, 모달 무한 스크롤용
	// page * 20 = offset 시작 row
	@GetMapping(value="log/{memberId}/{page}")
	public ResponseEntity<?> selectLogList(@PathVariable String memberId, @PathVariable Integer page,
										   @RequestParam(required = false) String action,
										   @RequestParam(required = false) Integer result,
										   @RequestParam(required = false, defaultValue = "DESC") String sort) {
		Integer start = page * 20;
		List<Log> logList = adminService.getLogList(memberId, start, action, result, sort);
		return ResponseEntity.ok(logList);
	}

	// 이상기록 카운트 - 최근 24시간 로그인 실패/위치변경
	@GetMapping(value="anomalyLog/{memberId}")
	public ResponseEntity<?> selectAnomalyCount(@PathVariable String memberId) {
		Map<String, Object> anomalyMap = adminService.getAnomalyCount(memberId);
		return ResponseEntity.ok(anomalyMap);
	}

	// 회원 정지 해제 - 신고센터 모달의 "정지 해제" 버튼
	@PostMapping(value="releaseMember")
	public ResponseEntity<?> releaseMember(@RequestBody ProcessReport pr) {
		int result = adminService.releaseMember(pr);
		return ResponseEntity.ok(result);
	}

	// ============================== 게시글 모니터링 ==============================

	// 게시글 목록 조회 - 키워드/위험도/신고수 필터 + 작성일 정렬
	@GetMapping(value="board")
	public ResponseEntity<?> selectBoardList(@RequestParam(required = false) String keyword,
											 @RequestParam(required = false) String risk,
											 @RequestParam(required = false) String reportSort,
											 @RequestParam(required = false, defaultValue = "desc") String sort,
											 @RequestParam(required = false) String memberId) {
		List<Board> boardList = adminService.getBoardList(keyword, risk, reportSort, sort, memberId);
		return ResponseEntity.ok(boardList);
	}

	// ============================== 신고 처리 ==============================

	// 신고 처리 - 게시글/댓글 조치 + 회원 조치 + admin_log 삽입 (트랜잭션)
	@PostMapping(value="processReport")
	public ResponseEntity<?> processReport(@RequestBody ProcessReport pr) {
		int result = adminService.processReport(pr);
		return ResponseEntity.ok(result);
	}

	// 처리완료된 신고의 admin_log 조회 - 모달에서 처리 내역 표시용
	@GetMapping(value="adminLog/{reportNo}")
	public ResponseEntity<?> selectAdminLog(@PathVariable Integer reportNo) {
		AdminLog adminLog = adminService.selectAdminLog(reportNo);
		return ResponseEntity.ok(adminLog);
	}

	// ============================== 시스템 로그 ==============================

	// 시스템(관리자) 로그 목록 조회 - 키워드/조치유형/정렬 필터
	@GetMapping(value="admin-log")
	public ResponseEntity<?> selectAdminLogList(@RequestParam(required = false) String keyword,
												@RequestParam(required = false) String action,
												@RequestParam(required = false, defaultValue = "desc") String sort) {
		List<AdminLog> adminLogList = adminService.getAdminLogList(keyword, action, sort);
		return ResponseEntity.ok(adminLogList);
	}
	
	// ============================== 엑셀 ==============================
	
	@GetMapping(value="members-excel")
	public ResponseEntity<byte[]> downloadMemberExcel() throws IOException {
		// 1. 엑셀 파일을 메모리에서 만들기 위한 Workbook 객체 생성 (XSSF = .xlsx)
		Workbook workbook = new XSSFWorkbook();
		// 2. 시트 하나 생성 (이름 회원목록)
		Sheet sheet = workbook.createSheet("회원목록");
		// 3) 헤더 행 생성 (첫 번째 줄)
		Row header = sheet.createRow(0);
		// 4) 헤더 칸 생성 + 텍스트 넣기
		header.createCell(0).setCellValue("아이디");
		header.createCell(1).setCellValue("이름");
		header.createCell(2).setCellValue("닉네임");
		header.createCell(3).setCellValue("이메일");
		header.createCell(4).setCellValue("가입일");
		header.createCell(5).setCellValue("정지상태");
		header.createCell(6).setCellValue("정지사유");
		
		header.createCell(7).setCellValue("등급");
		
		List<Member> memberList = adminService.selectMemberList(null, null, null);
		
		int rowNum = 1;
		for (Member m : memberList) {
			Row row = sheet.createRow(rowNum++);
			
			row.createCell(0).setCellValue(m.getMemberId());
			row.createCell(1).setCellValue(m.getMemberName());
			row.createCell(2).setCellValue(m.getMemberNickname());
			row.createCell(3).setCellValue(m.getMemberEmail());
			row.createCell(4).setCellValue(m.getEnrollDate());
			row.createCell(5).setCellValue(m.getMemberStatus());
			row.createCell(6).setCellValue(m.getLockReason());
			
			row.createCell(7).setCellValue(m.getMemberGrade());
		}
		
		for (int i = 0; i <= 7; i++) {
            sheet.autoSizeColumn(i); // 컬럼 너비 자동세팅
            int currentWidth = sheet.getColumnWidth(i);
            sheet.setColumnWidth(i, currentWidth + 1024); // 딱 맞는 상태에서 여유 조금 
        }
		
		// 5. 엑셀 내용을 메모리에 저장할 통로(스트림) 준비
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		// 6. 워크북 내용을 스트림에 씀 
		workbook.write(out);
		// 7. 워크북 닫아서 메모리 해제 
		workbook.close();
		// 8. 스트림에 담긴 내용을 바이트 배열로 변환 
		byte[] bytes = out.toByteArray();
				
		// 9. 응답 헤더 설정 (파일 다운로드)
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			    
		// 10. 반환 
		return ResponseEntity.ok().headers(headers).body(bytes);
		
	}
	
	@GetMapping(value="logs-excel/{memberId}")
	public ResponseEntity<byte[]> downloadLogExcel(@PathVariable String memberId) throws IOException {
		System.out.println(memberId);
		// 1. 엑셀 파일을 메모리에서 만들기 위한 Workbook 객체 생성 (XSSF = .xlsx)
		Workbook workbook = new XSSFWorkbook();
		// 2. 시트 하나 생성 (이름 게시글목록)
		Sheet sheet = workbook.createSheet("회원로그");
		// 3) 헤더 행 생성 (첫 번째 줄)
		Row header = sheet.createRow(0);
		// 4) 헤더 칸 생성 + 텍스트 넣기
		header.createCell(0).setCellValue("번호");
		header.createCell(1).setCellValue("아이디");
		header.createCell(2).setCellValue("ip");
		header.createCell(3).setCellValue("시간");
		header.createCell(4).setCellValue("유형");
		header.createCell(5).setCellValue("상세");
		header.createCell(6).setCellValue("접속 기기 | 브라우저");
		header.createCell(7).setCellValue("접속 위치");
		header.createCell(8).setCellValue("접속 결과");
		
		List<Log> logList = adminService.getLogExcel(memberId);
		System.out.println(logList);
		
		int rowNum = 1;
		for (Log l : logList) {
			Row row = sheet.createRow(rowNum++);
			
			row.createCell(0).setCellValue(l.getMemberLogNo());
			row.createCell(1).setCellValue(l.getMemberId());
			row.createCell(2).setCellValue(l.getLogIp());
			row.createCell(3).setCellValue(l.getLogTime());
			row.createCell(4).setCellValue(l.getLogAction());
			row.createCell(5).setCellValue(l.getLogDetail());
			row.createCell(6).setCellValue(l.getLogDevice());
			row.createCell(7).setCellValue(l.getLogLocation());
			row.createCell(8).setCellValue(l.getLogResult() == null ? 0 : l.getLogResult());
		}
		
		for (int i = 0; i <= 8; i++) {
            sheet.autoSizeColumn(i); // 컬럼 너비 자동세팅
            int currentWidth = sheet.getColumnWidth(i);
            sheet.setColumnWidth(i, currentWidth + 1024); // 딱 맞는 상태에서 여유 조금 
        }
		
		// 5. 엑셀 내용을 메모리에 저장할 통로(스트림) 준비
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		// 6. 워크북 내용을 스트림에 씀 
		workbook.write(out);
		// 7. 워크북 닫아서 메모리 해제 
		workbook.close();
		// 8. 스트림에 담긴 내용을 바이트 배열로 변환 
		byte[] bytes = out.toByteArray();
				
		// 9. 응답 헤더 설정 (파일 다운로드)
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);     
			    
		// 10. 반환 
		return ResponseEntity.ok().headers(headers).body(bytes);
		
	}
	
	@GetMapping(value="boards-excel")
	public ResponseEntity<byte[]> downloadBoardExcel() throws IOException {
		// 1. 엑셀 파일을 메모리에서 만들기 위한 Workbook 객체 생성 (XSSF = .xlsx)
		Workbook workbook = new XSSFWorkbook();
		// 2. 시트 하나 생성 (이름 게시글목록)
		Sheet sheet = workbook.createSheet("게시글목록");
		// 3) 헤더 행 생성 (첫 번째 줄)
		Row header = sheet.createRow(0);
		// 4) 헤더 칸 생성 + 텍스트 넣기
		header.createCell(0).setCellValue("글번호");
		header.createCell(1).setCellValue("작성자");
		header.createCell(2).setCellValue("닉네임");
		header.createCell(3).setCellValue("제목");
		header.createCell(4).setCellValue("내용");
		header.createCell(5).setCellValue("작성일");
		header.createCell(6).setCellValue("상태");
		
		List<Board> boardList = adminService.getBoardList(null, null, null, null, null);
		
		int rowNum = 1;
		for (Board b : boardList) {
			Row row = sheet.createRow(rowNum++);
			
			row.createCell(0).setCellValue(b.getBoardNo());
			row.createCell(1).setCellValue(b.getWriterId());
			row.createCell(2).setCellValue(b.getWriterNickname());
			row.createCell(3).setCellValue(b.getBoardTitle());
			row.createCell(4).setCellValue(b.getBoardContent());
			row.createCell(5).setCellValue(b.getBoardDate());
			row.createCell(6).setCellValue(b.getBoardStatus());
		}
		
		for (int i = 0; i <= 6; i++) {
            sheet.autoSizeColumn(i); // 컬럼 너비 자동세팅
            int currentWidth = sheet.getColumnWidth(i);
            sheet.setColumnWidth(i, currentWidth + 1024); // 딱 맞는 상태에서 여유 조금 
        }
		
		// 5. 엑셀 내용을 메모리에 저장할 통로(스트림) 준비
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		// 6. 워크북 내용을 스트림에 씀 
		workbook.write(out);
		// 7. 워크북 닫아서 메모리 해제 
		workbook.close();
		// 8. 스트림에 담긴 내용을 바이트 배열로 변환 
		byte[] bytes = out.toByteArray();
				
		// 9. 응답 헤더 설정 (파일 다운로드)
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=게시글목록.xlsx");
			    
		// 10. 반환 
		return ResponseEntity.ok().headers(headers).body(bytes);
	}
	
	@GetMapping(value="admins-excel")
	public ResponseEntity<byte[]> downloadAdminLogExcel() throws IOException {
		// 1. 엑셀 파일을 메모리에서 만들기 위한 Workbook 객체 생성 (XSSF = .xlsx)
		Workbook workbook = new XSSFWorkbook();
		// 2. 시트 하나 생성 (이름 게시글목록)
		Sheet sheet = workbook.createSheet("관리자로그");
		// 3) 헤더 행 생성 (첫 번째 줄)
		Row header = sheet.createRow(0);
		// 4) 헤더 칸 생성 + 텍스트 넣기
		header.createCell(0).setCellValue("번호");
		header.createCell(1).setCellValue("관리자");
		header.createCell(2).setCellValue("조치대상");
		header.createCell(3).setCellValue("조치결과");
		header.createCell(4).setCellValue("처리일");
		header.createCell(5).setCellValue("사유");
		header.createCell(6).setCellValue("신고번호");
		
		List<AdminLog> adminLogList = adminService.getAdminLogList(null, null, null);
		
		int rowNum = 1;
		for (AdminLog a : adminLogList) {
			Row row = sheet.createRow(rowNum++);
			
			row.createCell(0).setCellValue(a.getLogNo());
			row.createCell(1).setCellValue(a.getAdminId());
			row.createCell(2).setCellValue(a.getLogTargetId());
			row.createCell(3).setCellValue(a.getLogResult());
			row.createCell(4).setCellValue(a.getLogDate());
			row.createCell(5).setCellValue(a.getLogReason());
			row.createCell(6).setCellValue(a.getReportNo());
		}
		
		for (int i = 0; i <= 6; i++) {
            sheet.autoSizeColumn(i); // 컬럼 너비 자동세팅
            int currentWidth = sheet.getColumnWidth(i);
            sheet.setColumnWidth(i, currentWidth + 1024); // 딱 맞는 상태에서 여유 조금 
        }
		
		// 5. 엑셀 내용을 메모리에 저장할 통로(스트림) 준비
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		// 6. 워크북 내용을 스트림에 씀 
		workbook.write(out);
		// 7. 워크북 닫아서 메모리 해제 
		workbook.close();
		// 8. 스트림에 담긴 내용을 바이트 배열로 변환 
		byte[] bytes = out.toByteArray();
				
		// 9. 응답 헤더 설정 (파일 다운로드)
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			    
		// 10. 반환 
		return ResponseEntity.ok().headers(headers).body(bytes);
		
	}
	
	@PostMapping("/chat-bot")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> body) {
        List<Map<String, Object>> messages = (List<Map<String, Object>>) body.get("messages");
        Map<String, Object> reply = adminService.askGemini(messages);
        return ResponseEntity.ok(reply);
    }

	// AI 공지사항 초안 작성 - body: {topic}, 응답: {title, content}
	@PostMapping("/ai/notice-draft")
	public ResponseEntity<Map<String, String>> aiNoticeDraft(@RequestBody Map<String, String> body) {
		String topic = body.getOrDefault("topic", "");
		Map<String, String> draft = adminService.draftNotice(topic);
		return ResponseEntity.ok(draft);
	}

	// AI 신고 위반 판단 - body: {content, category, reason}, 응답: {analysis}
	@PostMapping("/ai/analyze-report")
	public ResponseEntity<Map<String, String>> aiAnalyzeReport(@RequestBody Map<String, String> body) {
		String content = body.getOrDefault("content", "");
		String category = body.getOrDefault("category", "");
		String reason = body.getOrDefault("reason", "");
		Map<String, String> result = adminService.analyzeReport(content, category, reason);
		return ResponseEntity.ok(result);
	}

	// AI 경고/정지 안내 메시지 초안 - body: {category, action, extra}, 응답: {text}
	@PostMapping("/ai/warning-draft")
	public ResponseEntity<Map<String, String>> aiWarningDraft(@RequestBody Map<String, String> body) {
		String category = body.getOrDefault("category", "");
		String action = body.getOrDefault("action", "");
		String extra = body.getOrDefault("extra", "");
		Map<String, String> result = adminService.draftWarning(category, action, extra);
		return ResponseEntity.ok(result);
	}

}
