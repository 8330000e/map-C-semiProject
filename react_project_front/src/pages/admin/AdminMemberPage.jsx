// 회원 관리 페이지 - 데이터/API 처리 담당, UI는 AdminMember.jsx에서
import { useEffect, useState } from "react";
import styles from "./AdminMemberPage.module.css";
import axios from "axios";
import AdminMember from "../../components/admin/AdminMember";

const AdminMemberPage = () => {
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null); // 오른쪽 패널에 표시할 회원
  const [isModalOpen, setIsModalOpen] = useState(false); // 전체 로그 모달 열림 여부

  const [logFilter, setLogFilter] = useState({
    action: "ALL",
    result: "ALL",
    sort: "DESC",
  });

  // 필터 상태 - ALL이면 조건 없이 전체 조회
  const [filter, setFilter] = useState({
    status: "ALL",
    grade: "ALL",
    keyword: "",
  });

  const [recentLogList, setRecentLogList] = useState([]); // 회원 클릭 시 최근 4개 로그
  const [logList, setLogList] = useState([]); // 모달에서 보여줄 전체 로그
  const [logPage, setLogPage] = useState(0); // 무한 스크롤 페이지 번호

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

  const changeLogFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLogFilter({ ...logFilter, [name]: value });
  };

  const toggleLogSort = () => {
    setLogFilter((prev) => ({
      ...prev,
      sort: prev.sort === "DESC" ? "ASC" : "DESC",
    }));
  };

  // 필터 조건으로 회원 목록 조회 - ALL이면 파라미터에서 제외
  const selectMemberList = () => {
    const params = {};
    if (filter.status !== "ALL") params.status = filter.status;
    if (filter.grade !== "ALL") params.grade = filter.grade;
    if (filter.keyword.trim()) params.keyword = filter.keyword;
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
    params.sort = logFilter.sort;
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/admins/log/${memberId}/${page}`,
        { params },
      )
      .then((res) => {
        console.log(res);
        if (page === 0) {
          setLogList(res.data);
        } else {
          setLogList([...logList, ...res.data]); // 기존 목록에 추가
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

  // 회원 목록 필터
  useEffect(() => {
    selectMemberList();
  }, [filter]);

  // 모달 로그 필터
  useEffect(() => {
    if (selectedMember && isModalOpen) {
      setLogPage(0);
      selectLogList(selectedMember.memberId, 0);
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
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectLogList={selectLogList}
        logList={logList}
        logPage={logPage}
        setLogPage={setLogPage}
        selectAnomalyCount={selectAnomalyCount}
        anomalyData={anomalyData}
        logFilter={logFilter}
        changeLogFilter={changeLogFilter}
        toggleLogSort={toggleLogSort}
      />
    </>
  );
};

export default AdminMemberPage;
