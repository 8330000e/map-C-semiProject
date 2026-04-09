import { useEffect } from "react";
import Support from "../../components/support/Support";
import styles from "./SupportPage.module.css";
import { Route, Routes } from "react-router-dom";
import SupportFaqPage from "./SupportFaqPage";
import SupportNoticePage from "./SupportNoticePage";
import SupportNoticeDetailPage from "./SupportNoticeDetailPage";
import SupportQnaPage from "./SupportQnaPage";
import SupportQnaDetailPage from "./SupportQnaDetailPage";

const SupportPage = () => {
  useEffect(() => {
    document.body.classList.add("support-page-active");

    return () => {
      document.body.classList.remove("support-page-active");
    };
  }, []);

  return (
    <section className={styles.support_wrap}>
      <Routes>
        <Route path="" element={<Support />} />
        <Route path="faq" element={<SupportFaqPage />} />
        <Route path="notice" element={<SupportNoticePage />} />
        <Route path="notice/:noticeNo" element={<SupportNoticeDetailPage />} />
        <Route path="qna" element={<SupportQnaPage />} />
        <Route path="qna/:qnaNo" element={<SupportQnaDetailPage />} />
      </Routes>
    </section>
  );
};

export default SupportPage;
