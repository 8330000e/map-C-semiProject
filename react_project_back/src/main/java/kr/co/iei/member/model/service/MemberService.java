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

	// 회원가입
	@Transactional
	public int insertMember(Member member) {
		String memberPw = member.getMemberPw();
		String encPw = bcrypt.encode(memberPw);

		member.setMemberPw(encPw);

		int result = memberDao.insertMember(member);
		return result;
	}

	// 로그인
	public Member login(Member member) {
		Member loginUser = memberDao.selectOneMember(member.getMemberId());

		if (loginUser != null && bcrypt.matches(member.getMemberPw(), loginUser.getMemberPw())) {
			loginUser.setMemberPw(null);
			return loginUser;
		}

		return null;
	}

	// 회원 1명 조회
	public Member getOneMemberInfo(String memberId) {
		Member member = memberDao.getOneMemberInfo(memberId);
		return member;
	}

	public List<Member> selectMemberList() {
		List<Member> memberList = memberDao.selectMemberList();
		return memberList;
	}

//	@Transactional
//	public int updateMemberInfo(Member form) {
//		int result = memberDao.updateMemberInfo(form);
//		return result;
//	}

	public boolean checkPw(Member member) {
		String memberId = member.getMemberId();
		Member forCheck = memberDao.memberPw(memberId);

		if (forCheck == null || forCheck.getMemberPw() == null) {
			return false;
		}

		boolean result = bcrypt.matches(member.getMemberPw(), forCheck.getMemberPw());
		return result;
	}

	// 비밀번호 변경
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