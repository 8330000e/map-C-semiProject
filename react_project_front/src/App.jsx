// 앱의 최상위 컴포넌트입니다.
// 공통 헤더/푸터를 렌더링하고, URL 경로에 따라 페이지를 라우팅합니다.
import { useState } from "react";

import "./index.css";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import "./App.css";
import "./font.css";
import Footer from "./components/commons/Footer";
import Header from "./components/commons/Header";
import Main from "./pages/Main";
import Store from "./components/board/store/store";
import StoreDetail from "./components/board/store/storeDetail";
import ProductRegistration from "./components/board/store/productRegistration";
import OrderPage from "./pages/payment/OrderPage";
import TossTestPayment from "./pages/payment/TossTestPayment";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFail from "./pages/payment/PaymentFail";
import JoinPage from "./pages/member/JoinPage";
import LoginPage from "./pages/member/LoginPage";
import UpdateMyInfo from "./components/mypage/UpdateMyInfo";
import MyBoard from "./components/mypage/MyBoard";
import MyLikeBoard from "./components/mypage/MyLikeBoard";
import MemberTip from "./components/mypage/MemberTip";
import LeaveMember from "./components/mypage/LeaveMember";
import MyPoint from "./components/mypage/MyPoint";
import ChangePw from "./components/mypage/ChangePw";
import Mypage from "./pages/member/MyPage";
import PurchaseHistory from "./components/mypage/PurchaseHistory";
import SaleHistory from "./components/mypage/SaleHistory";
import PurchaseDetail from "./components/mypage/PurchaseDetail";
import SaleDetail from "./components/mypage/SaleDetail";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  {
    /*1. 로그인로직 
    2. 로그인 후 null이 아닌 memeber state를 useAthsore에 저장*/
  }
  return (
    <div className="carbonconnect wrap">
      {!isAdmin && <Header />}
      <main className={isAdmin ? "" : "main"}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/register" element={<ProductRegistration />} />
          <Route path="/store/:id" element={<StoreDetail />} />
          <Route path="/payment/order" element={<OrderPage />} />
          <Route path="/payment/test" element={<TossTestPayment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/Store" element={<Navigate to="/store" replace />} />
          <Route path="/join" element={<JoinPage />}></Route>
          <Route path="/members/login" element={<LoginPage />}></Route>
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
