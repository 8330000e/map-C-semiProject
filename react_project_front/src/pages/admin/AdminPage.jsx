import { Navigate, Routes, Route } from "react-router-dom";
import AdminSideMenu from "../../components/admin/AdminSideMenu";
import useAuthStore from "../../store/useAuthStore.js";
import styles from "./AdminPage.module.css";
import { useEffect } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
import AdminDashBoard from "./AdminDashBoard";
import AdminMember from "./AdminMember";
import AdminSupport from "./AdminSupport";

const AdminPage = () => {
  useEffect(() => {
    // 관리자 페이지 들어오면 실행
    document.body.style.margin = "0"; // body 마진 없애기
    document.body.style.backgroundColor = "#0b0f1a"; // body 배경 다크로

    return () => {
      // 관리자 페이지 나가면 실행 (메인으로 돌아갈 때)
      document.body.style.margin = "60px 80px"; // 원래 마진 복원
      document.body.style.backgroundColor = "#fbfff5"; // 원래 배경색 복원
    };
  }, []);

  const { memberGrade, isReady, memberNickname } = useAuthStore();
  // if (!isReady) return null;

  if (memberGrade !== 1) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <AdminHeader />
      <div className={styles.admin_outer}>
        <section className={styles.admin_wrap}>
          <div className={styles.admin_page_aside}>
            <AdminSideMenu memberNickname={memberNickname} />
          </div>
          <div className={styles.admin_page_content}>
            <Routes>
              <Route path="" element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<AdminDashBoard />} />
              <Route path="members" element={<AdminMember />} />
              <Route path="support/*" element={<AdminSupport />} />
            </Routes>
          </div>
        </section>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminPage;
