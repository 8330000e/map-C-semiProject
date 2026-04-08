import { useEffect, useMemo, useState } from "react";
import styles from "./AdminMember.module.css";

const mockMemberList = [
  {
    memberNo: 1,
    userId: "user01",
    name: "홍길동",
    initials: "홍",
    status: "ACTIVE",
    role: "일반",
    joinDate: "2022.12",
    email: "admin01@gmail.com",
    totalPosts: 10,
    totalComments: 14,
    reportCount: 0,
    logs: [
      {
        type: "join",
        title: "회원가입",
        time: "2026-04-01 10:10",
        ip: "10.10.15.8",
        desc: "일반 회원으로 가입",
      },
      {
        type: "login",
        title: "로그인",
        time: "2026-04-07 09:21",
        ip: "10.10.12.3",
        desc: "관리자 페이지 접속",
      },
      {
        type: "post",
        title: "게시글 작성",
        time: "2026-04-07 11:40",
        ip: "10.10.12.3",
        desc: "공지사항 확인 게시글 작성",
      },
    ],
  },
  {
    memberNo: 2,
    userId: "user02",
    name: "김서준",
    initials: "김",
    status: "BANNED",
    role: "관리자",
    joinDate: "2023.12",
    email: "admin02@gmail.com",
    totalPosts: 32,
    totalComments: 87,
    reportCount: 5,
    logs: [
      {
        type: "join",
        title: "회원가입",
        time: "2026-03-28 16:02",
        ip: "10.10.18.21",
        desc: "관리자 권한 계정 등록",
      },
      {
        type: "login",
        title: "로그인",
        time: "2026-04-08 09:20",
        ip: "10.10.11.57",
        desc: "관리자 페이지 접속",
      },
      {
        type: "report",
        title: "신고 처리",
        time: "2026-04-08 11:01",
        ip: "10.10.11.57",
        desc: "커뮤니티 신고 내역 처리",
      },
    ],
  },
  {
    memberNo: 3,
    userId: "user03",
    name: "박예린",
    initials: "박",
    status: "ACTIVE",
    role: "일반",
    joinDate: "2024.01",
    email: "user03@gmail.com",
    totalPosts: 6,
    totalComments: 19,
    reportCount: 1,
    logs: [
      {
        type: "join",
        title: "회원가입",
        time: "2026-03-15 08:42",
        ip: "10.10.19.30",
        desc: "일반 회원으로 가입",
      },
      {
        type: "login",
        title: "로그인",
        time: "2026-04-07 19:10",
        ip: "10.10.14.90",
        desc: "커뮤니티 메뉴 진입",
      },
      {
        type: "report",
        title: "신고 접수",
        time: "2026-04-08 18:20",
        ip: "10.10.14.90",
        desc: "부적절 게시글 신고",
      },
    ],
  },
  {
    memberNo: 4,
    userId: "user04",
    name: "이도윤",
    initials: "이",
    status: "DORMANT",
    role: "일반",
    joinDate: "2022.09",
    email: "user04@gmail.com",
    totalPosts: 2,
    totalComments: 1,
    reportCount: 0,
    logs: [
      {
        type: "join",
        title: "회원가입",
        time: "2026-02-02 11:11",
        ip: "10.10.17.44",
        desc: "일반 회원으로 가입",
      },
      {
        type: "login",
        title: "로그인",
        time: "2026-02-10 11:13",
        ip: "10.10.17.44",
        desc: "마지막 로그인 기록",
      },
      {
        type: "post",
        title: "활동 없음",
        time: "-",
        ip: "-",
        desc: "최근 활동 기록 없음",
      },
    ],
  },
];

const defaultMemberFilter = {
  status: "ALL",
  role: "ALL",
  keyword: "",
};

const defaultSortInfo = {
  sortKey: "joinDate",
  sortOrder: "desc",
};

const statusText = {
  ACTIVE: "정상",
  BANNED: "정지",
  DORMANT: "휴면",
};

const statusRank = {
  ACTIVE: 3,
  DORMANT: 2,
  BANNED: 1,
};

