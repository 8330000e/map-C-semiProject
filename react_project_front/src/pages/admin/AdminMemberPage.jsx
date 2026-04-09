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

  const selectMemberList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/member`)
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
  }, []);

  return (
    <>
      <AdminMember
        memberList={memberList}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        statusText={statusText}
      />
    </>
  );
};

export default AdminMemberPage;
