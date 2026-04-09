import styles from "./LeaveMember.module.css";
import useAuthStore from "../../store/useAuthStore";
import { Input } from "../../components/ui/Form";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Icon from "@mui/material/Icon";
import { useNavigate } from "react-router-dom";

const LeaveMember = () => {
  const { memberId, logout } = useAuthStore();
  const [lastInput, setLastInput] = useState("");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    memberPw: "",
    memberId: memberId,
  });

  const exit = (lastInput) => {
    // setForm({ ...form, memberPw: lastInput });

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/checkauth`, {
        memberId: memberId,
        memberPw: lastInput,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          Swal.fire({
            title: "정말로 회원탈퇴하시겠습니까?ㅠㅠㅠㅠㅠ",
            icon: "question",
            text: "탈퇴한 후에는 현재 아이디는 복구하지 못합니다.",
            showCancelButton: "번복",
          }).then((res) => {
            if (res.isConfirmed) {
              axios
                .patch(
                  `${import.meta.env.VITE_BACKSERVER}/members/${memberId}/leave`,
                )
                .then((res) => {
                  console.log(res.data);
                  if (res.data === 1) {
                    Swal.fire({
                      title: "성공적으로 탈퇴하셨습니다.",
                      icon: "success",
                      text: "아이디를 두본다시 사용하실수 없습니다.",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        logout();
                        navigate("/");
                      }
                    });
                  } else {
                    console.log("문제 발생");
                    return;
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
        } else {
          Swal.fire({
            text: "비밀번호 틀림",
            icon: "error",
            title: "오류",
          });
        }
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

              exit(lastInput);
            }}
          >
            <label htmlFor="inputPw">기존 비밀번호 입력</label>
            <Input
              id="inputPw"
              autoComplete="current-password"
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
