package kr.co.iei.member.model.service;

import java.util.List;

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

	
	@Autowired
	private JwtUtils jwtUtils;
	

	@Transactional
	public int insertMember(Member member) {
		String memberPw = member.getMemberPw();
		String encPw = bcrypt.encode(memberPw);

		member.setMemberPw(encPw);

		int result = memberDao.insertMember(member);
		return result;
	}



	
		//로그인 로직 
		public LoginMember login(Member member) {
			Member loginMember = memberDao.selectOneMember(member.getMemberId());
			if (loginMember != null) {
				if (bcrypt.matches(member.getMemberPw(), loginMember.getMemberPw())) {
					try {
						LoginMember login = jwtUtils.createToken(loginMember.getMemberId(), loginMember.getMemberGrade(), loginMember.getMemberNickname());
						//암호화된 비밀번호가 프론트로 가는 것을 방지 하기 위한 로직.
						loginMember.setMemberPw(null);
						return login;
					} catch (Exception e) {
						systemErr(e, "JWT 토큰 생성 오류");
						throw e;
					}
				}
			}
			return null;
		}

		// 예외 로깅 메서드 추가
		private void systemErr(Exception e, String msg) {
			System.err.println(msg);
			e.printStackTrace();
		}
		/*
		//이메일 인증을 통한 아이디 찾기 
		if (loginUser != null && bcrypt.matches(member.getMemberPw(), loginUser.getMemberPw())) {
			loginUser.setMemberPw(null);
			return loginUser;
		}

		return null;
	}
	*/

	// 회원 1명 조회
	public Member getOneMemberInfo(String memberId) {
		Member member = memberDao.getOneMemberInfo(memberId);
		return member;
	}

		public String findIdByEmail(String memberEmail) {
			String memberId = memberDao.findIdByEmail(memberEmail);
			return memberId;
		}

		// 아이디 중복 체크 설정
		public Member selectOneMember(String memberId) {
			Member m = memberDao.selectOneMember(memberId);
			return m;
		}

		//boolean이기 떄문에 return도 !형식으로 줘야함.
		//비밀번호 찾기를 위한 아이디 검증 및 이메일 인증 신청 로직
		public boolean existsByIdAndEmail(String memberId, String memberEmail) {
			Integer result = memberDao.existsByIdAndEmail(memberId,memberEmail);
			return result > 0;
		}
		

		public List<Member> selectMemberList() {
			List<Member> memberList = memberDao.selectMemberList();
			return memberList;
		}

		

		public boolean checkPw(Member member) {
			String memberId = member.getMemberId();
			Member forCheck = memberDao.memberPw(memberId);
		//		System.out.println(forCheck.getMemberPw());
		//		System.out.println(member.getMemberPw());
			boolean result=bcrypt.matches(member.getMemberPw(), forCheck.getMemberPw());
			return result;
		}

		@Transactional
		public int updatePw(Member m) {
			String newMemberPw = m.getMemberPw();
			String encodedNewMemberPw = bcrypt.encode(newMemberPw);
			m.setMemberPw(encodedNewMemberPw);
			int result = memberDao.updatePw(m);
			return result;
		}


	

	// 회원정보 수정
	@Transactional
	public int updateMemberInfo(Member member) {
		int result = memberDao.updateMemberInfo(member);
		return result;
	}

	// 프로필 이미지 수정
	@Transactional
	public int updateMemberThumb(Member mem) {
		int result = memberDao.updateMemberThumb(mem);
		return result;
	}

	public int selectMemberPoint(String memberId) {
		return memberDao.selectMemberPoint(memberId);
	}


}


	


	
		

	
