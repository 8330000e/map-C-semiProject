import { Route, Routes } from "react-router-dom";
import SupportMain from "../../components/support/SupportMain";
import NoticePage from "./NoticePage";
import FaqPage from "./FaqPage";
import QnaPage from "./QnaPage";
import styles from "./SupportPage.module.css";

const SupportPage = () => {
  return (
    <section className={styles.support_wrap}>
      <Routes>
        <Route path="" element={<SupportMain />} />
        <Route path="notice" element={<NoticePage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="qna" element={<QnaPage />} />
      </Routes>
    </section>
  );
};

export default SupportPage;
