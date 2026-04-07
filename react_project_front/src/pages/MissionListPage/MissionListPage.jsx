import React from "react";
import styles from "./MissionListPage.module.css";
import MissionList from "../../components/MissionList/MissionList";

const MissionListPage = () => {
  return (
    <section className={styles.container}>
      <div className={styles.mainBox}>
        <MissionList />
      </div>
    </section>
  );
};

export default MissionListPage;
