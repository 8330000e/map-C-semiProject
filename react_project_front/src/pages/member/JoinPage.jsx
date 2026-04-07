import styles from "./Join.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EmailAuth from "../../components/emailauth/EmailAuth";
import { useEffect } from "react";

const Join = () => {
  // 페이지 이동 함수 가져오기 (React Router)
  const navigate = useNavigate();

  const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 여부 상태

  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberNickname: "",
    memberEmail: "",
  });

  //비밀번호 확인칸에 입력한 값이 일치하는지 다시 확인하는 useState
  //위에 미리 설정한 memberPw와 비교하기 위해 만드는 거임
  //사용자가 ‘비밀번호 다시 입력’ 칸에 쓴 값 저장하는 변수
  const [memberPwRe, setMemberPwRe] = useState("");
  //아이디를 중복 검사 하는 것
  //이 아이디 써도 되는지 결과 저장하는 변수
  const [checkId, setCheckId] = useState(0);
  //비밀번호 일치여부 상태를 확인 하는 것
  const [checkPw, setCheckPw] = useState(0);

  //아이디 중복 체크
  const ipDupCheck = () => {
    if (!member.memberId) return;
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/members/exists?memberId=${member.memberId}`,
      )
      .then((res) => {
        setCheckId(res.data ? 2 : 1);
      })
      .catch((err) => console.log(err));
  };

  // 비밀번호 일치 체크
  useEffect(() => {
    if (!memberPwRe) {
      setCheckPw(0);
      return;
    }
    setCheckPw(member.memberPw === memberPwRe ? 1 : 2);
  }, [memberPwRe, member.memberPw]);

  const inputMember = (e) => {
    const { name, value } = e.target;

    //이메일 입력시 이메일 인증 상태 초기화
    if (name === "memberEmail") {
      //false가 초기화라는 증거
      setEmailVerified(false);
    }

    setMember({
      ...member,
      [name]: value,
    });
    console.log(name, value); // 개발용 디버그 로그
  };

  const JoinMember = (e) => {
    e.preventDefault();

    // 아이디 중복 체크, 비밀번호 일치 여부, 이메일 인증 여부, 필수 입력값 체크 등 모든 검증 통과 여부 확인
    if (checkId !== 2) {
      Swal.fire({
        title: "아이디 중복 검사를 해주세요",
        icon: "warning",
      });
      return;
    }

    // 비밀번호 일치 여부 체크
    if (checkPw !== 1) {
      Swal.fire({
        title: "비밀번호가 일치하지 않습니다",
        icon: "warning",
      });
      return;
    }

    //이메일 인증을 하지 않으면 여기서 차단.
    if (!emailVerified) {
      Swal.fire({
        title: "이메일 인증이 필요합니다",
        text: "이메일 인증을 완료해주세요",
        icon: "warning",
      });
      return;
    }

    if (!member.memberId || !member.memberPw || !member.memberEmail) {
      Swal.fire({
        title: "필수 입력 항목을 모두 채워주세요",
        text: "아이디, 비밀번호, 이메일은 필수입니다",
        icon: "warning",
      });
      return;
    }

    const BACKSERVER = import.meta.env.VITE_BACKSERVER;
    if (!BACKSERVER) {
      console.error("VITE_BACKSERVER 환경변수가 설정되지 않았습니다.");
      alert("서버 요청 실패: VITE_BACKSERVER를 .env에 설정해주세요.");
      return;
    }

    // 회원가입 요청을 서버로 전달하는 부분
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members`, member)
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          title: "회원가입 성공",
          text: "로그인 페이지로 이동합니다",
          icon: "success",
        }).then(() => {
          navigate("/members/login");
        });
      })
      .catch((err) => {
        console.error("회원가입 에러:", err);
        alert("회원가입 실패: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className={styles.join_wrap}>
      <h3 className="page-title">회원가입</h3>
      <form onSubmit={JoinMember}>
        <div className={styles.input_wrap}>
          <label htmlFor="memberId">아이디</label>
          <input
            type="text"
            name="memberId"
            id="memberId"
            value={member.memberId}
            onChange={inputMember}
            onBlur={ipDupCheck}
          ></input>
          {checkId > 0 && (
            <p
              className={
                checkId === 2
                  ? styles.check_msg
                  : `${styles.check_msg} ${styles.invalid}`
              }
            >
              {checkId === 2
                ? "사용 가능한 아이디입니다."
                : "이미 사용중인 아이디입니다."}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={styles.input_wrap}>
          <label htmlFor="memberPw">비밀번호</label>
          <input
            type="password"
            name="memberPw"
            id="memberPw"
            value={member.memberPw}
            onChange={inputMember}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.input_wrap}>
          <label htmlFor="memberPwRe">비밀번호 확인</label>
          <input
            type="password"
            name="memberPwRe"
            id="memberPwRe"
            value={memberPwRe}
            onChange={(e) => setMemberPwRe(e.target.value)}
          />
          {checkPw > 0 && (
            <p
              className={
                checkPw === 1
                  ? styles.check_msg
                  : `${styles.check_msg} ${styles.invalid}`
              }
            >
              {checkPw === 1
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        <div className={styles.input_wrap}>
          <label>이름</label>
          <input
            type="text"
            name="memberName"
            id="memberName"
            value={member.memberName}
            onChange={inputMember}
          ></input>
        </div>

        <div className={styles.input_wrap}>
          <label>닉네임</label>
          <input
            type="text"
            name="memberNickname"
            id="memberNickname "
            value={member.memberNickname}
            onChange={inputMember}
          ></input>
        </div>

        {/*이메일 인증 */}
        {/*이메일 인증 컴포넌트에서 이메일 인증이 완료되면 
        setEmailVerified(true)로 상태 변경*/}

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
