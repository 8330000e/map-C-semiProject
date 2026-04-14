// 관리자 페이지 헤더 - 로고, 닉네임, 로그아웃 버튼
import styles from "./AdminCommons.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useAuthStore from "../../store/useAuthStore.js";
// 로고 import 방식으로 불러옴 - 문자열 경로보다 안정적
import logo from "../../assets/logo/logo.svg";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { memberId, memberNickname, logout, memberGrade } = useAuthStore();

  // 로그아웃 처리 - store 초기화 후 메인으로 이동
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className={styles.admin_header}>
        <div className={styles.admin_header_inner}>
          <NavLink to="/" className={styles.logo}>
            <img src={logo} alt="logo" loading="lazy" decoding="async" />
            <h1>탄소커넥트</h1>
          </NavLink>
          <div className={styles.header_wrap}>
            <div className={styles.profile_bar_wrap}>
              {/* 관리자면 클릭 시 /admin으로 이동, 아니면 그냥 표시만 */}
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
