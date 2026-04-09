import { Navigate, Routes, Route } from "react-router-dom";
import AdminSideMenu from "../../components/admin/AdminSideMenu";
import useAuthStore from "../../store/useAuthStore.js";
import styles from "./AdminPage.module.css";
import { useEffect } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
import DashBoardPage from "./DashBoardPage";
import AdminMemberPage from "./AdminMemberPage";
import AdminSupport from "./AdminSupport";

const AdminPage = () => {
  useEffect(() => {
    // 관리자 페이지 들어오면 실행

    document.body.style.backgroundColor = "#0b0f1a"; // body 배경 어둡게

    return () => {
      // 관리자 페이지 나가면 실행 (메인으로 돌아갈 때)

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
              {/*“/admin으로 들어오면 무조건 /admin/dashboard로 보내버려라”라는 설정
               */}{" "}
              <Route path="" element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<DashBoardPage />} />
              <Route path="members" element={<AdminMemberPage />} />
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
