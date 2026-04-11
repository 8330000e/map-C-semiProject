import { Tab } from "@mui/icons-material";
import styles from "./AdminMember.module.css";

const AdminMember = ({
  memberList,
  selectedMember,
  setSelectedMember,
  statusText,
  filter,
  changeFilter,
  selectRecentLogList,
  recentLogList,
  isModalOpen,
  setIsModalOpen,
}) => {
  return (
    <>
      <div className={styles.member_wrap}>
        {/* 왼쪽: 회원 목록 */}
        <section className={`${styles.panel} ${styles.member_left}`}>
          <div className={styles.filter_bar}>
            <select name="status" value={filter.status} onChange={changeFilter}>
              <option value="ALL">상태</option>
              <option value={0}>정상</option>
              <option value={1}>정지</option>
              <option value={2}>탈퇴</option>
            </select>
            <select name="grade" value={filter.grade} onChange={changeFilter}>
              <option value="ALL">권한</option>
              <option value={0}>일반</option>
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
                  }}
                >
                  <div className={styles.member_identity}>
                    <span className={styles.avatar}>
                      {member.memberName?.charAt(0)}
                    </span>
                    <div className={styles.identity_text}>
                      <span>{member.memberId}</span>
                      <strong>{member.memberName}</strong>
                    </div>
                  </div>

                  <div className={styles.member_meta}>
                    <span
                      className={`${styles.badge} ${
                        member.memberStatus === 0
                          ? styles.status_active
                          : member.memberStatus === 1
                            ? styles.status_banned
                            : styles.status_dormant
                      }`}
                    >
                      {statusText[member.memberStatus]}
                    </span>
                    <span className={`${styles.badge} ${styles.badge_role}`}>
                      {member.memberGrade === 2 ? "일반" : "관리자"}
                    </span>
                    <span className={styles.join_date}>
                      가입 {member.enrollDate}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* 오른쪽: 회원 상세 */}
        <section className={`${styles.panel} ${styles.member_right}`}>
          {!selectedMember ? (
            <div className={styles.empty_state}>선택된 회원이 없습니다.</div>
          ) : (
            <>
              <section className={styles.profile_card}>
                <div className={styles.profile_identity}>
                  <span className={styles.avatar_lg}>
                    {selectedMember.memberName?.charAt(0)}
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

              <section className={styles.info_grid}>
                <article className={styles.info_item}>
                  <span>이메일</span>
                  <strong>{selectedMember.memberEmail}</strong>
                </article>
                <article className={styles.info_item}>
                  <span>가입일</span>
                  <strong>{selectedMember.enrollDate}</strong>
                </article>
                <article className={styles.info_item}>
                  <span>게시글 수</span>
                  <strong>{selectedMember.boardCount}</strong>
                </article>
                <article className={styles.info_item}>
                  <span>댓글 수</span>
                  <strong>{selectedMember.commentCount}</strong>
                </article>
                <article
                  className={`${styles.info_item} ${styles.info_danger}`}
                >
                  <span>신고 수</span>
                  <strong>{selectedMember.reportCount}</strong>
                </article>
              </section>

              <section className={styles.member_log}>
                <div className={styles.member_log_list}>
                  {recentLogList.length === 0 ? (
                    <div className={styles.empty_state}>
                      활동 기록이 없습니다.
                    </div>
                  ) : (
                    // thead = 헤더 영역, tbody = 데이터 영역tr = 한 줄(row), th = 헤더 칸, td = 데이터 칸

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
                <button
                  className={styles.log_modal_btn}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  전체보기
                </button>
              </section>
            </>
          )}
        </section>
        {isModalOpen && (
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
              <h3>전체기록</h3>
              <table>
                <thead>
                  <tr>
                    <th>접속 IP</th>
                    <th>유형</th>
                    <th>접속시간</th>
                    <th>상세</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>아직</td>
                    <td>안</td>
                    <td>만</td>
                    <td>듬</td>
                  </tr>
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
