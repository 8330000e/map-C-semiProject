// 상단 헤더 UI 컴포넌트입니다.
// 로고, 로그인 영역, 사용자 아이콘 메뉴를 렌더링합니다.
import styles from "./AdminCommons.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

import useAuthStore from "../../store/useAuthStore.js";
// 어드민 헤더 로고도 import 방식으로 로드함. 문자열 경로 대신 컴파일 타임에 처리되도록 수정함.
import logo from "../../assets/logo/logo.svg";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { memberId, memberNickname, logout, memberGrade } = useAuthStore();

  //로그아웃버튼을 누르면 로그인 , 회원가입 버튼이 나오면서 메인화면으로 리턴
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className={styles.admin_header}>
        <div className={styles.admin_header_inner}>
          <NavLink to="/" className={styles.logo}>
            {/* import한 로고를 사용함. 브라우저가 문자열 경로를 불안정하게 처리하는 문제 해결임. */}
            <img src={logo} alt="logo" />
            <h1>탄소커넥트</h1>
          </NavLink>
          <div className={styles.header_wrap}>
            <div className={styles.profile_bar_wrap}>
              {memberGrade === 1 ? (
                <div
                  className={styles.profile_item}
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 30, color: "#464d3e" }} />
                  <span>{memberNickname}</span>
                </div>
              ) : (
                <div className={styles.profile_item}>
                  <AccountCircleIcon sx={{ fontSize: 30, color: "#464d3e" }} />
                  <span>{memberNickname}</span>
                </div>
              )}

              <NotificationsIcon sx={{ fontSize: 30, color: "#464d3e" }} />

              <button onClick={handleLogout}>로그아웃</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
