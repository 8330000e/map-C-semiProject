// 회원 관리 UI 컴포넌트 - 왼쪽 목록 + 오른쪽 상세 2단 레이아웃
// 데이터/API 처리는 AdminMemberPage.jsx에서 담당

import styles from "./AdminMember.module.css";

const statusText = {
  0: "정상",
  1: "영구정지",
  2: "탈퇴",
  3: "정지",
};

const AdminMember = ({
  memberList,
  selectedMember,
  setSelectedMember,
  filter,
  changeFilter,
  selectRecentLogList,
  recentLogList,
  isModalOpen,
  setIsModalOpen,
  selectLogList,
  logList,
  logPage,
  setLogPage,
  selectAnomalyCount,
  anomalyData,
  logFilter,
  changeLogFilter,
  toggleLogSort,
  boardNav,
  selectCommentList,
  commentList,
}) => {
  return (
    <>
      <div className={styles.member_wrap}>
        {/* 왼쪽: 회원 목록 패널 */}
        <section className={`${styles.panel} ${styles.member_left}`}>
          {/* 필터 바 - 상태/권한 셀렉트 + 키워드 검색 */}
          <div className={styles.filter_bar}>
            <select name="status" value={filter.status} onChange={changeFilter}>
              <option value="ALL">상태</option>
              <option value={0}>정상</option>
              <option value={1}>영구정지</option>
              <option value={3}>정지</option>
              <option value={2}>탈퇴</option>
            </select>
            <select name="grade" value={filter.grade} onChange={changeFilter}>
              <option value="ALL">권한</option>
              <option value={2}>일반</option>
              <option value={1}>관리자</option>
            </select>
            <input
              type="text"
              name="keyword"
              value={filter.keyword}
              onChange={changeFilter}
              placeholder="아이디/이름 검색"
            />
          </div>

          {/* 회원 목록 - 클릭하면 오른쪽에 상세 표시 + 최근 로그 불러옴 */}
          <div className={styles.member_list}>
            {memberList.length === 0 ? (
              <div className={styles.empty_state}>등록된 회원이 없습니다.</div>
            ) : (
              memberList.map((member) => (
                <button
                  key={member.memberId}
                  type="button"
                  className={`${styles.member_item} ${
                    selectedMember?.memberId === member.memberId
                      ? styles.member_item_active
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedMember(member);
                    selectRecentLogList(member.memberId);
                    selectAnomalyCount(member.memberId);
                  }}
                >
                  <div className={styles.member_identity}>
                    {/* 이름 첫 글자 표시 */}
                    <span className={styles.avatar}>
                      {member.memberName?.charAt(0)}
                    </span>
                    <div className={styles.identity_text}>
                      <span>{member.memberId}</span>
                      <strong>{member.memberName}</strong>
                    </div>
                  </div>

                  <div className={styles.member_meta}>
                    <div className={styles.meta_row}>
                      <span className={styles.meta_label}>상태</span>
                      <span
                        className={`${styles.badge} ${
                          member.memberStatus === 0
                            ? styles.status_active
                            : member.memberStatus === 1
                              ? styles.status_banned
                              : member.memberStatus === 3
                                ? styles.status_suspended
                                : styles.status_dormant
                        }`}
                      >
                        {statusText[member.memberStatus]}
                      </span>
                    </div>
                    <div className={styles.meta_row}>
                      <span className={styles.meta_label}>등급</span>
                      <span className={`${styles.badge} ${styles.badge_role}`}>
                        {member.memberGrade === 2 ? "일반" : "관리자"}
                      </span>
                    </div>
                    <div className={styles.meta_row}>
                      <span className={styles.meta_label}>위험도</span>
                      <span
                        className={`${styles.badge} ${
                          member.failCount >= 3 &&
                          member.locationChangeCount >= 1
                            ? styles.danger_high
                            : member.failCount >= 3 ||
                                member.locationChangeCount >= 1
                              ? styles.danger_mid
                              : styles.danger_safe
                        }`}
                      >
                        {member.failCount >= 3 &&
                        member.locationChangeCount >= 1
                          ? "위험"
                          : member.failCount >= 3 ||
                              member.locationChangeCount >= 1
                            ? "주의"
                            : "안전"}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* 오른쪽: 선택된 회원 상세 패널 */}
        <section className={`${styles.panel} ${styles.member_right}`}>
          {!selectedMember ? (
            <div className={styles.empty_state}>선택된 회원이 없습니다.</div>
          ) : (
            <>
              {/* 프로필 카드 - 이름/아이디/상태뱃지 */}
              <section className={styles.profile_card}>
                <div className={styles.profile_identity}>
                  <span className={styles.avatar_lg}>
                    {/* 회원이름 첫글자만 따옴 */}
                    {selectedMember.memberName?.charAt(0)}{" "}
                  </span>
                  <div className={styles.profile_text}>
                    <span>{selectedMember.memberId}</span>
                    <strong>{selectedMember.memberName}</strong>
                  </div>
                </div>
                <div className={styles.profile_badges}>
                  <span
                    className={`${styles.badge} ${
                      selectedMember.memberStatus === 0
                        ? styles.status_active
                        : selectedMember.memberStatus === 1
                          ? styles.status_banned
                          : selectedMember.memberStatus === 3
                            ? styles.status_suspended
                            : styles.status_dormant
                    }`}
                  >
                    {statusText[selectedMember.memberStatus]}
                  </span>
                  <span className={`${styles.badge} ${styles.badge_role}`}>
                    {selectedMember.memberGrade === 2 ? "일반" : "관리자"}
                  </span>
                </div>
              </section>

              {/* 회원 정보 그리드 - 이메일/가입일/게시글수/댓글수/신고수 */}
              <section className={styles.info_grid}>
                <article className={styles.info_item}>
                  <span>이메일</span>
                  <strong>{selectedMember.memberEmail}</strong>
                </article>
                <article className={styles.info_item}>
                  <span>가입일</span>
                  <strong>{selectedMember.enrollDate}</strong>
                </article>
                <article
                  className={styles.info_item}
                  onClick={() => {
                    boardNav(selectedMember.memberId);
                  }}
                >
                  <span>게시글 수</span>
                  <strong>{selectedMember.boardCount}</strong>
                </article>
                <article
                  className={styles.info_item}
                  onClick={() => {
                    setIsModalOpen(true);
                    selectCommentList(selectedMember.memberId);
                  }}
                >
                  <span>댓글 수</span>
                  <strong>{selectedMember.commentCount}</strong>
                </article>
                {/* 신고 수는 danger 스타일로 강조 */}
                <article
                  className={`${styles.info_item} ${styles.info_danger}`}
                >
                  <span>신고 수</span>
                  <strong>{selectedMember.reportCount}</strong>
                </article>
              </section>

              <section className={styles.anomaly}>
                <h3>최근 24시간 이상기록</h3>
                <div className={styles.loginFail}>
                  <span>로그인 실패: {anomalyData.failCount} 회</span>
                </div>
                <div className={styles.loginLocation}>
                  <span>위치변경: {anomalyData.locationChangeCount} 회</span>
                </div>
              </section>

              {/* 최근 로그 4개 미리보기 테이블 */}
              <section className={styles.member_log}>
                <div className={styles.member_log_list}>
                  {recentLogList.length === 0 ? (
                    <div className={styles.empty_state}>
                      활동 기록이 없습니다.
                    </div>
                  ) : (
                    // thead = 헤더 영역, tbody = 데이터 영역
                    // tr = 한 줄(row), th = 헤더 칸, td = 데이터 칸
                    <table>
                      <thead>
                        <tr>
                          <th>접속 IP</th>
                          <th>유형</th>
                          <th>접속 시간</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentLogList.map((recentLog) => (
                          <tr key={recentLog.memberLogNo}>
                            <td>{recentLog.logIp}</td>
                            <td>{recentLog.logAction}</td>
                            <td>{recentLog.logTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {/* 전체보기 버튼 - 모달 열고 page 0부터 다시 조회 */}
                <button
                  className={styles.log_modal_btn}
                  onClick={() => {
                    setIsModalOpen(true); // 모달열기
                    setLogPage(0); // page 0부터 시작 (스크롤)
                    selectLogList(selectedMember.memberId, logPage); // logList 호출
                    console.log(logList);
                  }}
                >
                  전체보기
                </button>
              </section>
            </>
          )}
        </section>

        {/* 전체 로그 모달 - 배경 클릭 시 닫힘 */}
        {isModalOpen && logList && (
          <div
            className={styles.modal_bg}
            onClick={() => {
              setIsModalOpen(false); // 모달 배경 클릭 시 false로 변경 -> 모달 닫힘
            }}
          >
            <div
              className={styles.modal_content}
              onClick={(e) => {
                e.stopPropagation(); // 모달 내부 클릭 시 닫힘 방지 (모달 콘텐츠 영역은 클릭해도 닫히지 않음)
              }}
              onScroll={(e) => {
                // 스크롤이 바닥에 닿으면 다음 페이지 로드 (무한 스크롤)
                const { scrollTop, clientHeight, scrollHeight } = e.target;
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                  // 바닥에 닿기 조금 전에 미리 요청
                  if (logList.length % 20 !== 0) return; // 이전 데이터 20개 미만이면 다음 요청 중단
                  const nextPage = logPage + 1;
                  setLogPage(nextPage); // 현재 페이지 +1로 업데이트 해주고
                  selectLogList(selectedMember.memberId, nextPage); // logList 호출
                }
              }}
            >
              <h3>전체기록</h3>
              <table>
                <thead>
                  <tr>
                    <th>접속 IP</th>
                    {/* 접속시간 클릭 시 toggleLogSort함수 실행 AdminMemberPage에 있음   */}
                    <th className={styles.sort_th} onClick={toggleLogSort}>
                      접속시간 {logFilter.sort === "DESC" ? "▼" : "▲"}
                    </th>
                    <th>
                      <select
                        value={logFilter.action}
                        onChange={changeLogFilter}
                        name="action"
                      >
                        <option value="ALL">유형</option>
                        <option value="로그인">로그인</option>
                        <option value="로그아웃">로그아웃</option>
                        <option value="게시글작성">게시글작성</option>
                        <option value="댓글작성">댓글작성</option>
                      </select>
                    </th>
                    <th>상세</th>
                    <th>접속기기</th>
                    <th>접속위치</th>
                    <th>
                      <select
                        value={logFilter.result}
                        onChange={changeLogFilter}
                        name="result"
                      >
                        <option value="ALL">결과</option>
                        <option value="0">성공</option>
                        <option value="1">실패</option>
                      </select>
                    </th>
                    <th>테스트</th>
                  </tr>
                </thead>
                <tbody>
                  {logList.length === 0 ? (
                    <tr>
                      <td>기록없음</td>
                    </tr>
                  ) : (
                    logList.map((log) => (
                      // logResult가 1이면 로그인 실패 - fail_row 클래스로 빨간 배경 표시
                      <tr
                        key={log.memberLogNo}
                        className={log.logResult === 1 ? styles.fail_row : ""}
                      >
                        <td>{log.logIp}</td>
                        <td>{log.logTime}</td>
                        <td>{log.logAction}</td>
                        <td>{log.logDetail}</td>
                        <td>{log.logDevice}</td>
                        <td>{log.logLocation}</td>
                        <td>{log.logResult === 1 ? "실패" : "성공"}</td>
                        <td>{log.logAlert}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isModalOpen && commentList && (
          <div
            className={styles.modal_bg}
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <div
              className={styles.modal_content}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h3>댓글 목록</h3>
              <table className={styles.comment_table}>
                <colgroup>
                  <col className={styles.col_board_no} />
                  <col className={styles.col_comment_no} />
                  <col className={styles.col_content} />
                  <col className={styles.col_date} />
                </colgroup>
                <thead>
                  <tr>
                    <th>게시글 번호</th>
                    <th>댓글 번호</th>
                    <th>댓글 내용</th>
                    <th>작성일</th>
                  </tr>
                </thead>

                <tbody>
                  {commentList.length === 0 ? (
                    <tr>
                      <td colSpan={4}>기록없음</td>
                    </tr>
                  ) : (
                    commentList.map((comment) => (
                      <tr key={comment.commentNo}>
                        <td>{comment.boardNo}</td>
                        <td>{comment.commentNo}</td>
                        <td className={styles.comment_content_cell}>
                          {comment.content}
                        </td>
                        <td>{comment.createdAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminMember;
