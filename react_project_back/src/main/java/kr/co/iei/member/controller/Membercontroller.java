package kr.co.iei.member.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.annotation.MultipartConfig;
import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "/members")
public class Membercontroller {
	@Autowired
	private MemberService memberService;
	@Autowired
	private FileUtils fileUtil;
	@Value("${file.root}")
	private String root;
	// 회원가입 로직
	@PostMapping
	public ResponseEntity<?> joinMember(@RequestBody Member member) {
		int result = memberService.insertMember(member);
		return ResponseEntity.ok(result);
	}

	// 로그인 로직
	@PostMapping(value = "/login")
	public ResponseEntity<?> loginMember(@RequestBody Member member) {

		Member loginUser = memberService.login(member);

		if (loginUser != null) {
			loginUser.setMemberPw(null);
			return ResponseEntity.ok(loginUser); // 로그인 성공
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 문제가 생기면 에러 404발생
		}

	}
	@PatchMapping(value="/{memberId}")
	private ResponseEntity<?> updateMemberInfo(@RequestBody Member form){
		int result = memberService.updateMemberInfo(form);
		return ResponseEntity.ok(result);
	}
	@GetMapping(value="/{memberId}")
	private ResponseEntity<?> getMemberInfo(@PathVariable String memberId){
		Member member = memberService.getOneMemberInfo(memberId);
		return ResponseEntity.ok(member);
	}
	@PostMapping(value="/checkauth")
	private ResponseEntity<?> changePw(@RequestBody Member member ){
		boolean result = memberService.checkPw(member);
		return ResponseEntity.ok(result);
	}
	@PatchMapping(value="/newpw")
	public ResponseEntity<?> updatePw(@RequestBody Member m){
		int result = memberService.updatePw(m);
		return ResponseEntity.ok(result);
	}
	
	
	}
	@GetMapping
	public ResponseEntity<?> selectMemberList() {
		List<Member> memberList = memberService.selectMemberList();
		return ResponseEntity.ok(memberList);
	}
	@PatchMapping(value="/{memberId}/thumb")
	public ResponseEntity<?> updateThumb(@PathVariable String memberId,@ModelAttribute MultipartFile file){
		String savepath = root + "member/";
		String memberThumb = fileUtil.upload(savepath, file);
		Member mem = new Member();
		mem.setMemberId(memberId);
		mem.setMemberThumb(memberThumb);
		int result = memberService.updateMemberThumb(mem);
		return ResponseEntity.ok(memberThumb);
	}

}