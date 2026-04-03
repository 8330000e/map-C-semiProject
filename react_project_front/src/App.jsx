// 앱의 최상위 컴포넌트입니다.
// 공통 헤더/푸터를 렌더링하고, URL 경로에 따라 페이지를 라우팅합니다.
//import { useState } from "react";
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
import useAuthStore from "./store/useAuthStore";
import { useEffect } from "react";
import axios from "axios";

function App() {
  {
    /*1. 로그인로직 
    2. 로그인 후 null이 아닌 memeber state를 useAthsore에 저장*/
  }

  // useAuthstore로 token가져오기
  //왜 로그인이 아닌 app에서 로그인 인증 유지과정 로직을 적는가?
  // 로그인에서는 로그인을 했을 경우에만 해당. 그 외에는 적용이 어려움
  //app는 새로고침을 해도 모든 창에 기본적으로 영향을 끼침.
  //따라서 app에서 토큰을 지속적으로 유지하는 로직을 짬.
  const token = useAuthStore((state) => state.token);

  //새로고침을 할 떄마다 Axios 헤더 셋팅 -> 즉, 로그인이 풀리지 않게 토큰 유지
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("새로고침 후 Axios 헤더 세팅 완료", token);
    }
  }, [token]);

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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
