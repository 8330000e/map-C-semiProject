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
        <h1 onClick={() => navigate("/")}>탄소커넥트</h1>

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
              <MailIcon
                sx={{ fontSize: 30, color: "#464d3e", marginTop: 0.5 }}
              />
              <SettingsIcon
                sx={{ fontSize: 30, color: "#464d3e", marginTop: 0.5 }}
              />

              <button
                onClick={handleLogout}
                className={`${styles.btn} ${styles.outline}`}
              >
                로그아웃
              </button>
              <button
                onClick={() => setDrawer((prev) => !prev)}
                className={`${styles.btn} ${styles.outline}`}
                aria-expanded={drawer}
                aria-controls="header-drawer"
              >
                메뉴 열기
              </button>

              <div
                id="header-drawer"
                className={`${styles.header_drawer} ${drawer ? styles.drawer_open : ""}`}
              >
                <div className={styles.drawer_menu}>
                  <NavLink
                    to="/mypage/updateMyInfo"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    내 정보
                  </NavLink>
                  <NavLink
                    to="/mypage/changePw"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    비밀번호 변경
                  </NavLink>
                  <NavLink
                    to="/mypage/myBoard"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    내 게시판
                  </NavLink>
                  <NavLink
                    to="/mypage/myLikeBoard"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    좋아요누른 게시판
                  </NavLink>
                  <NavLink
                    to="/mypage/tipScrap"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    팁 스크랩
                  </NavLink>
                  <NavLink
                    to="/mypage/leaveMember"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    회원 탈퇴
                  </NavLink>
                  <NavLink
                    to="/mypage/myPoint"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    내 포인트
                  </NavLink>
                  <NavLink
                    to="/mypage/history/purchase"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    구매내역
                  </NavLink>
                  <NavLink
                    to="/mypage/history/sale"
                    className={({ isActive }) =>
                      isActive ? styles.drawer_link_active : styles.drawer_link
                    }
                    onClick={() => setDrawer(false)}
                  >
                    판매내역
                  </NavLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
