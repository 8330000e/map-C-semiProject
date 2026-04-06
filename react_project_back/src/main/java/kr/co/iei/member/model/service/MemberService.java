package kr.co.iei.member.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.vo.Member;

@Service
public class MemberService {

	@Autowired
	private MemberDao memberDao;

	@Autowired
	private BCryptPasswordEncoder bcrypt;

	@Transactional
	public int insertMember(Member member) {
		// 회원가입 비밀번호 암호화
		String memberPw = member.getMemberPw();
		String encPw = bcrypt.encode(memberPw);
		System.out.println("암호화된 비밀번호: " + encPw);

		member.setMemberPw(encPw);

		int result = memberDao.insertMember(member);
		return result;
	}

	// 로그인
	public Member login(Member member) {
		// 아이디로 회원 조회 후 비밀번호 비교
		Member loginUser = memberDao.selectOneMember(member.getMemberId());

		if (loginUser != null) {
			if (bcrypt.matches(member.getMemberPw(), loginUser.getMemberPw())) {
				// 응답으로 비밀번호 노출 방지
				loginUser.setMemberPw(null);
				return loginUser;
			}

		}
		return null;
	}



		





	
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




		@Transactional
		public int updateMemberThumb(Member mem) {
			int result = memberDao.updateMemberThumb(mem);
			return result;
		}


		public int updateMemberInfo(Member form) {
			int result = memberDao.updateMemberInfo(form);
			return result;
		}


	
		
}
	
