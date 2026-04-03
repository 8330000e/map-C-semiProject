// 상단 헤더 UI 컴포넌트입니다.
// 로고, 로그인 영역, 사용자 아이콘 메뉴를 렌더링합니다.
import styles from "./AdminCommons.module.css";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import useAuthStore from "../../store/useAuthStore";

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
        <h1>
          <Link to="/">탄소커넥트</Link>
        </h1>
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
            <MailIcon sx={{ fontSize: 30, color: "#464d3e" }} />
            <SettingsIcon sx={{ fontSize: 30, color: "#464d3e" }} />

            <button onClick={handleLogout}>로그아웃</button>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;
