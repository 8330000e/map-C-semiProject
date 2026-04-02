package kr.co.iei.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.admin.model.service.AdminService;

@CrossOrigin(value="*")
@RequestMapping(value="admins")
@RestController
public class AdminController {
	@Autowired
	private AdminService adminService;
}
