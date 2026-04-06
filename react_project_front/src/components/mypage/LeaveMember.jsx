import styles from "./LeaveMember.module.css";
import useAuthStore from "../../store/useAuthStore";
import { Input } from "../../components/ui/Form";

import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Icon from "@mui/material/Icon";
// import { memberId } from "../../store/useAuthStore";

const LeaveMember = () => {
  const [lastInput, setLastInput] = useState("");
  const [form, setForm] = useState({
    // memberId: memberId,
    memberPw: "",
  });
  const exit = () => {
    console.log(form);
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/members/checkauth`, form)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className={styles.leaveMember_wrap}>
        <div className={styles.leaveMember_title_wrap}>
          <h3>회원 탈퇴</h3>
        </div>
        <div className={styles.leaveMember_content_wrap}>
          <form
            className={styles.leaveMember_input_wrap}
            onSubmit={(e) => {
              e.preventDefault();
              setForm({
                ...form,
                memberPw: lastInput,
              });
            }}
          >
            <label htmlFor="inputPw">기존 비밀번호 입력</label>
            <Input
              id="inputPw"
              type="password"
              value={lastInput}
              onChange={(e) => {
                setLastInput(e.target.value);
              }}
            />
            <button type="submit">회원탈퇴하기</button>
          </form>
        </div>
      </div>
    </>
  );
};
export default LeaveMember;
