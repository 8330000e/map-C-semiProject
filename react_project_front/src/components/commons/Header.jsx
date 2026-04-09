import styles from "./commons.module.css";
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import Swal from "sweetalert2";

import useAuthStore from "../../store/useAuthStore";
import { useState } from "react";
// 로고 이미지는 Vite 정상 로딩을 위해 import 방식으로 참조함.
import logo from "../../assets/logo/logo.svg";

const Header = () => {
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);
  const { memberId, memberNickname, logout, memberGrade } = useAuthStore();

  //location : 현재 나의 위치가 어느페이지에 있는지를 알려주는 일종의 네비게이션
  const location = useLocation();
  // 로그인페이지의 위치를 지정해주는것
  //로그인페이지에서는 로그인 버튼을 안보이게 하기 위한 설정
  const isLoginPage = location.pathname === "/members/login";

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "정말 로그아웃 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      logout();
      navigate("/");
    }
  };

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logo}>
          {/* import된 로고를 src 속성으로 전달함. 백슬래시 경로 문자열 대신 안정적 로딩을 위해 수정함. */}
          <img src={logo} alt="logo" />
          <h1>탄소커넥트</h1>
        </NavLink>

        <div className={styles.header_wrap}>
          {!memberId && !isLoginPage ? (
            <div className={styles.login}>
              <Link to="/members/login">
                <button
                  type="button"
                  className={`btn ${styles.btn} ${styles.inline} ${styles.login_btn}`}
                >
                  로그인
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
              {/* <button
                onClick={() => setDrawer((prev) => !prev)}
                className={`${styles.btn} ${styles.outline}`}
                aria-expanded={drawer}
                aria-controls="header-drawer"
              >
                메뉴 열기
              </button> */}

              <div
                id="header-drawer"
                className={`${styles.header_drawer} ${drawer ? styles.drawer_open : ""}`}
                onClick={() => {
                  setDrawer(false);
                }}
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
