import styles from "./JoinPage.module.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EmailAuth from "../../components/emailauth/EmailAuth";
import { useEffect } from "react";
import { errorAlert, successAlert } from "../../utils/alert";
//import joinBg from "/images/signup-background-rabbit.png";
//import joinbg1 from "/images/join2jpg.jpg";

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

  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  //아이디 중복 체크
  const ipDupCheck = async () => {
    if (!member.memberId) {
      setCheckId(0); // 아이디 입력 없으면 초기화
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/members/exists?memberId=${member.memberId}`,
      );

      // res.data가 true면 중복된 아이디가 있음 -> 1 (사용불가)
      // res.data가 false면 아이디가 없음 -> 2 (사용가능)
      if (res.data === true) {
        setCheckId(1); // 중복됨
      } else {
        setCheckId(2); // 사용가능
      }

      console.log("중복 체크 결과:", res.data, "상태값:", res.data ? 1 : 2);
    } catch (err) {
      console.error("아이디 중복 체크 에러:", err);
      setCheckId(0);
    }
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

  //회원가입
  const JoinMember = async (e) => {
    e.preventDefault();

    // 중복 클릭 방지 체크
    if (isLoading) return;

    // 아이디 중복 체크, 비밀번호 일치 여부, 이메일 인증 여부, 필수 입력값 체크 등 모든 검증 통과 여부 확인
    if (!member.memberId) {
      await errorAlert("입력 누락", "아이디를 입력해주세요.");
      return;
    }

    if (checkId === 1) {
      await errorAlert("중복 아이디", "이미 사용 중인 아이디입니다.");
      return;
    }

    if (checkId === 0) {
      await errorAlert("중복 확인", "아이디 중복 검사를 진행해주세요.");
      return;
    }

    // 비밀번호 일치 여부 체크
    if (checkPw !== 1) {
      await errorAlert("비밀번호 일치", "비밀번호 일치 체크");
      return;
    }

    //이메일 인증을 하지 않으면 여기서 차단.
    if (!emailVerified) {
      await errorAlert("이메일 인증", "이메일 인증");
      return;
    }

    if (!member.memberId || !member.memberPw || !member.memberEmail) {
      await errorAlert("입력 오류", "아이디, 비밀번호, 이메일를 입력해주세요.");
      return;
    }

    const BACKSERVER = import.meta.env.VITE_BACKSERVER;
    if (!BACKSERVER) {
      await errorAlert("연결 오류", "서버 연결 오류");
      return;
    }

    setIsLoading(true); // 로딩 시작!
    // 회원가입 요청을 서버로 전달하는 부분
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/members`,
        member,
      );
      console.log("아이디 중복 체크 결과:", res.data);

      await successAlert("회원가입 성공", "로그인 페이지로 이동합니다");
      navigate("/members/login");
    } catch (err) {
      console.error("회원가입 에러:", err);
      const errMsg =
        err.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      await errorAlert("회원가입 중 오류", errMsg);
    } finally {
      // 성공해서 navigate로 떠나면 다행이지만,
      // 실패했을 경우엔 버튼을 다시 살려줘야 하므로 false 처리
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.total_join_container} login_page`}>
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

      <div className={styles.join_wrap}>
        <h3 className={styles.page_title}>회원가입</h3>
        <form onSubmit={JoinMember}>
          <div className={styles.input_wrap}>
            <label htmlFor="memberId">아이디</label>
            <input
              type="text"
              name="memberId"
              id="memberId"
              value={member.memberId}
              onChange={inputMember}
              className={styles.input_field}
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
              className={styles.input_field}
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
              className={styles.input_field}
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
              className={styles.input_field}
            ></input>
          </div>

          <div className={styles.input_wrap}>
            <label>닉네임</label>
            <input
              type="text"
              name="memberNickname"
              id="memberNickname"
              value={member.memberNickname}
              onChange={inputMember}
              className={styles.input_field}
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
            <button
              type="button"
              className={styles.join_btn}
              onClick={JoinMember}
              disabled={isLoading} // 로딩 중이면 클릭 차단!
            >
              {isLoading ? "처리 중..." : "회원가입"}
            </button>
          </div>
        </form>
      </div>
      {/* join_wrap 끝 */}
      {/*
            
      <img src={joinBg} className={styles.join_img} alt="배경 이미지" />
            */}
    </div>
  );
};
export default Join;
