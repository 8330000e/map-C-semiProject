import { useEffect } from "react";
import Support from "../../components/support/Support";
import styles from "./SupportPage.module.css";
import { Route, Routes } from "react-router-dom";
import SupportFaqPage from "./SupportFaqPage";

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
      </Routes>
    </section>
  );
};

export default SupportPage;
