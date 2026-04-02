import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({
      ...member,
      [name]: value,
    });
  };

  const handleLogin = () => {
    console.log("로그인 버튼 클릭됨"); // 버튼 작동 체크

    //아이디나 비밀번호가 없으면 입력하라는 문구 넣기
    if (!member.memberId || !member.memberPw) {
      alert("아이디와 비밀번호를 입력하세요");
      return;
    }
    //서버에 요청보내기전 member 값 제대로 들어있는지,서버 주소 undefined 아닌지 체크
    console.log("보내는 데이터:", member);
    console.log("서버 주소:", import.meta.env.VITE_BACKSERVER);
    //로그인에서는 setMember가 then에 들어가지 않는다.
    //왜냐하면 로그인이 되는지 안되는지만 판단하고, 수정 목적이 아니기 떄문

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/members/login`, member)
      .then((res) => {
        console.log("응답 성공:", res);
        console.log("응답 데이터:", res.data);

        if (res.data.token) {
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${res.data.token}`;
        }

        useAuthStore.getState().login(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
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
