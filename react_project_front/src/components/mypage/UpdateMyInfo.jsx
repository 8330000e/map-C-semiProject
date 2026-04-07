import { useEffect, useState } from "react";
import styles from "./UpdateMyInfo.module.css";
import axios from "axios";
import MyInformation from "./MyInformation";
import useAuthStore from "../../store/useAuthStore";
import EmailAuth from "../../components/emailauth/EmailAuth";
import Swal from "sweetalert2";

const UpdateMyInfo = () => {
  const { memberId, isReady } = useAuthStore();
  // const [updateEmailSt, setUpdateEmailSt] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [updateNameSt, setUpdateNameSt] = useState("");
  const [updateNicknameSt, setUpdateNicknameSt] = useState("");

  const [sendForm, setSendForm] = useState({
    memberId: memberId,
    memberName: "",
    memberNickname: "",
    memberEmail: "",
  });
  const sendData = () => {
    console.log(sendForm);
    // console.log(updateEmailSt);
    if (
      sendForm.memberName ||
      sendForm.memberNickname ||
      sendForm.memberEmail
    ) {
      return;
    }
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`, sendForm)
      .then((res) => {
        console.log(res.data);
        if (res.data === 1) {
          setSendForm({
            ...sendForm,
            memberName: "",
            memberNickname: "",
            memberEmail: "",
          });
          Swal.fire({
            title: "수정성공",
            text: "수정이 정상적으로 처리되었습니다.",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "문제발생",
            text: "내부 서버오류",
            icon: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.updatemyinfo_main_content_wrap}>
      <div className={styles.updatemyinfo_title_wrap}>
        <h3>내 정보 수정</h3>
      </div>
      <div className={styles.updatemuinfo_primary_wrap}>
        <div className={styles.updatemyinfo_content_wrap}>
          <form
            onSubmit={(e) => {
              console.log(memberId);
              e.preventDefault();

              setUpdateNameSt("");
              setUpdateNicknameSt("");
              setMemberEmail("");
              sendData();
            }}
          >
            <label htmlFor="updateId">아이디</label>
            <input
              id="updateId"
              readOnly
              value={memberId + "(정보 반영하기는 마지막에 구현)"}
            />
            <label htmlFor="updateName">실명</label>
            <input
              id="updateName"
              name="memberName"
              value={sendForm.memberName}
              onChange={(e) => {
                const value = e.target.value;
                //  const name= e.target.name;
                setSendForm({ ...sendForm, memberName: e.target.value });
              }}
            />
            <label htmlFor="updateNickname">별명</label>
            <input
              id="updateNickname"
              name="memberNickname"
              value={sendForm.memberNickname}
              onChange={(e) => {
                const nickname = e.target.value;
                setSendForm({ ...sendForm, memberNickname: e.target.value });
              }}
            />
            {/* <label htmlFor="updateEmail">이메일</label>
            <input
              id="updateEmail"
              name="memberEmail"
              value={updateEmailSt}
              onChange={(e) => {
                const email = e.target.value;
                setUpdateEmailSt(email);
              }}
            /> */}
            <EmailAuth
              memberEmail={sendForm.memberEmail}
              setMemberEmail={(e) => {
                setSendForm({ ...sendForm, memberEmail: e });
              }}
              onVerified={setEmailVerified}
            ></EmailAuth>
            <div className={styles.updatemyinfo_btn_wrap}>
              <button type="submit">수정하기</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UpdateMyInfo;
