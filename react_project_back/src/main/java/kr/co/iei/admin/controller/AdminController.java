package kr.co.iei.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.admin.model.service.AdminService;
import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.Notice;

@RequestMapping(value="admins")
@CrossOrigin(value="*")
@RestController
public class AdminController {
	@Autowired
	private AdminService adminService;
	
	@PostMapping(value="notice")
	public ResponseEntity<?> insertNotice(@RequestBody Notice notice) {
		int result = adminService.insertNotice(notice);
		
		return ResponseEntity.ok(result);
	}
	
	@GetMapping
	public ResponseEntity<?> selectNoticeList() {
		List<Notice> noticeList = adminService.selectNoticeList();
		return ResponseEntity.ok(noticeList);
	}
	
	@PatchMapping(value="notice")
	public ResponseEntity<?> editNotice(@RequestBody Notice notice) {
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
}
