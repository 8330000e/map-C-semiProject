import styles from "./AdminSideMenu.module.css";
import { NavLink } from "react-router-dom";
import adminProfile from "../../assets/admin.png";
import PollIcon from "@mui/icons-material/Poll";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GavelIcon from "@mui/icons-material/Gavel";
import HistoryIcon from "@mui/icons-material/History";

const AdminSideMenu = ({ memberNickname }) => {
  return (
    <div className={styles.side_menu_wrap}>
      <div className={styles.admin_profile}>
        <img src={adminProfile} />
        <span className={styles.name}>{memberNickname}</span>
      </div>
      <NavLink
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
          <span>회원통합관리</span>
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
        to="/admin/support"
      >
        <div className={styles.menu_item}>
          <span>신고센터</span>
          <GavelIcon sx={{ fontSize: 30, color: "#0068EF" }} />
        </div>
      </NavLink>

      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/admin/report"
      >
        <div className={styles.menu_item}>
          <span>고객센터</span>
          <SupportAgentIcon sx={{ fontSize: 30, color: "#0068EF" }} />
        </div>
      </NavLink>

      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/admin/report"
      >
        <div className={styles.menu_item}>
          <span>시스템로그</span>
          <HistoryIcon sx={{ fontSize: 30, color: "#0068EF" }} />
        </div>
      </NavLink>
    </div>
  );
};

export default AdminSideMenu;
