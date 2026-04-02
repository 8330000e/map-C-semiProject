import styles from "./AdminSideMenu.module.css";
import { NavLink } from "react-router-dom";

const AdminSideMenu = () => {
  return (
    <div className={styles.side_menu_wrap}>
      <div className={styles.admin_profile}>
        <span className={styles.name}>관리자1</span>
      </div>
      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/admin/dashboard"
      >
        대시보드
      </NavLink>

      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/admin/members"
      >
        회원통합관리
      </NavLink>

      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/admin/boards"
      >
        게시글관리
      </NavLink>

      <NavLink
        className={({ isActive }) => (isActive ? styles.active_menu : "")}
        to="/admin/support"
      >
        고객센터
      </NavLink>
    </div>
  );
};

export default AdminSideMenu;
