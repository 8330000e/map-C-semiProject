import axios from "axios";
import EmailAuth from "../../components/emailauth/EmailAuth";
import styles from "./FindId.module.css";
import { useState } from "react";
import Swal from "sweetalert2";

const FindId = () => {
  const [memberEmail, setMemberEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const handleFindId = () => {
    // 이메일 인증이 완료된 상태에서 아이디 찾기 로직을 수행
    if (!emailVerified) {
      Swal.fire({
        title: "이메일 인증이 필요합니다",
        text: "이메일 인증을 완료해주세요",
        icon: "warning",
      });
      return;
    }
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/find-id`, {
        memberEmail,
      })
      .then((res) => {
        console.log("아이디 찾기 성공:", res.data);
        Swal.fire({
          title: "아이디 찾기 성공",
          text: "아이디가 이메일로 전송되었습니다",
          icon: "success",
        });
      })
      .catch((err) => {
        console.error("아이디 찾기 실패:", err);
        // 아이디 찾기 실패 시 처리 (예: 에러 메시지 표시)
        Swal.fire({
          title: "아이디 찾기 실패",
          text: "아이디를 찾을 수 없습니다. 이메일을 확인해주세요.",
          icon: "error",
        });
      });
  };

  return (
    <div className={styles.find_id_wrap}>
      <h1 className="page-title">아이디 찾기 페이지</h1>
      {/*
      이메일 인증 컴포넌트에서 이메일 인증이 완료되면 setEmailVerified(true)로
      상태 변경
      */}

      <EmailAuth
        memberEmail={memberEmail}
        //아이디찾기에서는 업데이트가 아니고 단순히 이메일 인증이기 때문에
        //setMember({ ...member, memberEmail: email })이런식으로 안 해도 됨.
        //즉 이메일이 업데이트 되었을 때 다른 정보는 건드리지 말고 이메일 정보만 업데이트 해주게 할 필요가 없음.
        setMemberEmail={setMemberEmail}
        onVerified={setEmailVerified}
      ></EmailAuth>
      <div>
        {/*disabled={!emailVerified}
          이메일 인증이 끝난 이후 아이디 찾기 버튼 누르게 하기를 하려고 했으나
          그게 아니라 이메일 인증이 끝나면 자동으로 회원 아이디가 조회되게 하기 
          하나의 새로운 페이지로 이동하게 하거나 혹은 팜업창을 뜨게 할 수도 있음.
        */}
        <button type="button" onClick={handleFindId} disabled={!emailVerified}>
          아이디 찾기
        </button>
      </div>
    </div>
  );
};
export default FindId;
