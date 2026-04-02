import styles from "./Join.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberNickname: "",
    memberEmail: "",
  });

  const inputMember = (e) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value,
    });
    console.log(name, value);
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

    axios
      .post(`${BACKSERVER}/members`, member)
      .then((res) => {
        console.log(res.data);
        navigate("/members/login");
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
