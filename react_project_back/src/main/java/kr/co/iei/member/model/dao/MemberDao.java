package kr.co.iei.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.member.model.vo.Member;

@Mapper
public interface MemberDao {

	int insertMember(Member member);

	Member selectOneMember(String memberId);

	List<Member> selectMemberList();

	int updateMemberThumb(Member mem);

	int updateMemberInfo(Member member);

	Member getOneMemberInfo(String memberId);

	Member memberPw(String memberId);

	int updatePw(Member m);
}