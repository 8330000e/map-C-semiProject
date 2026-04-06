package kr.co.iei.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.member.model.vo.Member;

@Mapper
public interface MemberDao {

	int insertMember(Member member);

	Member selectOneMember(String memberId);


	String findIdByEmail(String memberEmail);
	/*
	 * @Mapper 어노테이션의 역할 원래라면 return sqlSession.selectOne("member.findIdByEmail",
	 * memberEmail); 같은 로직을 짜야 하지만 mapper를 실행하면 얘가 알아서 실행 기능을 수행하기 떄문에 필요x
	 * 
	 * 
	 */

	public Integer existsByIdAndEmail(@Param("memberId") String memberId, @Param("memberEmail") String memberEmail);

	List<Member> selectMemberList();

	int updateMemberThumb(Member mem);

	int updateMemberInfo(Member member);


	Member getOneMemberInfo(String memberId);

	Member memberPw(String memberId);

	int updatePw(Member m);


}



