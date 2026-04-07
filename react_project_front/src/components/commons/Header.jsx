import styles from "./commons.module.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";

import useAuthStore from "../../store/useAuthStore";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const { memberId, memberNickname, logout, memberGrade } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logo}>
          <img src="src\assets\logo\logo.svg" alt="logo" />
          <h1>탄소커넥트</h1>
        </NavLink>

        <div className={styles.header_wrap}>
          {!memberId ? (
            <div className={styles.login}>
              <Link to="/members/login">
                <button
                  type="button"
                  className={`btn ${styles.btn} ${styles.inline} ${styles.login_btn}`}
                >
                  로그인
                </button>
              </Link>
              <Link to="/join">
                <button
                  type="button"
                  className={`btn ${styles.btn} ${styles.outline}`}
                >
                  회원가입
                </button>
              </Link>
            </div>
          ) : (
            <div className={`${styles.profile_bar_wrap}`}>
              {memberGrade === 1 ? (
                <div
                  className={styles.profile_item}
                  onClick={() => navigate("/admin")}
                >
                  <AccountCircleIcon sx={{ fontSize: 30, color: "#464d3e" }} />
                  <span>{memberNickname}</span>
                </div>
              ) : (
                <div
                  className={`${styles.profile_item} ${drawer ? styles.drawer_open : styles.drawer_close}`}
                  onClick={() => {
                    setDrawer(true);
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 30, color: "#464d3e" }} />
                  <span>{memberNickname}</span>
                </div>
              )}

              <NotificationsIcon
                sx={{ fontSize: 30, color: "#464d3e", marginTop: 0.5 }}
              />

              <button
                onClick={handleLogout}
                className={`${styles.btn} ${styles.outline}`}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
