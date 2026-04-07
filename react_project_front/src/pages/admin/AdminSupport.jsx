import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import styles from "./AdminSupport.module.css";
import AdminNotice from "./AdminNoticePage";
import AdminFaq from "../../components/admin/AdminFaq";

const AdminSupport = () => {
  return (
    <section className={styles.support_wrap}>
      <div className={styles.top_menu}>
        <NavLink
          to="/admin/support/notice"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          공지사항
        </NavLink>
        <NavLink
          to="/admin/support/faq"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          자주묻는질문
        </NavLink>
        <NavLink
          to="/admin/support/qna"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          1:1문의
        </NavLink>
      </div>

      <div className={styles.content}>
        <Routes>
          <Route path="" element={<Navigate to="notice" />} />
          <Route path="notice" element={<AdminNotice />} />
          <Route path="faq" element={<AdminFaq />} />
        </Routes>
      </div>
    </section>
  );
};

export default AdminSupport;
