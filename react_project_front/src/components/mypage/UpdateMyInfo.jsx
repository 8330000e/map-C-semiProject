import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UpdateMyInfo.module.css";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import EmailAuth from "../../components/emailauth/EmailAuth";
import Swal from "sweetalert2";

const UpdateMyInfo = () => {
  // 로그인한 회원의 아이디와 닉네임 저장 함수를 전역 상태에서 가져옴.
  const { memberId, setNickname } = useAuthStore();
  const navigate = useNavigate();
  // 수정 폼에서 사용할 입력값 상태임.
  const [sendForm, setSendForm] = useState({
    memberId: memberId,
    memberName: "",
    memberNickname: "",
    memberEmail: "",
  });

  // 컴포넌트가 렌더링될 때 서버에서 회원 기본 정보를 가져와서 폼에 채움.
  useEffect(() => {
    if (!memberId) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        const member = res.data || {};
        setSendForm((prev) => ({
          ...prev,
          memberName: member.memberName || "",
          memberNickname: member.memberNickname || "",
          memberEmail: member.memberEmail || "",
        }));
      })
      .catch((err) => {
        console.log("회원 정보 로드 실패", err);
      });
  }, [memberId]);

  // 수정 버튼을 누르면 서버에 변경 내용을 전송함.
  const sendData = () => {
    const payload = {
      memberId: sendForm.memberId,
      memberNickname: sendForm.memberNickname,
      memberEmail: sendForm.memberEmail,
    };

    axios
      .patch(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`, payload)
      .then((res) => {
        if (res.data === 1) {
          // 업데이트 성공 시 전역 상태의 닉네임도 갱신함.
          setNickname(sendForm.memberNickname);
          Swal.fire({
            title: "수정성공",
            text: "수정이 정상적으로 처리되었습니다.",
            icon: "success",
          }).then(() => {
            navigate("/");
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
      {/* 화면 상단 타이틀 영역 */}
      <div className={styles.updatemyinfo_title_wrap}>
        <h3>내 정보 수정</h3>
      </div>
      <div className={styles.updatemuinfo_primary_wrap}>
        <div className={styles.updatemyinfo_content_wrap}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendData();
            }}
          >
            {/* 아이디는 읽기 전용으로만 보여줌 */}
            <label htmlFor="updateId">아이디</label>
            <input id="updateId" readOnly value={memberId || ""} />

            {/* 이름도 변경 불가이며 화면에만 표시함 */}
            <label htmlFor="updateName">이름</label>
            <input
              id="updateName"
              name="memberName"
              value={sendForm.memberName}
              readOnly
            />

            <p className={styles.readonlyNotice}>
              아이디, 이름, 이메일은 보안 정책상 변경할 수 없습니다.
            </p>

            {/* 닉네임은 수정 가능한 입력 필드임 */}
            <label htmlFor="updateNickname">닉네임</label>
            <input
              id="updateNickname"
              name="memberNickname"
              value={sendForm.memberNickname}
              onChange={(e) => {
                setSendForm({
                  ...sendForm,
                  memberNickname: e.target.value,
                });
              }}
            />

            {/* 이메일 인증 컴포넌트로 이메일을 보여주고 인증 관련 UI를 유지함. 이메일은 읽기 전용으로 처리됨. */}
            <EmailAuth
              memberEmail={sendForm.memberEmail}
              setMemberEmail={(email) => {
                setSendForm({ ...sendForm, memberEmail: email });
              }}
              onVerified={() => {}}
              readOnlyEmail
            />

            {/* 수정 버튼 */}
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
