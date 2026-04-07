package kr.co.iei.support.contoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.support.model.service.SupportService;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RequestMapping(value="supports")
@RestController

public class SupportContoller {
	@Autowired
	private SupportService supportService;
	
	@GetMapping(value="faq")
	public ResponseEntity<?> selectFaqList(@RequestParam (required = false) String category) {
		List<Faq> faqList = supportService.selectFaqList(category);
		return ResponseEntity.ok(faqList);
	}
	
	@GetMapping(value="notice")
	public ResponseEntity<?> selectNoticeList() {
		List<Notice> noticeList = supportService.selectNoticeList();
		return ResponseEntity.ok(noticeList);
	}
	
}
