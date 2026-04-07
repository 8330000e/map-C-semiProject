import styles from "./FindPw.module.css";
import { useState } from "react";
import EmailAuth from "../../components/emailauth/EmailAuth";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FindPw = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const verifyUser = () => {
    // 아이디와 이메일이 입력되었는지 확인
    if (!memberId || !memberEmail) {
      Swal.fire({
        title: "아이디와 이메일을 입력하세요",
        icon: "warning",
      });
      return;
    }

    // 이메일 인증 안했으면 차단
    if (!emailVerified) {
      Swal.fire({
        title: "이메일 인증이 필요합니다",
        text: "이메일 인증을 완료해주세요",
        icon: "warning",
      });
      return;
    }

    // axios 요청
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/find-pw`, {
        memberId,
        //백엔드 controller에서 이메일 전송을 통한 로직이 있기 떄문에 memberEmail도 같이 보내야 함
        memberEmail,
      })
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          title: "이메일을 확인해 주세요.",
          text: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
          icon: "success",
        }).then(() => {
          // 인증메시지 보낸 후 로그인 페이지로 이동
          navigate("/members/login");
        });
      })
      .catch((err) => {
        console.error("사용자 존재 여부 확인 실패:", err);
        Swal.fire({
          title: "사용자를 찾을 수 없습니다",
          text: "입력하신 아이디와 이메일이 존재하지 않습니다. 다시 확인해주세요.",
          icon: "error",
        });
      });
  };

  return (
    <div className={styles.find_pw_wrap}>
      <h1 className="page-title">비밀번호 찾기 페이지</h1>
      <div className={styles.input_wrap}>
        <label>아이디</label>
        <input
          type="text"
          value={memberId}
          id="memberId"
          onChange={(e) => setMemberId(e.target.value)}
          placeholder="아이디를 입력해주세요"
        ></input>

        <EmailAuth
          memberEmail={memberEmail}
          setMemberEmail={setMemberEmail}
          onVerified={setEmailVerified}
        ></EmailAuth>
      </div>
      {/*
      
      //verifyUser 함수는 이메일 인증과 아이디, 이메일 입력 여부를 체크하는
    //프런트 검증 함수      
      */}
      <button type="button" onClick={verifyUser} disabled={!emailVerified}>
        비밀번호 찾기
      </button>
    </div>
  );
};
export default FindPw;
