// React 앱의 시작점(엔트리 파일)입니다.
// BrowserRouter로 앱을 감싸서 페이지 이동(라우팅)이 동작하게 만듭니다.
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
