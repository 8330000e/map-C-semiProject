import styles from "./Join.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Join = () => {
  // 페이지 이동 함수 가져오기 (React Router)
  const navigate = useNavigate();

  // 입력값 상태 저장 (회원가입 폼)
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberNickname: "",
    memberEmail: "",
  });

  // 폼 입력 값이 바뀔 때 상태 업데이트
  const inputMember = (e) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value,
    });
    console.log(name, value); // 개발용 디버그 로그
  };

  const JoinMember = (e) => {
    e.preventDefault();

    console.log("가입 요청 전 상태:", member); // ← 회원가입 버튼 눌렀을 때 상태 확인

    const BACKSERVER = import.meta.env.VITE_BACKSERVER;
    if (!BACKSERVER) {
      console.error("VITE_BACKSERVER 환경변수가 설정되지 않았습니다.");
      alert("서버 요청 실패: VITE_BACKSERVER를 .env에 설정해주세요.");
      return;
    }

    // 회원가입 요청을 서버로 전달하는 부분
    axios
      .post(`${BACKSERVER}/members`, member)
      .then((res) => {
        console.log("회원가입 응답:", res.data);
        navigate("/members/login"); // 회원가입 후 로그인 페이지로 이동
      })
      .catch((err) => {
        console.error("회원가입 에러:", err);
        alert("회원가입 실패: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className={styles.join_wrap}>
      <h3 className="page-title">회원가입</h3>
      <form onSubmit={JoinMember}>
        <div className={styles.input_wrap}>
          <label>아이디</label>
          <input
            type="text"
            name="memberId"
            value={member.memberId}
            onChange={inputMember}
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <label>비밀번호</label>
          <input
            type="password"
            name="memberPw"
            value={member.memberPw}
            onChange={inputMember}
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <label>이름</label>
          <input
            type="text"
            name="memberName"
            value={member.memberName}
            onChange={inputMember}
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <label>닉네임</label>
          <input
            type="text"
            name="memberNickname"
            value={member.memberNickname}
            onChange={inputMember}
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <label>이메일</label>
          <input
            type="text"
            name="memberEmail"
            value={member.memberEmail}
            onChange={inputMember}
          ></input>
        </div>

        <div className={styles.member_button_wrap}>
          <button type="submit" className="btn primary">
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
};
export default Join;
