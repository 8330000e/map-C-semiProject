import Swal from "sweetalert2";
import styles from "../../pages/member/JoinPage.module.css";
import axios from "axios";

//  이메일 인증 페이지 컴포넌트
//React 컴포넌트는 props 객체를 받는
//지금 (memberEmail, setMemberEmail)처럼 두 개 파라미터로 받으려고 하고 있는데,
// 실제로는 하나의 props 객체여야 한다
// 따라서 props 객체에서 memberEmail과 setMemberEmail을 추출하는 방식으로 수정해야 합니다.
// 예시: const EmailAuth = (props) => { const { memberEmail, setMemberEmail } = props; ... }

import { useEffect, useState } from "react";

/*
  
  const EmailAuth = ({ memberEmail, setMemberEmail, onVerified }) => {
  const [mailAuth, setMailAuth] = useState(0);
  const [mailAuthCode, setMailAuthCode] = useState(null);
  const [mailAuthInput, setMailAuthInput] = useState("");
  const [time, setTime] = useState(180);
  const [timeExpired, setTimeExpired] = useState(false);
  
  */

// 이메일 인증 관련 상태 관리 (인증코드 발송, 입력값 검증, 타이머 처리) -> 자식컴포넌트 -> 부모컴포넌트인 JoinPage로 인증완료 여부 전달(onVerified)
const EmailAuth = ({ memberEmail, setMemberEmail, onVerified }) => {
  // mailAuth : 이메일 인증 진행 상태
  // 0 = 인증 전 (초기 상태)
  // 1 = 인증번호 발송 완료 (타이머 시작)
  // 3 = 인증 완료
  const [mailAuth, setMailAuth] = useState(0);

  // mailAuthCode : 서버에서 받은 인증번호 (프론트에서 사용자 입력값과 비교용)
  // 실제 서비스에서는 보안상 서버에서 검증하는 방식이 더 안전함
  const [mailAuthCode, setMailAuthCode] = useState(null);

  // mailAuthInput : 사용자가 입력한 인증번호 값
  const [mailAuthInput, setMailAuthInput] = useState("");

  // time : 인증 유효 시간 (초 단위, 기본 180초 = 3분)
  const [time, setTime] = useState(180);

  // timeExpired : 인증 시간 만료 여부
  // true가 되면 인증 실패 상태로 간주하고 재요청 필요
  const [timeExpired, setTimeExpired] = useState(false);
  const sendMail = () => {
    if (!memberEmail) {
      Swal.fire({
        title: "이메일을 입력하세요",
        icon: "warning",
      });
      return;
    }

    //전송할 데이터 객체 정의
    const payload = { memberEmail };
    //전송 전 데이터 로그 확인
    console.log("이메일 인증 요청 데이터:", payload);
    console.log("서버 주소:", import.meta.env.VITE_BACKSERVER);

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/email-verification`, {
        //HTTP POST 요청에서 서버는 일반적으로 JSON 형태로 데이터를 받음
        //--> 그래서 { memberEmail: memberEmail }-> 이 객체 형태로 보내야하는데
        //-> 축약이 가능함 그게 바로  memberEmail, 형식.
        //-> 서버에 JSON 형태로 보내겠다는 의미
        memberEmail,
      })
      .then((res) => {
        console.log("이메일 인증 요청 성공:", res.data);

        setMailAuth(1);
        setMailAuthCode(res.data); //프론트 비교용 코드
        setTime(180);
        setTimeExpired(false);
        Swal.fire({
          title: "인증메일이 전송되었습니다",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        // 3. 서버 응답 결과에 따른 상세 에러 로그-> 검증 잘되면 삭제
        if (err.response) {
          console.log("서버 응답:", err.response.data);
          console.log("서버 상태 코드:", err.response.status);
          console.log("서버 헤더:", err.response.headers);
        }
        Swal.fire({
          title: "메일 전송 실패",
          text: "잠시 후 다시 시도해주세요",
          icon: "error",
        });
      });
  };

  ///타이머 설정

  useEffect(() => {
    //mailAuth는 이메일 인증 상태를 가리킴-> 즉 현재 이메일 인증이 됐는지, 안됐는지를 알려주는 것
    //-> mailAuth가 0이면 인증 시작전이라는 의미
    //-> 그런데 아래 코드에서 1이 아닐 떄 , 즉 인증코드가 발송이 안됐거나
    //-> 시간만료가 되었을 때는 작동하지 않는다는 조건을 걸어둔 것이다.
    //-> 인증코드가 발생했을 떄에만 작동시킴.
    if (mailAuth !== 1 || timeExpired) return;
    //1초마다 내부 코드를 실행시키겠다는 말
    const timer = setInterval(() => {
      //prev-> 이전시간값
      setTime((prev) => {
        //아래 로직은 종료 조건 설정
        //시간이 1이하가 되면 -> 타이머 종료하라.
        if (prev <= 1) {
          clearInterval(timer);
          //인증상태 초기화 -> 즉 인증 메일 보내기전으로 셋팅
          setMailAuth(0);
          //만료상태 on
          setTimeExpired(true);
          //시간 0으로 고정-> 다시 if문으로 돌아가면서 이 함수 로직은 작동 안함
          //-> 다시 이메일 인증 재요청 들어감.
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    //인증이 잘되면 재랜더링이 되지 않게 하기 위해 기존 타이머 제거
    //캄포넌트가 사라질 떄 타이머 제거
    //즉 항상 하나의 타이머를 유지하기 위한 로직
    return () => clearInterval(timer);
    //[mailAuth, timeExpired]
    //-> 의존성배열, 인증시작,시간 만료됐을 떄에만 실행, 그전에 작동불가로 랜더링방지
  }, [mailAuth, timeExpired]);

  ///이메일 바뀌면 상태 초기화

  //이메일 인증이 끝나기까지 흐르는 시간을 설정

  const showTime = () => {
    const min = Math.floor(time / 60);
    const sec = String(time % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  //프론트 비교 인증

  const verifyMailCode = () => {
    if (mailAuth === 3) return;
    if (mailAuthInput === mailAuthCode) {
      setMailAuth(3);
      onVerified(true);
    } else {
      setMailAuth(1);
      onVerified(false);
      Swal.fire({
        title: "인증이 완료되지 않았습니다.",
        icon: "error",
      });
    }
  };

  const handleEmailChange = (e) => {
    //이벤트가 작동하여 memberEmail에 입력한 값이 실제값으로 들어가라는 로직
    setMemberEmail(e.target.value);
  };

  return (
    //<div className={styles.join_wrap}>
    <>
      {/* 이메일 입력 */}

      <div className={styles.input_wrap}>
        <label>이메일</label>
        <div
          className={styles.input_item}
          style={{ display: "flex", gap: "8px" }}
        >
          <input
            type="email"
            value={memberEmail}
            id="memberEmail"
            onChange={handleEmailChange}
            //mailAuth가 1 또는 3일 때 input을 수정 못하게 하는 로직
            //readOnly -> true: 입력 불가능, false:입력 가능

            readOnly={mailAuth === 1 || mailAuth === 3}
          />

          <button
            type="button"
            className={styles.join_btn} //joinpage 버튼 재사용
            onClick={sendMail}
          >
            인증메일 전송
          </button>
        </div>
      </div>

      {/* 인증 */}
      <div className={styles.input_wrap}>
        <label htmlFor="mailAuthInput">이메일 확인</label>
        <div
          className={styles.input_item}
          style={{ display: "flex", gap: "8px" }}
        >
          <input
            type="text"
            value={mailAuthInput}
            id="mailAuthInput"
            onChange={(e) => setMailAuthInput(e.target.value)}
          ></input>
          {/*버튼 선택:프론트 검증 */}
          <button
            type="button"
            className={styles.join_btn}
            onClick={verifyMailCode}
            disabled={mailAuth !== 1} // 인증메일 보내야만 활성화
          >
            메일 인증하기
          </button>
        </div>
      </div>

      {mailAuth === 1 && !timeExpired && <p>남은시간:{showTime()}</p>}
      {mailAuth === 3 && <p className={styles.check_msg}>인증되었습니다.</p>}
      {timeExpired && (
        <p className={`styles.check_msg ${styles.invalid}`}>
          인증시간이 만료되었습니다.
        </p>
      )}
    </>
    //</div>
  );
};
export default EmailAuth;
