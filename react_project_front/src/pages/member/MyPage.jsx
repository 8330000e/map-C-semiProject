// 마이페이지 컴포넌트 파일입니다.

import { Route, Routes } from "react-router-dom";
import UpdateMyInfo from "../../components/mypage/UpdateMyInfo";
import MyBoard from "../../components/mypage/MyBoard";
import MyLikeBoard from "../../components/mypage/MyLikeBoard";
import MemberTip from "../../components/mypage/MemberTip";
import LeaveMember from "../../components/mypage/LeaveMember";
import MyPoint from "../../components/mypage/MyPoint";
import ChangePw from "../../components/mypage/ChangePw";
import MyInformation from "../../components/mypage/MyInformation";
import PurchaseHistory from "../../components/mypage/PurchaseHistory";
import PurchaseDetail from "../../components/mypage/PurchaseDetail";
import SaleHistory from "../../components/mypage/SaleHistory";
import SaleDetail from "../../components/mypage/SaleDetail";
import styles from "./MyPage.module.css";
import useAuthStore from "../../store/useAuthStore.js";

// 현재는 프로필 정보와 내 페이지 서브 라우트들이 함께 표시됩니다.
const Mypage = () => {
  const { memberId } = useAuthStore();

  return (
    memberId && (
      <section className={styles.mypage_wrap}>
        <h1>마이페이지</h1>
        <div className={styles.mypage_content_wrap}>
          <MyInformation />
          <div className={styles.historyPane}>
            <Routes>
              <Route
                index
                element={
                  <p className={styles.emptyText}>
                    보고 싶은 항목을 왼쪽에서 선택하세요.
                  </p>
                }
              />
              <Route path="updateMyInfo" element={<UpdateMyInfo />} />
              <Route path="changePw" element={<ChangePw />} />
              <Route path="myBoard" element={<MyBoard />} />
              <Route path="myLikeBoard" element={<MyLikeBoard />} />
              <Route path="tipScrap" element={<MemberTip />} />
              <Route path="leaveMember" element={<LeaveMember />} />
              <Route path="myPoint" element={<MyPoint />} />
              <Route path="history/purchase" element={<PurchaseHistory />} />
              <Route path="history/purchase/:id" element={<PurchaseDetail />} />
              <Route path="history/sale" element={<SaleHistory />} />
              <Route path="history/sale/:id" element={<SaleDetail />} />
            </Routes>
          </div>
        </div>
      </section>
    )
  );
};

export default Mypage;
