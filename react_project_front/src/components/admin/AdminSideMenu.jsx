// 관리자 사이드 메뉴 - 각 관리 페이지로 이동하는 네비게이션
// 현재 경로와 일치하는 메뉴에 active_menu 클래스 붙어서 하이라이트됨
import styles from "./AdminSideMenu.module.css";
import { NavLink } from "react-router-dom";
import adminProfile from "../../assets/admin.png";
import PollIcon from "@mui/icons-material/Poll";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GavelIcon from "@mui/icons-material/Gavel";
import HistoryIcon from "@mui/icons-material/History";
import FactCheckIcon from "@mui/icons-material/FactCheck";

const AdminSideMenu = ({ memberNickname }) => {
  return (
    <div className={styles.side_menu_wrap}>
      {/* 관리자 프로필 */}
      <div className={styles.admin_profile}>
        <img src={adminProfile} loading="lazy" decoding="async" />
        <span className={styles.name}>{memberNickname}</span>
      </div>

      <div className={styles.menu_list}>
        <NavLink // NavLink 현재 url과 일치하면 자동으로 active 클래스 붙여줌 모듈 스타일 적용을 위해 조건부로 붙여줌
          className={({ isActive }) => (isActive ? styles.active_menu : "")}
          to="/admin/dashboard"
        >
          <div className={styles.menu_item}>
            <span>대시보드</span>
            <PollIcon sx={{ fontSize: 30, color: "#0068EF" }} />
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active_menu : "")}
          to="/admin/members"
        >
          <div className={styles.menu_item}>
            <span>회원관리</span>
            <PeopleAltIcon sx={{ fontSize: 30, color: "#0068EF" }} />
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active_menu : "")}
          to="/admin/boards"
        >
          <div className={styles.menu_item}>
            <span>게시글 모니터링</span>
            <ScreenSearchDesktopIcon sx={{ fontSize: 30, color: "#0068EF" }} />
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active_menu : "")}
          to="/admin/reports"
        >
          <div className={styles.menu_item}>
            <span>신고센터</span>
            <GavelIcon sx={{ fontSize: 30, color: "#0068EF" }} />
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active_menu : "")}
          to="/admin/campaigns"
        >
          <div className={styles.menu_item}>
            <span>캠페인 승인</span>
            <FactCheckIcon sx={{ fontSize: 30, color: "#0068EF" }} />
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active_menu : "")}
          to="/admin/support"
        >
          <div className={styles.menu_item}>
            <span>고객센터</span>
            <SupportAgentIcon sx={{ fontSize: 30, color: "#0068EF" }} />
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) => (isActive ? styles.active_menu : "")}
          to="/admin/logs"
        >
          <div className={styles.menu_item}>
            <span>관리자로그</span>
            <HistoryIcon sx={{ fontSize: 30, color: "#0068EF" }} />
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSideMenu;
