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

  // --- [추가] 유효성 검사 메시지 상태 ---
  const [idMessage, setIdMessage] = useState(""); // 아이디 유효성 검사 메시지 상태
  const [pwMessage, setPwMessage] = useState(""); // 비밀번호 유효성 검사 메시지 상태

  // 작업 1: 유효성 검사 함수 (정규식)
  //아이디 숫자 영문자 특수문자만 되게 하기
  const validateId = (id) => {
    const idRegex = /^[a-zA-Z0-9]{1,8}$/; //영문 숫자만 1-8자
    if (id.length > 8) return "아이디는 영문과 숫자만 가능합니다.";
    // 여기서 idRegex를 '사용'함으로 써 경고 해결!
    if (!idRegex.test(id)) {
      return "아이디는 영문과 숫자만 가능합니다.";
    }

    return "";
  };

  const validatePw = (pw) => {
    // 영문 3개 이상, 숫자 4개 이상, 특수문자 1개 이상 포함 로직
    const englishCount = (pw.match(/[a-zA-Z]/g) || []).length;
    const numberCount = (pw.match(/[0-9]/g) || []).length;
    const specialCount = (pw.match(/[!@#$%^&*()_+~`-]/g) || []).length;

    if (pw.length === 0) return "";
    if (englishCount < 3 || numberCount < 4 || specialCount < 1) {
      return "비밀번호는 영문 3개 이상, 숫자 4개 이상, 특수문자 1개 이상 포함 로직입니다.";
    }
    return "";
  };

  //아이디 중복 체크 (기존 로직 유지하되 유효성 검사 통과 시에만 실행 추천)
  const ipDupCheck = async () => {
    if (
      !member.memberId ||
      idMessage.includes("초과") ||
      idMessage.includes("만 가능")
    ) {
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

    // 1. 아이디 처리 (영문+숫자, 최대 8자, 한글/특수문자 불가)
    if (name === "memberId") {
      const cleanedValue = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ""); // 한글 즉시 제거

      // 여기서 validateId 함수를 '사용'함으로 써 경고 해결!
      const errorMessage = validateId(cleanedValue);
      setIdMessage(errorMessage);

      if (cleanedValue.length === 0) {
        setIdMessage("");
        setMember({ ...member, [name]: "" }); //값을 적고나면 비우는 로직
        return;
      }

      // 특수문자 입력 방지 (영문, 숫자만 허용)
      const idRegex = /^[a-zA-Z0-9]*$/;
      if (!idRegex.test(cleanedValue)) {
        setIdMessage("아이디는 영문과 숫자만 가능합니다.");
        return; // 특수문자가 들어오면 업데이트 안함
      }

      // 글자수 제한
      if (cleanedValue.length > 8) {
        setIdMessage("범위를 초과하였습니다. (최대 8자)");
        return;
      }

      setIdMessage(""); // 모든 조건 통과 시 메시지 초기화
      setMember({ ...member, [name]: cleanedValue });
      return;
    }

    // 2. 비밀번호 처리 (영문3↑, 숫자4↑, 특수문자1↑, 8자↑, 한글불가)
    if (name === "memberPw") {
      const cleanedValue = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ""); // 한글 즉시 제거
      const errorMessage = validatePw(cleanedValue);
      setPwMessage(errorMessage);
      // 복합 조건 검사 로직
      const englishCount = (cleanedValue.match(/[a-zA-Z]/g) || []).length;
      const numberCount = (cleanedValue.match(/[0-9]/g) || []).length;
      const specialCount = (cleanedValue.match(/[!@#$%^&*()_+~`-]/g) || [])
        .length;

      // 비밀번호 설정 영어, 숫자, 특수문자 제한
      if (
        cleanedValue.length > 0 &&
        (englishCount < 3 ||
          numberCount < 4 ||
          specialCount < 1 ||
          cleanedValue.length < 8)
      ) {
        setPwMessage(
          "영문(3개↑), 숫자(4개↑), 특수문자(1개↑) 조합 8자 이상 필요",
        );
      } else if (cleanedValue.length >= 8) {
        setPwMessage("안전한 비밀번호입니다.");
      } else {
        setPwMessage("");
      }

      setMember({ ...member, [name]: cleanedValue });
      return;
    }
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
    console.log("회원가입 버튼 클릭됨");
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

    //아이디 유효성 검사
    if (idMessage && idMessage !== "") {
      await errorAlert("아이디 확인", idMessage);
      return;
    }
    //비밀번호 조합이 맞는지 검사
    if (pwMessage !== "안전한 비밀번호입니다.")
      return errorAlert("비밀번호 확인", pwMessage);

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
              placeholder="영문, 숫자 조합 8자 이내"
            ></input>
            {idMessage && (
              <p className={`${styles.check_msg} ${styles.invalid}`}>
                {idMessage}
              </p>
            )}
            {!idMessage && checkId === 1 && (
              <p className={`${styles.check_msg} ${styles.invalid}`}>
                이미 사용 중인 아이디입니다.
              </p>
            )}
            {checkId === 2 && !idMessage && (
              <p className={styles.check_msg}>사용 가능한 아이디입니다.</p>
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
              placeholder="영문3, 숫자4, 특수문자하나 이상"
            />
            {pwMessage && (
              <p
                className={
                  pwMessage.includes("안전")
                    ? styles.check_msg
                    : `${styles.check_msg} ${styles.invalid}`
                }
              >
                {pwMessage}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.input_wrap}>
            <label htmlFor="memberPwRe">비밀번호 확인</label>
            <input
              type="password"
              name="memberPwRe"
              id="memberPwRe"
              value={memberPwRe}
              onChange={(e) =>
                setMemberPwRe(
                  // 비밀번호에서는 한글을 제거
                  e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ""),
                )
              }
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
