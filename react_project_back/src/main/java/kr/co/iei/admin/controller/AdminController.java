package kr.co.iei.admin.controller;

import java.io.File;
import kr.co.iei.member.model.vo.Member;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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

// 관리자 전용 REST 컨트롤러 - 기본 URL: /admins
// 공지사항, FAQ, QnA, 회원 관리, 로그 조회 담당
@RequestMapping(value="admins")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
public class AdminController {
	@Autowired
	private AdminService adminService;

	// 파일 업로드 루트 경로 - application.properties에서 가져옴
	@Value("${file.root}")
	private String root;



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
			System.out.println("경로: " + saveDir.getAbsolutePath());
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

	// 대시보드 통계 데이터 조회 - 회원수/신고수/주간가입자 한 번에 다 가져옴
	@GetMapping(value="dashdata")
	public ResponseEntity<?> getDashData() {
		DashData dashData = adminService.getDashData();
		System.out.println(dashData);
		return ResponseEntity.ok(dashData);
	}

	// 공지사항 삭제
	@DeleteMapping(value="notice/{noticeNo}")
	public ResponseEntity<?> deleteNotice(@PathVariable Integer noticeNo) {
		int result = adminService.deleteNotice(noticeNo);
		return ResponseEntity.ok(result);
	}

	// FAQ 목록 조회 전체
	@GetMapping(value="faq")
	public ResponseEntity<?> selectFaqList() {
		List<Faq> faqList = adminService.selectFaqList();
		return ResponseEntity.ok(faqList);
	}

	// FAQ 등록
	@PostMapping(value="faq")
	public ResponseEntity<?> insertFaq(@RequestBody Faq faq) {
		System.out.println(faq);
		int result = adminService.insertFaq(faq);
		return ResponseEntity.ok(result);
	}

	// FAQ 수정
	@PatchMapping(value="faq")
	public ResponseEntity<?> editFaq(@RequestBody Faq faq) {
		int result = adminService.editFaq(faq);
		return ResponseEntity.ok(result);
	}

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

	// 회원 목록 조회 - status/grade/keyword 필터 선택 적용 (null이면 전체)
	@GetMapping(value="member")
	public ResponseEntity<?> selectMemberList(@RequestParam(required = false) Integer status,
											  @RequestParam(required = false) Integer grade,
											  @RequestParam(required = false) String keyword
			) {
		List<Member> memberList = adminService.selectMemberList(status, grade, keyword);
		return ResponseEntity.ok(memberList);
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
										   @RequestParam(required = false, defaultValue = "DESC") String sort
			) {
		Integer start = page * 20;
		List<Log> logList = adminService.getLogList(memberId, start, action, result, sort);
		return ResponseEntity.ok(logList);
	}
	
	@GetMapping(value="anomalyLog/{memberId}")
	public ResponseEntity<?> selectAnomalyCount(@PathVariable String memberId) {
		Map<String, Object> anomalyMap = adminService.getAnomalyCount(memberId);
		System.out.println(anomalyMap);
		return ResponseEntity.ok(anomalyMap);
	}
	
	@GetMapping(value="board")
	public ResponseEntity<?> selectBoardList(@RequestParam(required = false) String keyword,
											 @RequestParam(required = false) String risk,
											 @RequestParam(required = false) String reportSort,
											 @RequestParam(required = false, defaultValue = "desc") String sort
			) {
		List<Board> boardList = adminService.getBoardList(keyword, risk, reportSort, sort);
		return ResponseEntity.ok(boardList);
	}
	
	@PostMapping(value="processReport")
	public ResponseEntity<?> processReport(@RequestBody ProcessReport pr) {
		int result = adminService.processReport(pr);
		return ResponseEntity.ok(result);
	}
	
	
	


}
