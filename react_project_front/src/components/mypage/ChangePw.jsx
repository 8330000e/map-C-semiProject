import { useState } from "react";
import styles from "./ChangePw.module.css";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ChangePw = () => {
  // 페이지 이동을 위해 react-router의 navigate 사용함.
  const navigate = useNavigate();
  // 현재 로그인한 회원 ID와 로그아웃 함수 가져옴.
  const { memberId, logout } = useAuthStore();

  // 현재 비밀번호 인증 여부 상태임.
  // false면 새 비밀번호 입력창이 비활성화됨.
  const [isAuth, setIsAuth] = useState(false);

  // 서버에 보낼 현재 비밀번호 정보 저장 상태임.
  const [checkAuth, setCheckAuth] = useState({
    memberId: memberId,
    memberPw: "",
  });

  // 새 비밀번호와 확인 비밀번호 입력 상태임.
  const [newPw, setNewPw] = useState("");
  const [checkNewPw, setCheckNewPw] = useState("");

  // 현재 비밀번호를 서버에 보내서 인증 처리함.
  // 인증이 성공하면 isAuth 상태가 true가 됨.
  const checkPw = () => {
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/checkauth`, checkAuth)
      .then((res) => {
        setIsAuth(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 새 비밀번호로 변경 요청을 서버에 보냄.
  // 성공하면 로그아웃 처리 후 로그인 페이지로 이동함.
  const updateNewPw = () => {
    const newCheckAuth = {
      memberId: memberId,
      memberPw: newPw,
    };

    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/members/newpw`, newCheckAuth)
      .then((res) => {
        if (res.data === 1) {
          setNewPw("");
          setCheckNewPw("");
          setCheckAuth({ ...checkAuth, memberPw: "" });
          Swal.fire({
            title: "비밀번호 변경 완료",
            text: "새 비밀번호가 정상적으로 설정되었습니다.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              logout();
              navigate(`/members/login`);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 새 비밀번호와 확인 비밀번호가 일치하는지 확인함.
  const isPasswordMatch = newPw !== "" && newPw === checkNewPw;

  return (
    <div className={styles.changepw_wrap}>
      <div className={styles.changepw_header}>
        <h3>비밀번호 변경</h3>
        <p>현재 비밀번호 확인 후 새 비밀번호를 안전하게 변경합니다.</p>
      </div>

      {/* 1단계: 현재 비밀번호 확인 영역 */}
      <div className={styles.changepw_section}>
        <div className={styles.changepw_section_title}>1. 현재 비밀번호 확인</div>
        <div className={styles.changepw_row}>
          <label htmlFor="checkMemberPw">현재 비밀번호</label>
          <div className={styles.changepw_input_group}>
            <input
              type="password"
              id="checkMemberPw"
              name="memberPw"
              value={checkAuth.memberPw}
              onChange={(e) => {
                setCheckAuth({
                  ...checkAuth,
                  [e.target.name]: e.target.value,
                });
              }}
              placeholder="현재 비밀번호를 입력하세요"
            />
            <button
              type="button"
              className={styles.authButton}
              onClick={checkPw}
              disabled={!checkAuth.memberPw}
            >
              인증
            </button>
          </div>
          <div className={styles.statusText}>
            {isAuth ? (
              <span className={styles.successText}>인증 완료</span>
            ) : (
              <span className={styles.infoText}>인증이 필요합니다.</span>
            )}
          </div>
        </div>
      </div>

      {/* 2단계: 새 비밀번호 입력 영역 */}
      <div className={styles.changepw_section}>
        <div className={styles.changepw_section_title}>2. 새 비밀번호 입력</div>
        <div className={styles.changepw_row}>
          <label htmlFor="newMemberPw">새 비밀번호</label>
          <input
            type="password"
            id="newMemberPw"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
            disabled={!isAuth}
          />
        </div>
        <div className={styles.changepw_row}>
          <label htmlFor="newPwIsTrue">비밀번호 확인</label>
          <input
            type="password"
            id="newPwIsTrue"
            value={checkNewPw}
            onChange={(e) => setCheckNewPw(e.target.value)}
            placeholder="새 비밀번호를 다시 입력하세요"
            disabled={!isAuth}
          />
        </div>
        <div className={styles.passwordHint}>
          안전한 비밀번호를 사용하세요.
        </div>
        {isAuth && newPw && checkNewPw && (
          <div className={styles.matchText}>
            {isPasswordMatch ? (
              <span className={styles.successText}>비밀번호가 일치합니다.</span>
            ) : (
              <span className={styles.errorText}>비밀번호가 일치하지 않습니다.</span>
            )}
          </div>
        )}
      </div>

      {/* 변경 버튼 영역 */}
      <div className={styles.changepw_button_wrap}>
        <button
          type="button"
          onClick={updateNewPw}
          disabled={!isAuth || !isPasswordMatch}
        >
          비밀번호 변경하기
        </button>
      </div>
    </div>
  );
};
export default ChangePw;
