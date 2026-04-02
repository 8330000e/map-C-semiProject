import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Login = () => {
  // 페이지 이동 함수 가져오기
  const navigate = useNavigate();

  // 상태 선언: 입력 중인 로그인 값 저장 (id, pw)
  const [member, setMember] = useState({
    memberId: "", // 아이디 필드
    memberPw: "", // 비밀번호 필드
  });

  // input에서 value가 바뀔 때마다 상태 업데이트하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target; // 이벤트가 발생한 input의 name과 value 추출
    setMember({
      ...member, // 기존 상태 유지
      [name]: value, // 예: name이 memberId이면 memberId 값만 변경
    });
  };

  const handleLogin = () => {
    console.log("로그인 버튼 클릭됨"); // 버튼 클릭 테스트용 출력

    // 1) 값 유효성 검사 (아이디/비밀번호 필수)
    if (!member.memberId || !member.memberPw) {
      alert("아이디와 비밀번호를 입력하세요");
      return;
    }

    // 2) 디버그 출력 (보내는 데이터, 서버 주소)
    console.log("보내는 데이터:", member);
    console.log("서버 주소:", import.meta.env.VITE_BACKSERVER);

    // 3) Vite 환경 변수 존재 여부 검증
    if (!import.meta.env.VITE_BACKSERVER) {
      console.error("VITE_BACKSERVER 환경변수가 설정되지 않았습니다.");
      alert("서버 요청 실패: .env에 VITE_BACKSERVER 설정이 필요합니다.");
      return;
    }

    // 4) 로그인 요청 보내기
    //    - 서버가 실제 로그인 API를 구현했다고 가정
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/login`, member)
      .then((res) => { // 성공 시 실행

        console.log("응답 성공:", res);
        console.log("응답 데이터:", res.data);

        // 로그인 성공 시 전역 상태에 사용자 데이터 저장
        useAuthStore.getState().login(res.data);
        // 로그인 후 홈으로 이동
        navigate("/");
      })
      .catch((err) => {
        // 인증 실패(401), 존재하지 않는 경로(404) 등 오류 처리
        console.error("로그인 실패:", err);
        alert("로그인 실패: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="login-wrap">
      <h3 className="page-title">로그인</h3>
      <div>
        <input
          type="text"
          name="memberId"
          id="memberId"
          value={member.memberId}
          onChange={handleChange}
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
          /*placeholder: 칸에 글씨를 보여주게 하는 역할, 입력하면 사라짐 */
          placeholder="비밀번호"
          //onKeyDown=> 엔터를 치면 그걸 키값으로 받아들여 handleLogin() 함수 실행
          //즉 로그인이 되게 하는 기능.
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        ></input>
        <button onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
};
export default Login;
