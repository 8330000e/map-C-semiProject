import Community from "../../components/commons/Community/Community";
import styles from "./MapCommunityPage.module.css";

const MapCommunityPage = () => {
  return (
    <div className={styles.mapCommunityPage}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.mapBox}>Map</div>
        </div>

        <div className={styles.right}>
          <Community />
        </div>
      </div>
    </div>
  );
};

export default MapCommunityPage;
