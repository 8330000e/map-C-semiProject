package kr.co.iei.support.contoller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.support.model.service.SupportService;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RequestMapping(value="supports")
@RestController

public class SupportContoller {
	@Autowired
	private SupportService supportService;
	
	
}
