import styles from "./commons.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import useAuthStore from "../../store/useAuthStore";

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
      <header>
        <h1><Link to="/">탄소커넥트</Link></h1>
        <div className={styles.header_wrap}>
          {!memberId ? (
            <div className={styles.login}>
              <Link to="/members/login">
                <button type="button" className={`btn ${styles.btn} ${styles.inline} ${styles.login_btn}`}>로그인</button>
              </Link>
              <Link to="/join">
                <button type="button" className={`btn ${styles.btn} ${styles.outline}`}>회원가입</button>
              </Link>
            </div>
          ) : (
            <div className={styles.profile_bar_wrap}>
              {memberGrade === 1 ? (
                <div className={styles.profile_item} onClick={() => navigate("/admin")}>
                  <AccountCircleIcon sx={{ fontSize: 30, color: "#464d3e" }} />
                  <span>{memberNickname}</span>
                </div>
              ) : (
                <div className={styles.profile_item}>
                  <AccountCircleIcon sx={{ fontSize: 30, color: "#464d3e" }} />
                  <span>{memberNickname}</span>
                </div>
              )}

              <NotificationsIcon sx={{ fontSize: 30, color: "#464d3e", marginTop: 0.5 }} />
              <MailIcon sx={{ fontSize: 30, color: "#464d3e", marginTop: 0.5 }} />
              <SettingsIcon sx={{ fontSize: 30, color: "#464d3e", marginTop: 0.5 }} />

              <button onClick={handleLogout} className={`${styles.btn} ${styles.outline}`}>로그아웃</button>
              <button onClick={() => setDrawer((prev) => !prev)} className={`${styles.btn} ${styles.outline}`}>메뉴 열기</button>

              {drawer && (
                <div className={styles.header_drawer}>
                  <div className={styles.drawer_menue}>
                    <NavLink to="/mypage/updateMyInfo" onClick={() => setDrawer(false)}>내 정보</NavLink>
                    <NavLink to="/mypage/changePw" onClick={() => setDrawer(false)}>비밀번호 변경</NavLink>
                    <NavLink to="/mypage/myBoard" onClick={() => setDrawer(false)}>내 게시판</NavLink>
                    <NavLink to="/mypage/myLikeBoard" onClick={() => setDrawer(false)}>좋아요누른 게시판</NavLink>
                    <NavLink to="/mypage/tipScrap" onClick={() => setDrawer(false)}>팁 스크랩</NavLink>
                    <NavLink to="/mypage/leaveMember" onClick={() => setDrawer(false)}>회원 탈퇴</NavLink>
                    <NavLink to="/mypage/myPoint" onClick={() => setDrawer(false)}>내 포인트</NavLink>
                    <NavLink to="/mypage/history/purchase" onClick={() => setDrawer(false)}>구매내역</NavLink>
                    <NavLink to="/mypage/history/sale" onClick={() => setDrawer(false)}>판매내역</NavLink>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;