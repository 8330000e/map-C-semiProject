// 상단 헤더 UI 컴포넌트입니다.
// 로고, 로그인 영역, 사용자 아이콘 메뉴를 렌더링합니다.
import styles from "./commons.module.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";

import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";

const Header = () => {
  const [drawer, setDrawer] = useState(false);
  const navigate = useNavigate();
  const { memberId, memberNickname, logout, memberGrade } = useAuthStore();

  //로그아웃버튼을 누르면 로그인 , 회원가입 버튼이 나오면서 메인화면으로 리턴
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header>
        <h1>
          <Link to="/">탄소커넥트</Link>
        </h1>
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
                  className={`${styles.profile_item}`}
                  onClick={() => {
                    navigate("/admin");
                  }}
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

              <div
                className={`${styles.drawer_wrap} ${drawer ? styles.drawer_open : styles.drawer_close}`}
                onClick={() => {
                  setDrawer(false);
                }}
              >
                <div className={`${styles.drawer_helper}`}></div>
                <div className={`${styles.header_drawer}`}>
                  <div className={styles.drawer_menue}>
                    <NavLink
                      to="/mypage/updateMyInfo"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      내 정보
                    </NavLink>
                    <NavLink
                      to="/mypage/changePw"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      비밀번호 변경
                    </NavLink>
                    <NavLink
                      to="/mypage/myBoard"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      내 게시판
                    </NavLink>
                    <NavLink
                      to="/mypage/myLikeBoard"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      내 좋아요 게시판
                    </NavLink>
                    <NavLink
                      to="/mypage/tipScrap"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      팁 스크랩
                    </NavLink>
                    <NavLink
                      to="/mypage/leaveMember"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      회원 탈퇴
                    </NavLink>
                    <NavLink
                      to="/mypage/myPoint"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      나의 포인트
                    </NavLink>
                    <NavLink
                      to="/mypage/history/purchase"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      구매내역
                    </NavLink>
                    <NavLink
                      to="/mypage/history/purchase/:id"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      구매내역 상세
                    </NavLink>
                    <NavLink
                      to="/mypage/history/sale"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      판매내역
                    </NavLink>
                    <NavLink
                      to="/mypage/history/sale/:id"
                      onClick={() => {
                        setDrawer(false);
                      }}
                    >
                      판매내역 상세
                    </NavLink>
                  </div>
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
