import { Navigate, Routes, Route } from "react-router-dom";
import AdminSideMenu from "../../components/admin/AdminSideMenu";
import useAuthStore from "../../store/useAuthStore";
import styles from "./AdminPage.module.css";

const AdminPage = () => {
  const { memberGrade, isReady } = useAuthStore();
  // if (!isReady) return null;

  if (memberGrade !== 1) {
    alert("접근 권한이 없습니다.");
    return <Navigate to="/" replace />;
  }
  return (
    <div className={styles.admin_outer}>
      <section className={styles.admin_wrap}>
        <div className={styles.admin_page_aside}>
          <AdminSideMenu />
        </div>
        <div className={styles.admin_page_content}>
          {/*<Routes>
            <Route path="" element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminDashBoard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="support/*" element={<AdminSupport />} />
          </Routes>*/}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
