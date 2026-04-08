import styles from "./ResetPw.module.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ResetPw = () => {
  const navigate = useNavigate();

  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
  });
  const [memberPwRe, setMemberPwRe] = useState("");
  const [checkPw, setCheckPw] = useState(0); //비밀번호 일치 여부 상태
  //0: 초기 상태 (아무것도 입력되지 않음), 1: 비밀번호 일치, 2: 비밀번호 불일치

  //비밀번호 재설정 요청 함수
  const requestResetPw = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    //왜냐하면 form submit의 성격상 버튼 클릭시 먼저 얘가 수행되면
    //페이지 새로고침이 이루어짐. 그래서 방지 코드를 넣어줘야 함.

    if (checkPw !== 1) {
      Swal.fire({
        title: "비밀번호가 일치하지 않습니다",
        icon: "warning",
      });
      return;
    }

    console.log("보내는 데이터:", member);

    //비밀번호 재설정 요청 로직 구현 (예: API 호출)
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/reset-pw`, {
        memberId: member.memberId,
        memberPw: member.memberPw,
      })
      .then((res) => {
        console.log("비밀번호 재설정 성공:", res.data);
        //비밀번호 재설정 성공 시 처리 (예: 성공 메시지 표시, 로그인 페이지로 이동 등)
        Swal.fire({
          title: "비밀번호 재설정 성공",
          text: "비밀번호가 성공적으로 변경되었습니다. 로그인 페이지로 이동합니다.",
          icon: "success",
          confirmButtonText: "확인",
        }).then(() => {
          // 로그인 페이지로 이동
          navigate("/members/login");
        });
      })
      .catch((err) => console.error("비밀번호 재설정 실패:", err));
  };

  const handleNewPwChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
    setCheckPw(!memberPwRe ? 0 : e.target.value === memberPwRe ? 1 : 2);
  };

  const handleRePwChange = (e) => {
    setMemberPwRe(e.target.value); //재입력값 state에 저장
    setCheckPw(
      //e.target.value는 비밀번호 재입력값, memberPwRe는 비밀번호 입력값
      //비밀번호 재입력값이 없으면 0, 비밀번호 입력값과 재입력값이 같으면 1, 다르면 2
      !member.memberPw ? 0 : e.target.value === member.memberPw ? 1 : 2,
    );
  };

  return (
    <div className={styles.reset_pw_wrap}>
      <h1 className="page-title">비밀번호 변경 페이지</h1>
      <form>
        <div className={styles.input_wrap}>
          <label htmlFor="memberId">아이디</label>
          <input
            type="text"
            name="memberId"
            value={member.memberId}
            onChange={(e) => setMember({ ...member, memberId: e.target.value })}
            placeholder="아이디 입력"
          />
        </div>

        {/* 변경할 비밀번호 */}
        <div className={styles.input_wrap}>
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="memberPw"
            name="memberPw"
            value={member.memberPw}
            onChange={handleNewPwChange}
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>
        {/* 비밀번호 재입력 
          데이터베이스로부터 입력에 따라 값이 변하는 구조라면 
          memberPwRe가 맞지만, 이건 단지 비밀번호 일치 확인용이기 떄문에
          confirmPassword로 이름을 지어줘도 크게 상관없음     
        */}

        <div className={styles.input_wrap}>
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={memberPwRe}
            onChange={handleRePwChange}
            placeholder="비밀번호를 다시 입력하세요"
          />
        </div>
        {/* 비밀번호 일치 여부 메시지 */}

        {checkPw === 1 && (
          <span style={{ color: "green" }}>비밀번호가 일치합니다</span>
        )}
        {checkPw === 2 && (
          <span style={{ color: "red" }}>비밀번호가 일치하지 않습니다</span>
        )}

        <button type="submit" onClick={requestResetPw}>
          비밀번호 변경
        </button>
      </form>
    </div>
  );
};
export default ResetPw;
