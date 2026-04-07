import { useEffect } from "react";
import Support from "../../components/support/Support";
import styles from "./SupportPage.module.css";

const SupportPage = () => {
  useEffect(() => {
    document.body.classList.add("support-page-active");

    return () => {
      document.body.classList.remove("support-page-active");
    };
  }, []);

  return (
    <section className={styles.support_wrap}>
      <Support />
    </section>
  );
};

export default SupportPage;
