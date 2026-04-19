// 회원 관리 페이지 - 데이터/API 처리 담당, UI는 AdminMember.jsx에서
import { useEffect, useState } from "react";
import styles from "./AdminMemberPage.module.css";
import axios from "axios";
import AdminMember from "../../components/admin/AdminMember";
import { useNavigate } from "react-router-dom";

const AdminMemberPage = () => {
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null); // 오른쪽 패널에 표시할 회원

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const [commentList, setCommentList] = useState([]);
  const navigate = useNavigate();

  const boardNav = (memberId) => {
    navigate("/admin/boards", { state: { memberId: memberId } });
  };

  // 회원 로그 필터 객체로 한번에 묶음
  const [logFilter, setLogFilter] = useState({
    action: "ALL", // 행동 유형 초기값 전체
    result: "ALL", // 성공 실패 여부 초기값 전체
    sort: "DESC", // 초기값 최신순
  });

  // 회원 리스트 필터 객체
  const [filter, setFilter] = useState({
    status: "ALL", // 정상/정지/탈퇴 초기값 전체
    grade: "ALL", // 일반/관리자 초기값 전체
    keyword: "", // 검색어
  });

  const [recentLogList, setRecentLogList] = useState([]); // 회원 클릭 시 최근 4개 로그만 가져옴
  const [logList, setLogList] = useState([]); // 모달에서 보여줄 전체 로그
  const [logPage, setLogPage] = useState(0); // 무한 스크롤 페이지 번호

  // 이상징후 로그인실패 카운트, 로그인 위치변경 카운트
  const [anomalyData, setAnomalyData] = useState({
    failCount: 0,
    locationChangeCount: 0,
  });

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

  // 백엔드에서 required = false로 받고 있기 때문에 ALL이면 굳이 안보냄
  const selectMemberList = () => {
    const params = {}; // 빈 객체로 시작
    if (filter.status !== "ALL") params.status = filter.status; // filter status가 ALL이 아니라면 status값을 params에 담음
    if (filter.grade !== "ALL") params.grade = filter.grade; // 동일
    if (filter.keyword.trim()) params.keyword = filter.keyword; // trim으로 공백만 있는 경우 제거, 공백만 있거나 빈문자열 일때 false 처리 params에 안담김
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/member`, { params })
      .then((res) => {
        console.log(res);
        setMemberList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectCommentList = (memberId) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/comment/${memberId}`)
      .then((res) => {
        console.log(res);
        setCommentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 회원 클릭 시 최근 로그 4개 불러옴
  const selectRecentLogList = (memberId) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/recentLog/${memberId}`)
      .then((res) => {
        console.log(res);
        console.log(navigator.userAgent);
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
        console.log(res);
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

  const selectAnomalyCount = (memberId) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/anomalyLog/${memberId}`)
      .then((res) => {
        console.log(res);
        setAnomalyData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 회원 목록 필터 바뀔때마다 회원 목록 api 호출
  useEffect(() => {
    selectMemberList();
  }, [filter]);

  // 모달 로그 필터
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
        selectRecentLogList={selectRecentLogList}
        recentLogList={recentLogList}
        isLogModalOpen={isLogModalOpen}
        setIsLogModalOpen={setIsLogModalOpen}
        isCommentModalOpen={isCommentModalOpen}
        setIsCommentModalOpen={setIsCommentModalOpen}
        selectLogList={selectLogList}
        logList={logList}
        logPage={logPage}
        setLogPage={setLogPage}
        selectAnomalyCount={selectAnomalyCount}
        anomalyData={anomalyData}
        logFilter={logFilter}
        changeLogFilter={changeLogFilter}
        toggleLogSort={toggleLogSort}
        boardNav={boardNav}
        commentList={commentList}
        selectCommentList={selectCommentList}
        setCommentList={setCommentList}
      />
    </>
  );
};

export default AdminMemberPage;
