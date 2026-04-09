import { useEffect, useState } from "react";
import styles from "./AdminMemberPage.module.css";
import axios from "axios";
import AdminMember from "../../components/admin/AdminMember";

const statusText = {
  0: "정상",
  1: "정지",
  2: "탈퇴",
};

const AdminMemberPage = () => {
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filter, setFilter] = useState({
    status: "ALL",
    grade: "ALL",
    keyword: "",
  });

  const changeFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilter({ ...filter, [name]: value });
  };

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

  useEffect(() => {
    selectMemberList();
  }, [filter]);

  return (
    <>
      <AdminMember
        memberList={memberList}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        statusText={statusText}
        filter={filter}
        changeFilter={changeFilter}
      />
    </>
  );
};

export default AdminMemberPage;
