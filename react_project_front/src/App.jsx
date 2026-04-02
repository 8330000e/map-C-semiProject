// 앱의 최상위 컴포넌트입니다.
// 공통 헤더/푸터를 렌더링하고, URL 경로에 따라 페이지를 라우팅합니다.
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
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
import TestHeader from "./components/commons/TestHeader";

function App() {
  {
    /*1. 로그인로직 
    2. 로그인 후 null이 아닌 memeber state를 useAthsore에 저장*/
  }
  return (
    <div className="carbonconnect wrap">
      <Header />
      <main className="main">
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
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/join" element={<JoinPage />}></Route>
          <Route path="/members/login" element={<LoginPage />}></Route>
          <Route path="/test-header" element={<TestHeader />} />
          <Route path="/members/updatemyinfo" />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