const logTypeClass = {
  join: "log_join",
  login: "log_login",
  report: "log_report",
  post: "log_post",
};

const sortableColumns = [
  { key: "userId", label: "아이디" },
  { key: "name", label: "이름" },
  { key: "email", label: "이메일" },
  { key: "joinDate", label: "가입일" },
  { key: "status", label: "상태" },
  { key: "role", label: "권한" },
  { key: "reportCount", label: "신고수" },
];

const valueForSort = (member, key) => {
  if (key === "joinDate") {
    return Number(member.joinDate.replace(".", ""));
  }
  if (key === "status") {
    return statusRank[member.status];
  }
  if (key === "reportCount") {
    return member.reportCount;
  }
  return String(member[key] ?? "").toLowerCase();
};

const AdminMember = () => {
  const [memberList, setMemberList] = useState([]);
  const [memberFilter, setMemberFilter] = useState({ ...defaultMemberFilter });
  const [sortInfo, setSortInfo] = useState({ ...defaultSortInfo });
  const [selectedNo, setSelectedNo] = useState(0);

  const selectMemberList = () => {
    // TODO: 백엔드 연결 시 axios.get(...).then((res) => setMemberList(res.data))
    setMemberList(mockMemberList);
  };

  const changeMemberFilter = (e) => {
    const { name, value } = e.target;
    setMemberFilter((prev) => ({ ...prev, [name]: value }));
  };

  const onSort = (key) => {
    setSortInfo((prev) => {
      if (prev.sortKey === key) {
        return { ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" };
      }
      return { sortKey: key, sortOrder: "asc" };
    });
  };

  const filteredMembers = useMemo(() => {
    const byFilter = memberList.filter((member) => {
      const statusMatched =
        memberFilter.status === "ALL" ? true : member.status === memberFilter.status;
      const roleMatched =
        memberFilter.role === "ALL" ? true : member.role === memberFilter.role;
      const keywordMatched =
        memberFilter.keyword.trim().length === 0
          ? true
          : `${member.userId} ${member.name} ${member.email}`
              .toLowerCase()
              .includes(memberFilter.keyword.toLowerCase());

      return statusMatched && roleMatched && keywordMatched;
    });

    return [...byFilter].sort((a, b) => {
      const aValue = valueForSort(a, sortInfo.sortKey);
      const bValue = valueForSort(b, sortInfo.sortKey);

      if (aValue < bValue) return sortInfo.sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortInfo.sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [memberList, memberFilter, sortInfo]);

  const selectedMember =
    filteredMembers.find((member) => member.memberNo === selectedNo) ?? null;

  useEffect(() => {
    selectMemberList();
  }, []);

  useEffect(() => {
    if (!filteredMembers.some((member) => member.memberNo === selectedNo)) {
      setSelectedNo(filteredMembers[0]?.memberNo ?? 0);
    }
  }, [filteredMembers, selectedNo]);

  return (
    <div className={styles.member_wrap}>
      <section className={`${styles.panel} ${styles.member_left}`}>
        <h2 className={styles.member_title}>회원관리</h2>

        <div className={styles.filter_bar}>
          <select
            name="status"
            value={memberFilter.status}
            onChange={changeMemberFilter}
          >
            <option value="ALL">상태</option>
            <option value="ACTIVE">정상</option>
            <option value="BANNED">정지</option>
            <option value="DORMANT">휴면</option>
          </select>

          <select name="role" value={memberFilter.role} onChange={changeMemberFilter}>
            <option value="ALL">권한</option>
            <option value="일반">일반</option>
            <option value="관리자">관리자</option>
          </select>

          <input
            type="text"
            name="keyword"
            value={memberFilter.keyword}
            onChange={changeMemberFilter}
            placeholder="아이디/이름/이메일 검색"
          />

          <button type="button" className={styles.add_btn}>
            회원 추가
          </button>
        </div>

        <div className={styles.sort_row}>
          {sortableColumns.map((column) => (
            <button
              key={column.key}
              type="button"
              className={`${styles.sort_btn} ${
                sortInfo.sortKey === column.key ? styles.sort_btn_active : ""
              }`}
              onClick={() => onSort(column.key)}
            >
              {column.label}
              <span className={styles.sort_arrow}>
                {sortInfo.sortKey === column.key
                  ? sortInfo.sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : "↕"}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.member_list}>
          {filteredMembers.length === 0 ? (
            <div className={styles.empty_state}>조건에 맞는 회원이 없습니다.</div>
          ) : (
            filteredMembers.map((member) => (
              <button
                key={member.memberNo}
                type="button"
                className={`${styles.member_item} ${
                  selectedNo === member.memberNo ? styles.member_item_active : ""
                }`}
                onClick={() => setSelectedNo(member.memberNo)}
              >
                <div className={styles.member_identity}>
                  <span className={styles.avatar}>{member.initials}</span>
                  <div className={styles.identity_text}>
                    <span>{member.userId}</span>
                    <strong>{member.name}</strong>
                  </div>
                </div>

                <div className={styles.member_meta}>
                  <span
                    className={`${styles.badge} ${
                      styles[`status_${member.status.toLowerCase()}`]
                    }`}
                  >
                    {statusText[member.status]}
                  </span>
                  <span className={`${styles.badge} ${styles.badge_role}`}>
                    {member.role}
                  </span>
                  <span className={styles.join_date}>가입 {member.joinDate}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className={styles.pagination}>
          <button type="button" className={styles.page_btn}>
            이전
          </button>
          <button type="button" className={`${styles.page_btn} ${styles.current}`}>
            1
          </button>
          <button type="button" className={styles.page_btn}>
            2
          </button>
          <button type="button" className={styles.page_btn}>
            3
          </button>
          <button type="button" className={styles.page_btn}>
            다음
          </button>
        </div>
      </section>

      <section className={`${styles.panel} ${styles.member_right}`}>
        {!selectedMember ? (
          <div className={styles.empty_state}>선택된 회원이 없습니다.</div>
        ) : (
          <>
            <section className={styles.profile_card}>
              <div className={styles.profile_identity}>
                <span className={styles.avatar_lg}>{selectedMember.initials}</span>
                <div className={styles.profile_text}>
                  <span>{selectedMember.userId}</span>
                  <strong>{selectedMember.name}</strong>
                </div>
              </div>
              <div className={styles.profile_badges}>
                <span
                  className={`${styles.badge} ${
                    styles[`status_${selectedMember.status.toLowerCase()}`]
                  }`}
                >
                  {statusText[selectedMember.status]}
                </span>
                <span className={`${styles.badge} ${styles.badge_role}`}>
                  {selectedMember.role}
                </span>
              </div>
            </section>

            <section className={styles.info_grid}>
              <article className={styles.info_item}>
                <span>이메일</span>
                <strong>{selectedMember.email}</strong>
              </article>
              <article className={styles.info_item}>
                <span>가입일</span>
                <strong>{selectedMember.joinDate}</strong>
              </article>
              <article className={styles.info_item}>
                <span>게시글 수</span>
                <strong>{selectedMember.totalPosts}</strong>
              </article>
              <article className={styles.info_item}>
                <span>댓글 수</span>
                <strong>{selectedMember.totalComments}</strong>
              </article>
              <article className={`${styles.info_item} ${styles.info_danger}`}>
                <span>신고 수</span>
                <strong>{selectedMember.reportCount}</strong>
              </article>
            </section>

            <section className={styles.activity_card}>
              <h3>활동 로그</h3>
              <ul className={styles.log_list}>
                {selectedMember.logs.map((log, index) => (
                  <li key={`${selectedMember.memberNo}-${index}`} className={styles.log_item}>
                    <span
                      className={`${styles.log_dot} ${styles[logTypeClass[log.type]]}`}
                    />
                    <div className={styles.log_text}>
                      <strong>{log.title}</strong>
                      <span>
                        {log.time} | IP {log.ip}
                      </span>
                      <em>{log.desc}</em>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </section>
    </div>
  );
};

export default AdminMember;
