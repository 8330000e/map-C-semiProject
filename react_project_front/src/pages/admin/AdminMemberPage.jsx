// 회원 관리 페이지 - 데이터/API 처리 담당, UI는 AdminMember.jsx에서
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminMember from "../../components/admin/AdminMember";

const AdminMemberPage = () => {
  const navigate = useNavigate();

  // 회원 목록 + 선택된 회원 (오른쪽 상세 패널용)
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  // 회원 목록 필터 - status/grade/keyword 동적 적용
  const [filter, setFilter] = useState({
    status: "ALL", // 정상/정지/탈퇴 초기값 전체
    grade: "ALL", // 일반/관리자 초기값 전체
    keyword: "", // 검색어
  });

  // 로그 필터 - 모달 무한 스크롤용
  const [logFilter, setLogFilter] = useState({
    action: "ALL", // 행동 유형 초기값 전체
    result: "ALL", // 성공 실패 여부 초기값 전체
    sort: "DESC", // 초기값 최신순
  });

  // 로그 데이터 - 최근 4개(미리보기) + 전체(모달) + 페이지번호
  const [recentLogList, setRecentLogList] = useState([]);
  const [logList, setLogList] = useState([]);
  const [logPage, setLogPage] = useState(0);

  // 이상징후 - 로그인실패 / 위치변경 카운트
  const [anomalyData, setAnomalyData] = useState({
    failCount: 0,
    locationChangeCount: 0,
  });

  // 회원이 작성한 댓글 목록 (댓글 모달용)
  const [commentList, setCommentList] = useState([]);

  // 모달 open 상태
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  // 게시글 수 클릭 시 해당 회원 게시글 목록 페이지로 이동
  const boardNav = (memberId) => {
    navigate("/admin/boards", { state: { memberId: memberId } });
  };

  // 셀렉트/인풋 변경 시 filter 상태 업데이트
  const changeFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilter({ ...filter, [name]: value });
  };

  // logFilter 상태 업데이트
  const changeLogFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLogFilter({ ...logFilter, [name]: value });
  };

  // 회원 로그 모달 접속시간 토글
  const toggleLogSort = () => {
    // setState에 값 대신 함수를 넣으면 리액트가 현재 state를 첫번째 인자 (prev)로 자동으로 넘겨줌
    setLogFilter((prev) => ({
      // logFilter 스프레드 연산자로 복사
      ...prev,
      // logFilter에 sort만 현재값 반대로 바꿔주고 변경
      sort: prev.sort === "DESC" ? "ASC" : "DESC",
    }));
  };

  const excelDownload = (type) => {
    let url = "";
    let filename = "";

    if (type === "member") {
      url = "/admins/members-excel";
      filename = "회원목록.xlsx";
    } else if (type === "log") {
      url = `/admins/logs-excel/${selectedMember.memberId}`;
      filename = `${selectedMember.memberId}_로그.xlsx`;
    }
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}${url}`, {
        responseType: "blob",
      })
      .then((res) => {
        console.log(res);
        // blob 데이터 덩어리에 접근할 수 있는 가짜 url (메모리 상의 가짜 주소)
        const url = window.URL.createObjectURL(new Blob([res.data]));
        // 클릭용 a태그 생성
        const a = document.createElement("a");
        // a태그에 위에서 만든 가짜 url 연결
        a.href = url;
        // 다운로드될 파일 이름
        a.download = filename;
        // body 어딘가에 a태그 붙임
        document.body.appendChild(a);
        // 클릭하면
        a.click();
        // a태그 body에서 지워버림
        document.body.removeChild(a);
        // url 지우기 (메모리 누수 방지라고 함 spring workbook 닫는거랑 비슷할듯)
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 회원 목록 조회 - ALL이면 params에서 제외 (백엔드 required=false)
  const selectMemberList = () => {
    const params = {}; // 빈 객체로 시작
    if (filter.status !== "ALL") params.status = filter.status; // filter status가 ALL이 아니라면 status값을 params에 담음
    if (filter.grade !== "ALL") params.grade = filter.grade; // 동일
    if (filter.keyword.trim()) params.keyword = filter.keyword; // trim으로 공백만 있는 경우 제거, 공백만 있거나 빈문자열 일때 false 처리 params에 안담김
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/member`, { params })
      .then((res) => {
        setMemberList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 회원이 작성한 댓글 목록 조회 - 댓글 모달용
  const selectCommentList = (memberId) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/comment/${memberId}`)
      .then((res) => {
        setCommentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 회원 클릭 시 최근 로그 4개 불러옴 - 상세 패널 미리보기용
  const selectRecentLogList = (memberId) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/recentLog/${memberId}`)
      .then((res) => {
        setRecentLogList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 전체 로그 조회 - page 0이면 새로 불러오고, 이후는 기존 목록에 이어붙임 (무한 스크롤)
  const selectLogList = (memberId, page) => {
    const params = {};
    if (logFilter.action !== "ALL") params.action = logFilter.action;
    if (logFilter.result !== "ALL") params.result = logFilter.result;
    params.sort = logFilter.sort; // sort는 무조건 보냄 asc/desc
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/admins/log/${memberId}/${page}`,
        { params },
      )
      .then((res) => {
        if (page === 0) {
          setLogList(res.data); // 페이지가 0이면 새로 불러옴 필터변경, 새로 열때
        } else {
          setLogList([...logList, ...res.data]); // 기존 목록에 다음 데이터 추가 두 배열 합침
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 이상징후 카운트 - 최근 24시간 로그인실패/위치변경
  const selectAnomalyCount = (memberId) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/anomalyLog/${memberId}`)
      .then((res) => {
        setAnomalyData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 현황판 집계 - 전체/정지/접속중/미접속
  const memberStats = useMemo(() => {
    const total = memberList.length;
    const suspended = memberList.filter(
      (m) => m.memberStatus === 1 || m.memberStatus === 3,
    ).length;
    const online = memberList.filter((m) => m.isOnline === 1).length;
    const offline = total - online;
    const onlineRate = total === 0 ? 0 : (online / total) * 100;
    const offlineRate = total === 0 ? 0 : (offline / total) * 100;
    return { total, suspended, online, offline, onlineRate, offlineRate };
  }, [memberList]);

  // 회원 목록 필터 바뀔때마다 회원 목록 api 호출
  useEffect(() => {
    selectMemberList();
  }, [filter]);

  // 모달 로그 필터 바뀔때마다 page 0부터 다시 조회
  useEffect(() => {
    // 회원 목록에서 선택된 회원이 있고 모달이 열려 있을때만 동작
    if (selectedMember) {
      setLogPage(0); // 로그 필터가 변경되면 다시 조회 해야하니까 logPage0으로 돌림
      selectLogList(selectedMember.memberId, 0); // logList 다시 호출
    }
  }, [logFilter]);

  return (
    <>
      <AdminMember
        memberList={memberList}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        filter={filter}
        changeFilter={changeFilter}
        logFilter={logFilter}
        changeLogFilter={changeLogFilter}
        toggleLogSort={toggleLogSort}
        recentLogList={recentLogList}
        logList={logList}
        logPage={logPage}
        setLogPage={setLogPage}
        selectRecentLogList={selectRecentLogList}
        selectLogList={selectLogList}
        anomalyData={anomalyData}
        selectAnomalyCount={selectAnomalyCount}
        commentList={commentList}
        setCommentList={setCommentList}
        selectCommentList={selectCommentList}
        isLogModalOpen={isLogModalOpen}
        setIsLogModalOpen={setIsLogModalOpen}
        isCommentModalOpen={isCommentModalOpen}
        setIsCommentModalOpen={setIsCommentModalOpen}
        boardNav={boardNav}
        memberStats={memberStats}
        excelDownload={excelDownload}
      />
    </>
  );
};

export default AdminMemberPage;
