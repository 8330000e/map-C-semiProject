// 관리자 페이지 레이아웃 - 헤더/사이드메뉴/푸터 고정이고 가운데 콘텐츠 영역만 라우팅으로 바뀜
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

import AdminBoardPage from "./AdminBoardPage.jsx";
import AdminReport from "../../components/admin/AdminReport.jsx";
import AdminReportPage from "./AdminReportPage.jsx";

const AdminPage = () => {
  useEffect(() => {
    // 관리자 페이지 들어오면 body 배경 어둡게 바꿈
    document.body.style.backgroundColor = "#0b0f1a";

    return () => {
      // 나갈 때 원래 배경색으로 복원
      document.body.style.backgroundColor = "#fbfff5";
    };
  }, []);

  const { memberGrade, isReady, memberNickname } = useAuthStore();
  // if (!isReady) return null;

  // grade가 1이 아니면 메인으로 튕겨냄
  if (memberGrade !== 1) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <AdminHeader /> {/* 관리자 전용 헤더,푸터 사용 */}
      <div className={styles.admin_outer}>
        <section className={styles.admin_wrap}>
          {/* 왼쪽 사이드메뉴 */}
          <div className={styles.admin_page_aside}>
            <AdminSideMenu memberNickname={memberNickname} />
          </div>
          {/* 오른쪽 콘텐츠 영역 - url에 따라 다른 페이지 렌더링 */}
          <div className={styles.admin_page_content}>
            <Routes>
              {/* /admin 으로 들어오면 무조건 /admin/dashboard 로 보냄 */}
              <Route path="" element={<Navigate to="/admin/dashboard" />} />
              <Route path="dashboard" element={<DashBoardPage />} />
              <Route path="members" element={<AdminMemberPage />} />
              <Route path="support/*" element={<AdminSupport />} />
              <Route path="boards" element={<AdminBoardPage />} />
              <Route path="reports" element={<AdminReportPage />} />
            </Routes>
          </div>
        </section>
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminPage;
