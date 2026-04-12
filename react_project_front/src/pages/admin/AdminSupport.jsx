// 고객센터 레이아웃 - 공지사항/FAQ/1:1문의 탭 메뉴 + 라우팅
// /admin/support 진입 시 기본으로 notice 탭으로 리다이렉트됨
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import styles from "./AdminSupport.module.css";
import AdminNotice from "./AdminNoticePage";
import AdminFaqPage from "../../pages/admin/AdminFaqPage";
import AdminQnaPage from "./AdminQnaPage";

const AdminSupport = () => {
  return (
    <section className={styles.support_wrap}>
      {/* 상단 탭 메뉴 - 활성화된 탭에 active 클래스 붙음 */}
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

      {/* 탭에 따라 다른 컴포넌트 렌더링 */}
      <div className={styles.content}>
        <Routes>
          {/* /admin/support 로 들어오면 notice 탭으로 보냄 */}
          <Route path="" element={<Navigate to="notice" />} />
          <Route path="notice" element={<AdminNotice />} />
          <Route path="faq" element={<AdminFaqPage />} />
          <Route path="qna" element={<AdminQnaPage />} />
        </Routes>
      </div>
    </section>
  );
};

export default AdminSupport;
