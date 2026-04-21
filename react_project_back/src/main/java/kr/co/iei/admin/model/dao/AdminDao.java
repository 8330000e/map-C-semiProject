package kr.co.iei.admin.model.dao;

// MyBatis Mapper 인터페이스 - 실제 SQL은 admin-mapper.xml에서 처리
// 메서드명이 mapper의 id와 매핑됨

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.admin.model.vo.AdminLog;
import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.ListItem;
import kr.co.iei.admin.model.vo.Log;
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.admin.model.vo.ProcessReport;
import kr.co.iei.admin.model.vo.Qna;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.campaign.model.vo.Campaign;
import kr.co.iei.member.model.vo.Member;

@Mapper
public interface AdminDao {

	// ============================== 대시보드 ==============================

	// 대시보드 통계 한 번에 조회 (회원수, 신고수 등)
	DashData getDashData();

	// ============================== 공지사항 ==============================

	// 공지사항 등록 - 성공 시 1 반환
	int insertNotice(Notice notice);

	// 공지사항 목록 전체 조회
	List<Notice> selectNoticeList();

	// 공지사항 수정
	int editNotice(Notice notice);

	// 공지사항 삭제
	int deleteNotice(Integer noticeNo);

	// ============================== FAQ ==============================

	// FAQ 목록 전체 조회
	List<Faq> selectFaqList();

	// FAQ 등록
	int insertFaq(Faq faq);

	// FAQ 수정
	int editFaq(Faq faq);

	// FAQ 삭제
	int deleteFaq(Integer faqNo);

	// ============================== 1:1 문의 (QnA) ==============================

	// QnA 목록 조회 - page/size 기반 페이지네이션
	List<Qna> selectQnaList(ListItem listItem);

	// QnA 전체 건수 조회 - totalPage 계산용
	int getTotalCount();

	// QnA 답변 등록 + status 1로 변경
	int qnaAnswer(Qna qna);

	// ============================== 회원 관리 ==============================

	// 승인 대기 캠페인 목록 조회
	List<Campaign> selectPendingCampaignList();

	// 캠페인 승인 처리 - 승인대기(0) -> 승인완료(1)
	int approveCampaign(Integer campaignNo);

	// 회원 목록 조회 - status/grade/keyword 조건 동적 적용
	List<Member> selectMemberList(Integer status, Integer grade, String keyword);

	// 회원이 작성한 댓글 목록 - 회원 상세 모달용
	List<BoardComment> getCommentList(String memberId);

	// 회원 최근 로그 4개 - 상세 패널 미리보기용
	List<Log> getRecentLog(String memberId);

	// 전체 로그 20개씩 - 모달 무한 스크롤용
	List<Log> getLogList(String memberId, Integer start, String action, Integer result, String sort);

	// 이상기록 카운트 - 최근 24시간 로그인 실패 / 위치변경
	Map<String, Object> getAnomalyCount(String memberId);

	// 회원 정지 해제 - lock_until = null, status = 0
	int releaseMember(String targetId);

	// 회원 정지 해제 로그 삽입 (신고 기반 아닌 독립 로그)
	int insertAdminLog2(ProcessReport pr);

	// ============================== 게시글 모니터링 ==============================

	// 게시글 목록 조회 - 키워드/위험도/신고수 필터 동적 적용
	List<Board> getBoardList(String keyword, String risk, String reportSort, String sort, String memberId);

	// ============================== 신고 처리 ==============================

	// 게시글 상태 변경 - 비공개(1) / 삭제(2)
	int updateBoardStatus(ProcessReport pr);

	// 댓글 상태 변경 - 블라인드(1)
	int updateCommentStatus(ProcessReport pr);

	// 회원 상태 변경 - 정지(3, lock_until set) / 영구정지(1)
	int updateMemberStatus(ProcessReport pr);

	// 신고 상태 처리완료(1)로 변경 - 그룹 전체 일괄
	int updateReportStatus(ProcessReport pr);

	// 그룹 전체 신고에 admin_log 삽입 (INSERT…SELECT)
	int insertAdminLog(ProcessReport pr);

	// 처리완료된 신고의 admin_log 조회
	AdminLog selectAdminLog(Integer reportNo);

	// ============================== 시스템 로그 ==============================

	// 시스템(관리자) 로그 목록 조회 - 키워드/조치유형/정렬 필터
	List<AdminLog> getAdminLogList(String keyword, String action, String sort);

	List<Log> getLogExcel(String memberId);

}
