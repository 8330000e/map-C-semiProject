package kr.co.iei.admin.model.dao;

// MyBatis Mapper 인터페이스 - 실제 SQL은 admin-mapper.xml에서 처리
// 메서드명이 mapper의 id와 매핑됨

import java.lang.reflect.Member;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.ListItem;
import kr.co.iei.admin.model.vo.Log;
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.admin.model.vo.Qna;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.Keyword;

@Mapper
public interface AdminDao {

	// 공지사항 등록 - 성공 시 1 반환
	int insertNotice(Notice notice);

	// 공지사항 목록 전체 조회
	List<Notice> selectNoticeList();

	// 공지사항 수정
	int editNotice(Notice notice);

	// 대시보드 통계 한 번에 조회 (회원수, 신고수 등)
	DashData getDashData();

	// 공지사항 삭제
	int deleteNotice(Integer noticeNo);

	// FAQ 목록 전체 조회
	List<Faq> selectFaqList();

	// FAQ 등록
	int insertFaq(Faq faq);

	// FAQ 수정
	int editFaq(Faq faq);

	// QnA 목록 조회 - page/size 기반 페이지네이션
	List<Qna> selectQnaList(ListItem listItem);

	// QnA 답변 등록 + status 1로 변경
	int qnaAnswer(Qna qna);

	// QnA 전체 건수 조회 - totalPage 계산용
	int getTotalCount();

	// 회원 목록 조회 - status/grade/keyword 조건 동적 적용
	List<Member> selectMemberList(Integer status, Integer grade, String keyword);

	// 회원 최근 로그 4개 - 상세 패널 미리보기용
	List<Log> getRecentLog(String memberId);

	// 전체 로그 20개씩 - 모달 무한 스크롤용
	List<Log> getLogList(String memberId, Integer start, String action, Integer result, String sort);

	Map<String, Object> getAnomalyCount(String memberId);

	List<Board> getBoardList();

	List<Keyword> getKeywordList();

	

}
