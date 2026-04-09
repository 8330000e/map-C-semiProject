import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginBg from "/images/login-background.png";
import useAuthStore from "../../store/useAuthStore";
import Swal from "sweetalert2";
import styles from "./LoginPage.module.css";
import { Link } from "react-router-dom";

const Login = () => {
  // 페이지 이동 함수 가져오기
  const navigate = useNavigate();

  // 상태 선언: 입력 중인 로그인 값 저장 (id, pw)
  const [member, setMember] = useState({
    memberId: "", // 아이디 필드
    memberPw: "", // 비밀번호 필드
  });

  const [isLoading, setIsLoading] = useState(false); //로딩상태가 아직 로그인이 안된 경우일떄
  //페이지가 처음 마운트될 때 바로 보여주고 싶다면 isReady를 true로 설정,
  //  로그인 버튼을 눌렀을 때 isReady를 false로 설정하여 로딩 상태를 보여줄 수 있다
  const [isReady, setIsReady] = useState(true); //페이지 랜더링 준비 상태

  const handleChange = (e) => {
    const { name, value } = e.target; // 이벤트가 발생한 input의 name과 value 추출
    setMember({
      ...member, // 기존 상태 유지
      [name]: value, // 예: name이 memberId이면 memberId 값만 변경
    });
  };

  const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

  const handleLogin = () => {
    console.log("로그인 버튼 클릭됨"); // 버튼 클릭 테스트용 출력

    // 1) 값 유효성 검사 (아이디/비밀번호 필수)
    if (!member.memberId || !member.memberPw) {
      Swal.fire({
        title: "아이디와 비밀번호를 입력하세요",
        icon: "error",
      });
      return;
    }

    // 2) 디버그 출력 (보내는 데이터, 서버 주소)
    console.log("보내는 데이터:", member);
    console.log("서버 주소:", BACKSERVER);

    //로딩 시작
    //isLoading → 로그인 시 로딩 표시, 버튼 비활성화.
    setIsLoading(true);
    //페이지/컴포넌트가 렌더링 준비가 끝났는지 체크하는 용도..
    setIsReady(true); //페이지 랜더링 준비 완료
    //여기에서 로딩 함수를 설정하고 axios에다가 타이머 설정
    let timer = setTimeout(() => {
      //3초안에 로그인 안되면 로딩 끝내기
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: "로그인 시간이 초과되었습니다. 다시 시도해주세요.",
      });
    }, 5000); //5초로 설정

    axios
      .post(`${BACKSERVER}/members/login`, member)
      .then((res) => {
        clearTimeout(timer); //로그인 성공하면 타이머 초기화
        console.log(res.data);

        Swal.fire({
          title: "로그인 성공!!",
          icon: "success",
        });

        //앞으로 axios는 기본값으로 "Authorization"이라는 서버에서 보내준 인증하는 값 헤더를
        //자동으로 붙인다. 즉, 토큰을 이제 전역에 적용시키겠다는 의미
        //로그인 후 받은 JWT 토큰을 헤더에 넣어야 로그인한 상태를 서버가 인식함.

        if (res.data.token) {
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;
        }

        useAuthStore.getState().login(res.data); //상태저장
        navigate("/");
      })
      .catch((err) => {
        clearTimeout(timer); //실패시 타이머 초기화
        setIsLoading(false); //로딩 끝내기
        Swal.fire({
          icon: "error",
          title: "로그인 실패",
          text: "아이디 또는 비밀번호가 올바르지 않습니다.",
        });
        console.log(err);
      });
  };

  //준비되지 않으면 랜더링 안 함
  if (!isReady) return null;

  return (
    //<div className={styles.login_total_page}></dev>
    <div className={styles.login_wrap}>
      <h3 className={styles.page_title}>로그인</h3>

      {isLoading && <p className={styles.loading_text}>로그인 중...</p>}

      <div className={styles.input_group}>
        {" "}
        {/*입력영역 그룹화 */}
        <input
          type="text"
          name="memberId"
          id="memberId"
          value={member.memberId}
          onChange={handleChange}
          className={styles.input_field}
          /*placeholder: 칸에 글씨를 보여주게 하는 역할, 입력하면 사라짐 */
          placeholder="아이디"
        ></input>
        <input
          //text를 써도 되지만 글씨가 다 보이게됨. 보안을 위해 password를 사용
          type="password"
          name="memberPw"
          id="memberPw"
          value={member.memberPw}
          onChange={handleChange}
          className={styles.input_field}
          /*placeholder: 칸에 글씨를 보여주게 하는 역할, 입력하면 사라짐 */
          placeholder="비밀번호"
          //onKeyDown=> 엔터를 치면 그걸 키값으로 받아들여 handleLogin() 함수 실행
          //즉 로그인이 되게 하는 기능.
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        ></input>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={styles.login_btn}
        >
          로그인
        </button>
      </div>

      {/* 여기에 아이디/비밀번호 찾기 링크 추가 */}
      <div className={styles.search_wrap}>
        <Link to="/members/find-id">아이디 찾기</Link>
        {" || "}
        <Link to="/members/find-pw">비밀번호 찾기</Link>
        {" || "}

        <Link to="/join">회원가입</Link>
      </div>

      {/* 이미지는 맨 아래에 배치 (CSS에서 absolute로 띄움) */}
      <img src={loginBg} className={styles.login_img} alt="배경 이미지" />
    </div>
  );
};
export default Login;
