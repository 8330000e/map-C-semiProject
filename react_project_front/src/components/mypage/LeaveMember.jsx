import styles from "./LeaveMember.module.css";
import useAuthStore from "../../store/useAuthStore";
import { Input } from "../../components/ui/Form";

import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeaveMember = () => {
  const { memberId, logout } = useAuthStore();
  const [lastInput, setLastInput] = useState("");
  const navigate = useNavigate();

  /* 탈퇴 버튼 눌렀을 때 실행되는 함수임. */
  const exit = async (lastInput) => {
    if (!lastInput || lastInput.trim() === "") {
      await Swal.fire({
        title: "비밀번호를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    try {
      const authRes = await axios.post(`${import.meta.env.VITE_BACKSERVER}/members/checkauth`, {
        memberId: memberId,
        memberPw: lastInput,
      });

      if (!authRes.data) {
        await Swal.fire({
          title: "비밀번호가 일치하지 않습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      const confirmResult = await Swal.fire({
        title: "정말로 회원탈퇴하시겠습니까?",
        icon: "question",
        text: "탈퇴한 후에는 현재 아이디는 복구하지 못합니다.",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      const leaveRes = await axios.patch(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}/leave`);

      if (leaveRes.data === 1) {
        await Swal.fire({
          title: "성공적으로 탈퇴하셨습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        logout();
        navigate("/");
      } else {
        await Swal.fire({
          title: "탈퇴 처리에 실패했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    } catch (err) {
      console.log(err);
      await Swal.fire({
        title: "서버 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
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
            <button type="submit" className={styles.dangerButton}>
              탈퇴하기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default LeaveMember;
