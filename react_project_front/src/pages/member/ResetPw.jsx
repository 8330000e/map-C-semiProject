import styles from "./ResetPw.module.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { errorAlert, successAlert } from "../../utils/alert";

const ResetPw = () => {
  const navigate = useNavigate();

  //props => 부모객체 member에게서 꺼내욤.
  //-> memberId와 memberPw를
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
  });
  //useState-> 객체에게서 꺼네 온다기 보다는 버튼이나 input에서 입력으로
  //변하는 값을 저장하고 변화를 주는 상태변화를 하게 하는 함수 지정
  const [memberPwRe, setMemberPwRe] = useState("");
  const [checkPw, setCheckPw] = useState(0); //비밀번호 일치 여부 상태
  //0: 초기 상태 (아무것도 입력되지 않음), 1: 비밀번호 일치, 2: 비밀번호 불일치

  //비밀번호 재설정 요청 함수
  const requestResetPw = async (e) => {
    e.preventDefault();

    if (checkPw !== 1) {
      await errorAlert("비밀번호 불일치", "비밀번호가 일치하지 않습니다");
      return;
    }

    console.log("보내는 데이터:", member);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/members/reset-pw`,
        {
          memberId: member.memberId,
          memberPw: member.memberPw,
        },
      );

      console.log("비밀번호 재설정 성공:", res.data);

      await successAlert(
        "비밀번호 재설정 성공",
        "비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.",
      );

      navigate("/members/login");
    } catch (err) {
      console.error("비밀번호 재설정 실패:", err);

      await errorAlert("비밀번호 재설정 실패", "다시 시도해주세요.");
    }
  };

  const handleNewPwChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
    setCheckPw(!memberPwRe ? 0 : e.target.value === memberPwRe ? 1 : 2);
  };

  const handleRePwChange = (e) => {
    setMemberPwRe(e.target.value); //재입력값 state에 저장
    setCheckPw(
      //e.target.value는 비밀번호 재입력값, memberPwRe는 비밀번호 입력값
      //비밀번호 재입력값이 없으면 0, 비밀번호 입력값과 재입력값이 같으면 1, 다르면 2
      !member.memberPw ? 0 : e.target.value === member.memberPw ? 1 : 2,
    );
  };

  return (
    <div className={`${styles.total_reset_pw_container} login_page`}>
      <div className={styles.btn_group}>
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
      </div>

      <div className={styles.reset_pw_wrap}>
        <h1 className={styles.page_title}>비밀번호 변경 페이지</h1>
        <form>
          <div className={styles.input_wrap}>
            <label htmlFor="memberId" className={styles.label_id}>
              아이디
            </label>
            <input
              type="text"
              name="memberId"
              value={member.memberId}
              className={styles.input_id}
              onChange={(e) =>
                setMember({ ...member, memberId: e.target.value })
              }
              placeholder="아이디 입력"
            />
          </div>

          {/* 변경할 비밀번호 */}
          <div className={styles.input_wrap}>
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="memberPw"
              name="memberPw"
              value={member.memberPw}
              className={styles.input_pw}
              onChange={handleNewPwChange}
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>
          {/* 비밀번호 재입력 
          데이터베이스로부터 입력에 따라 값이 변하는 구조라면 
          memberPwRe가 맞지만, 이건 단지 비밀번호 일치 확인용이기 떄문에
          confirmPassword로 이름을 지어줘도 크게 상관없음     
        */}

          <div className={styles.input_wrap}>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={memberPwRe}
              className={styles.input_repw}
              onChange={handleRePwChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          {/* 비밀번호 일치 여부 메시지 */}

          {checkPw === 1 && (
            <span style={{ color: "green" }}>비밀번호가 일치합니다</span>
          )}
          {checkPw === 2 && (
            <span style={{ color: "red" }}>비밀번호가 일치하지 않습니다</span>
          )}

          <button
            type="submit"
            className={styles.reset_pw_btn}
            onClick={requestResetPw}
          >
            비밀번호 변경
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPw;
