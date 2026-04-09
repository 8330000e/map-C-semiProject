import styles from "./AdminMember.module.css";

const AdminMember = ({
  memberList,
  selectedMember,
  setSelectedMember,
  statusText,
}) => {
  return (
    <>
      <div className={styles.member_wrap}>
        {/* 왼쪽: 회원 목록 */}
        <section className={`${styles.panel} ${styles.member_left}`}>
          <h2 className={styles.member_title}>회원관리</h2>

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
                  onClick={() => setSelectedMember(member)}
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
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminMember;
