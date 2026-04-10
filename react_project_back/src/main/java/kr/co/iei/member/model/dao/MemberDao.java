package kr.co.iei.member.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.member.model.vo.Member;

@Mapper
public interface MemberDao {
	//김경건
	int insertMember(Member member);
	//김경건
	Member selectOneMember(String memberId);

	//김경건
	String findIdByEmail(String memberEmail);
	/*
	 * @Mapper 어노테이션의 역할 원래라면 return sqlSession.selectOne("member.findIdByEmail",
	 * memberEmail); 같은 로직을 짜야 하지만 mapper를 실행하면 얘가 알아서 실행 기능을 수행하기 떄문에 필요x
	 * 
	 * 
	 */
	//김경건
	public Integer existsByIdAndEmail(@Param("memberId") String memberId, @Param("memberEmail") String memberEmail);
	
	// 비밀번호 재설정 (김경건)
	int resetPw( String memberId, @Param("memberPw") String encPw);
	
	/////////////////////////////////////////
	List<Member> selectMemberList();

	int updateMemberThumb(Member mem);

	int updateMemberInfo(Member member);

	Member getOneMemberInfo(String memberId);

	Member memberPw(String memberId);

	int updatePw(Member m);

	Integer selectMemberPoint(String memberId);

	int decreasePoint(String memberId, int point);

	int leaveMember(String memberId);

	int insertMemberPoint(String memberId);
	
	void insertLog(Map<String, Object> params);
}
