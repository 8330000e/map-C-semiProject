package kr.co.iei.member.controller;

import java.util.Map;
import java.util.Random;

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
import kr.co.iei.utils.EmailSender;
import lombok.Getter;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "/members")

public class Membercontroller {

	@Autowired
	private MemberService memberService;

	@Autowired
	private EmailSender emailSender;

	// 회원가입 로직
	@PostMapping
	public ResponseEntity<?> joinMember(@RequestBody Member member) {
		int result = memberService.insertMember(member);
		return ResponseEntity.ok(result);
	}

	@PostMapping(value = "/email-verification")
	public ResponseEntity<?> sendMail(@RequestBody Member m) {

		// 인증제목 메일 생성
		String emailTitle = "탄소커넥트 인증 메일입니다.";
		// 인증메일용 인증 코드 생성(random활용)
		Random r = new Random();
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < 6; i++) {
			// 영어 대문자, 소문자, 숫자 조합해서 6자리 랜덤코드 생성
			// 숫자(0-9):r.nextInt(10)
			// 대문자(A-Z): r.nextInt(26)+65
			// 소문자(a-z):r.nextInt(26)+97
			int fleg = r.nextInt(3);// 0.1.2 -> 숫자 대문자 소문자 어떤걸 추출할지 랜덤으로 결정
			if (fleg == 0) {
				int randomCode = r.nextInt(10);
				sb.append(randomCode);

			} else if (fleg == 1) {
				char randomCode = (char) (r.nextInt(26) + 65);
				sb.append(randomCode);
			} else if (fleg == 2) {
				char randomCode = (char) (r.nextInt(26) + 97);
				sb.append(randomCode);
			}
		}
		String authCode = sb.toString();
		String emailContent = "<h1>인증 번호를 확인하세요</h1>" + "<h3>인증번호는 " + "[<b>" + authCode + "</b>] 입니다. </h3>";
		emailSender.sendMail(emailTitle, m.getMemberEmail(), emailContent);
		return ResponseEntity.ok(authCode);
	}

	// 로그인 로직
	@PostMapping(value = "/login")
	public ResponseEntity<?> loginMember(@RequestBody Member member) {

		// 경로 설정 잘하기
		// package kr.co.iei.member.model.vo;
		LoginMember loginUser = memberService.login(member);

		if (loginUser != null) {

			return ResponseEntity.ok(loginUser); // 로그인 성공
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다."); // 문제가 생기면 에러 404발생
		}

	}

	// 아이디 찾기 설정
	@PostMapping(value = "/find-id")
	public ResponseEntity<?> findId(@RequestBody Member member) {
		// 아이디 하나로 회원 전체 정보를 가져오는게 아니기떄문에
		// 여기서는 이메일 인증을 통해 아이디 하나만을 조회하는 것이기 떄문에
		// String memberId로 처리
		String memberId = memberService.findIdByEmail(member.getMemberEmail());

		if (memberId != null) {
			String title = "아이디 찾기 결과";
			String content = "<h3>회원님의 아이디는 </h3><h2>" + memberId + "</h2>입니다.";

			emailSender.sendMail(title, member.getMemberEmail(), content);

			// 이메일로 아이디를 보냈기 떄문에 굳이 프런트에 아이디를 줄 필요없음
			// 따라서 리턴할 값을 주지않고 공백처리 해도됨.
			return ResponseEntity.ok(Map.of("message", "이메일로 아이디를 전송했습니다."

			));

		} else {
			return ResponseEntity.status(404).body("아이디를 찾을 수 없습니다.");
		}
	}

}
