package kr.co.iei.admin.controller;

import java.io.File;
import java.util.List;

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
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.admin.model.vo.Qna;
import kr.co.iei.utils.FileUtils;

@RequestMapping(value="admins")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
public class AdminController {
	@Autowired
	private AdminService adminService;
	
	@Value("${file.root}")
	private String root;
	
	@Autowired
	private FileUtils fileUtils;
	
	
	
	@PostMapping(value="notice")
	public ResponseEntity<?> insertNotice(@ModelAttribute Notice notice, @RequestParam(value = "upfile", required = false) MultipartFile upfile) {
		if (upfile != null && !upfile.isEmpty()) {
			
			// 이미지 저장할 경로 
			File saveDir = new File(new File(root), "notice");
			
			// 폴더 없으면 만들어
			if (!saveDir.exists()) {
				saveDir.mkdir();
			}
			String fileName = fileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
			System.out.println("경로: " + saveDir.getAbsolutePath());
			notice.setNoticeImagePath("/notice/" + fileName);
		}
		int result = adminService.insertNotice(notice);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping
	public ResponseEntity<?> selectNoticeList() {
		List<Notice> noticeList = adminService.selectNoticeList();
		return ResponseEntity.ok(noticeList);
	}
	
	@PatchMapping(value="notice")
	public ResponseEntity<?> editNotice(@ModelAttribute Notice notice, @RequestParam(value = "upfile", required = false) MultipartFile upfile) {
	
		if (upfile != null && !upfile.isEmpty()) {
			File saveDir = new File(new File(root), "notice");
			if (!saveDir.exists()) {
				saveDir.mkdir();
			}
			String fileName = fileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
			notice.setNoticeImagePath("/notice/" + fileName);
		}
		
		int result = adminService.editNotice(notice);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="dashdata")
	public ResponseEntity<?> getDashData() {
		DashData dashData = adminService.getDashData();
		System.out.println(dashData);
		return ResponseEntity.ok(dashData);
	}
	
	@DeleteMapping(value="notice/{noticeNo}")
	public ResponseEntity<?> deleteNotice(@PathVariable Integer noticeNo) {
		int result = adminService.deleteNotice(noticeNo);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="faq")
	public ResponseEntity<?> selectFaqList() {
		List<Faq> faqList = adminService.selectFaqList();
		return ResponseEntity.ok(faqList);
	}
	
	@PostMapping(value="faq")
	public ResponseEntity<?> insertFaq(@RequestBody Faq faq) {
		System.out.println(faq);
		int result = adminService.insertFaq(faq);
		return ResponseEntity.ok(result);
	}
	
	@PatchMapping(value="faq")
	public ResponseEntity<?> editFaq(@RequestBody Faq faq) {
		int result = adminService.editFaq(faq);
		return ResponseEntity.ok(result);
	}
	
	@GetMapping(value="qna")
	public ResponseEntity<?> selectQnaList(@ModelAttribute ListItem listItem) {
		ListResponse response = adminService.selectQnaList(listItem);
		return ResponseEntity.ok(response);
	}
	
	@PatchMapping(value="qna")
	public ResponseEntity<?> qnaAnswer(@ModelAttribute Qna qna, @RequestParam(value="upfile", required = false) MultipartFile upfile) {
		if (upfile != null && !upfile.isEmpty()) {
			File saveDir = new File(new File(root), "qna");
			if (!saveDir.exists()) {
				saveDir.mkdir();
			}
			String fileName = fileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
			qna.setQnaAnswerImage("/qna/" + fileName);
		}
		int result = adminService.qnaAnswer(qna);
		return ResponseEntity.ok(result);
	}
}
