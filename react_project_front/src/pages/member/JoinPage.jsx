import styles from "./Join.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EmailAuth from "../../components/emailauth/EmailAuth";

const Join = () => {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 여부 상태
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

    //이메일 인증을 하지 않으면 여기서 차단.
    if (!emailVerified) {
      Swal.fire({
        title: "이메일 인증이 필요합니다",
        text: "이메일 인증을 완료해주세요",
        icon: "warning",
      });
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members`, member)
      .then((res) => {
        console.log(res.data);
        navigate("/members/login");
      })
      .catch((err) => {
        console.log(err);
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

        {/*이메일 인증 */}
        <EmailAuth
          //배열 집어넣지 않도록 주의!!
          memberEmail={member.memberEmail}
          setMemberEmail={(email) =>
            setMember({ ...member, memberEmail: email })
          }
          onVerified={setEmailVerified}
        ></EmailAuth>

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
