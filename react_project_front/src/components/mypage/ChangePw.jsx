import { useState } from "react";
import styles from "./ChangePw.module.css";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";

const ChangePw = () => {
  const { memberId } = useAuthStore();
  const [isAuth, setIsAuth] = useState(false);
  const [checkAuth, setCheckAuth] = useState({
    memberId: memberId,
    memberPw: "",
  });

  const [newPw, setNewPw] = useState("");
  const [checkNewPw, setCheckNewPw] = useState("");
  const checkPw = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/checkauth`, checkAuth)
      .then((res) => {
        console.log(res.data);
        setIsAuth(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateNewPw = () => {
    const newCheckAuth = {
      memberId: memberId,
      memberPw: newPw,
    };

    console.log(newCheckAuth);
    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/members/newpw`, newCheckAuth)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className={styles.changepw_wrap}>
        <h3>비빌번호 변경</h3>
        {isAuth ? (
          <p>인증되었습니다.</p>
        ) : (
          <>
            <label htmlFor="checkMemberPw">
              현재 사용하고 있는 비밀번호 입력
            </label>
            <input
              type="password"
              id="checkMemberPw"
              name="memberPw"
              onChange={(e) => {
                setCheckAuth({ ...checkAuth, [e.target.name]: e.target.value });
              }}
            />
            <button type="button" onClick={checkPw}>
              인증
            </button>
          </>
        )}
        {isAuth ? (
          <div>
            <label htmlFor="newMemberPw">새 비밀번호 입력</label>
            <input
              type="password"
              id="newMemberPw"
              value={newPw}
              onChange={(e) => {
                setNewPw(e.target.value);
              }}
            />
            <label htmlFor="newPwIsTrue">새비밀번호 확인</label>
            <input
              type="password"
              id="newPwIsTrue"
              value={checkNewPw}
              onChange={(e) => {
                setCheckNewPw(e.target.value);
              }}
            />
            {newPw === checkNewPw && (
              <button type="button" onClick={updateNewPw}>
                변경
              </button>
            )}
          </div>
        ) : (
          <p>비밀번호 인증 필요</p>
        )}
      </div>
    </>
  );
};
export default ChangePw;
