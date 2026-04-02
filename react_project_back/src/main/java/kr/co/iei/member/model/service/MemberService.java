package kr.co.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.vo.LoginMember;
import kr.co.iei.member.model.vo.Member;
import kr.co.iei.utils.JwtUtils;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;

	// 암호화 객체 선언
	@Autowired
	private BCryptPasswordEncoder bcrypt;

	// 토큰 방식 설정
	@Autowired
	private JwtUtils jwtUtils;

	@Transactional
	public int insertMember(Member member) {

		// 회원가입에서 비밀번호를 입력했을 떄 그 값을 암호화하는 과정
		// -> 이 과정에는 이미 salt과정이 포함되어 있음.
		String memberPw = member.getMemberPw();
		String encPw = bcrypt.encode(memberPw);
		System.out.println("암호화된 비밀번호: " + encPw);

		member.setMemberPw(encPw);

		int result = memberDao.insertMember(member);
		return result;
	}

	// 로그인 로직

	// 토큰 방식이 들어서면서 기존 loginUser에서 loginMember로 바뀜
	public LoginMember login(Member member) {
		// 비밀번호가 암호화로 바뀌는 순간 평문 형식의 비교는 할 수가 없음
		// 왜냐하면 단순히 1111이 아니고 온갖 특수문자가 섞이는 형태로 나오기 떄문.
		// 따라서 그냥 아이디 하나로 조회하여 해당 비밀번호를 호출
		Member loginMember = memberDao.selectOneMember(member.getMemberId());
		if (loginMember != null) {
			if (bcrypt.matches(member.getMemberPw(), loginMember.getMemberPw())) {
				LoginMember login = jwtUtils.createToken(loginMember.getMemberId(), loginMember.getMemberGrade(),
						loginMember.getMemberNickname());
				// 암호화된 비밀번호가 프론트로 가는 것을 방지 하기 위한 로직.
				// -> 따라서 응답에서 비밀번호 제거.
				// -> 외부 노출 방지 목적
				// -> null로 처리해도 걱정할 필요 없음
				// -> 이미 데이터베이스에 저장완료.
				loginMember.setMemberPw(null);

				return login;
			}
		}
		return null;
	}
}
