import { useEffect, useState } from "react";
import styles from "./AdminMember.module.css";
import axios from "axios";

const AdminMember = () => {
  const [memberList, setMemberList] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div className={styles.member_wrap}>
      <table className={styles.member_table}>
        <thead>
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>이메일</th>
            <th>가입일</th>
            <th>등급</th>
            <th>상태</th>
            <th>신고수</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default AdminMember;
