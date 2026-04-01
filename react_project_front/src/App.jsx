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

function App() {
  return (
    <div className="carbonconnect wrap">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/store" element={<Store />} />
          <Route path="/store/register" element={<ProductRegistration />} />
          <Route path="/store/:id" element={<StoreDetail />} />
          <Route path="/Store" element={<Navigate to="/store" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
