import { useEffect, useState } from "react";
import styles from "./UpdateMyInfo.module.css";
import axios from "axios";
import MyInformation from "./MyInformation";
import useAuthStore from "../../store/useAuthStore.js";
import { Input } from "../ui/Form";
// import { Button } from "../ui/Button";

const UpdateMyInfo = () => {
  const { memberId } = useAuthStore();
  const [updateEmailSt, setUpdateEmailSt] = useState("");
  const [updateNameSt, setUpdateNameSt] = useState("");
  const [updateNicknameSt, setUpdateNicknameSt] = useState("");
  const [sendForm, setSendForm] = useState({
    memberId: memberId,
    memberName: "",
    memberNickname: "",
    memberEmail: "",
  });
  const sendData = () => {
    // console.log(sendForm);
    // console.log(updateEmailSt);
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`, sendForm)
      .then((res) => {
        console.log(res.data);
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
              setSendForm({
                ...sendForm,
                memberName: updateNameSt,
                memberNickname: updateNicknameSt,
                memberEmail: updateEmailSt,
              });
              sendData();
            }}
          >
            <label htmlFor="updateId">아이디</label>
            <Input id="updateId" readOnly value={memberId} />
            <label htmlFor="updateName">실명</label>
            <Input
              id="updateName"
              name="memberName"
              value={updateNameSt}
              onChange={(e) => {
                const value = e.target.value;
                //  const name= e.target.name;
                setUpdateNameSt(value);
              }}
            />
            <label htmlFor="updateNickname">별명</label>
            <Input
              id="updateNickname"
              name="memberNickname"
              value={updateNicknameSt}
              onChange={(e) => {
                const nickname = e.target.value;
                setUpdateNicknameSt(nickname);
              }}
            />
            <label htmlFor="updateEmail">이메일</label>
            <Input
              id="updateEmail"
              name="memberEmail"
              value={updateEmailSt}
              onChange={(e) => {
                const email = e.target.value;
                setUpdateEmailSt(email);
              }}
            />
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
