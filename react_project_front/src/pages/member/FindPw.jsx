import styles from "./FindPw.module.css";
import { useState } from "react";
import EmailAuth from "../../components/emailauth/EmailAuth";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { errorAlert, successAlert } from "../../utils/alert";

const FindPw = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const verifyUser = async () => {
    // 아이디와 이메일이 입력되었는지 확인
    if (!memberId || !memberEmail) {
      await errorAlert("입력 오류", "아이디와 이메일을 입력하세요");
      return;
    }

    // 이메일 인증 안했으면 차단
    if (!emailVerified) {
      await successAlert("인증 완료", "이메일 인증이 완료된 상태입니다.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/members/find-pw`,
        {
          memberId,
          memberEmail,
        },
      );

      console.log(res.data);

      await successAlert("이메일 전송 완료", "이메일을 확인해주세요");

      navigate("/members/login");
    } catch (err) {
      console.error("사용자 존재 여부 확인 실패:", err);

      await errorAlert(
        "사용자를 찾을 수 없습니다",
        "입력하신 아이디와 이메일이 존재하지 않습니다.",
      );
    }
  };

  return (
    <div className={`${styles.total_find_pw_container} login_page`}>
      {/*홈으로 가기 버튼 */}
      <div
        className={styles.home_btn}
        onClick={() => {
          navigate("/");
        }}
      >
        홈으로 가기
      </div>

      {/*로그인으로 가기 버튼 */}
      <div
        className={styles.login_btn}
        onClick={() => {
          navigate("/members/login");
        }}
      >
        로그인으로 가기
      </div>

      <div className={styles.find_pw_wrap}>
        <h1 className={styles.page_title}>비밀번호 찾기 페이지</h1>
        <div className={styles.input_wrap}>
          <label className={styles.label_id}>아이디</label>
          <input
            className={styles.input_id}
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
        <button
          type="button"
          className={styles.find_pw_btn}
          onClick={verifyUser}
          disabled={!emailVerified}
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
};
export default FindPw;
