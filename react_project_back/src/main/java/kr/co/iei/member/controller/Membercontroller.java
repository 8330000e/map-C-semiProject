package kr.co.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;
import lombok.Getter;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "/members")

public class Membercontroller {

	
	@Autowired
	private MemberService memberService;

	// 회원가입 로직
	@PostMapping
	public ResponseEntity<?> joinMember(@RequestBody Member member) {
		int result = memberService.insertMember(member);
		return ResponseEntity.ok(result);
	}

	// 로그인 로직
	@PostMapping(value = "/login")
	public ResponseEntity<?> loginMember(@RequestBody Member member) {
		
		//경로 설정 잘하기 
		//package kr.co.iei.member.model.vo;
		LoginMember loginUser = memberService.login(member);

		if (loginUser != null) {
			
			return ResponseEntity.ok(loginUser); // 로그인 성공
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다."); // 문제가 생기면 에러 404발생
		}

	}

}
