// 시스템 로그 페이지 - 데이터/API 처리 담당, UI는 AdminLog.jsx에서
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLog from "../../components/admin/AdminLog";

const AdminLogPage = () => {
  // 관리자 조치 로그 목록
  const [adminLogList, setAdminLogList] = useState([]);

  // 로그 필터 - 키워드/조치유형/정렬
  const [logFilter, setLogFilter] = useState({
    keyword: "",
    action: "ALL",
    sort: "desc",
  });

  // 처리일 정렬 토글 (최신순 <-> 오래된순)
  const toggleSort = () => {
    setLogFilter({
      ...logFilter,
      sort: logFilter.sort === "desc" ? "asc" : "desc",
    });
  };

  // 셀렉트/인풋 변경 시 logFilter 상태 업데이트
  const changeLogFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLogFilter({ ...logFilter, [name]: value });
  };

  // 관리자 로그 목록 조회 - ALL이면 params에서 제외 (백엔드 required=false)
  const selectAdminLogList = () => {
    const params = {};
    if (logFilter.keyword.trim()) params.keyword = logFilter.keyword;
    if (logFilter.action !== "ALL") params.action = logFilter.action;
    params.sort = logFilter.sort; // sort는 무조건 보냄 asc/desc
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/admin-log`, { params })
      .then((res) => {
        setAdminLogList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 필터 변경시마다 목록 다시 조회
  useEffect(() => {
    selectAdminLogList();
  }, [logFilter]);

  return (
    <>
      <AdminLog
        adminLogList={adminLogList}
        logFilter={logFilter}
        changeLogFilter={changeLogFilter}
        toggleSort={toggleSort}
      />
    </>
  );
};

export default AdminLogPage;
