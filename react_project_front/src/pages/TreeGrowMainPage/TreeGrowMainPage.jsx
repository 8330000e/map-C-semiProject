import TreeGrowMain from "../../components/TreeGrowMain/TreeGrowMain";
import styles from "./TreeGrowMainPage.module.css";

const TreeGrowMainPage = () => {
  return (
    <div className={styles.treeGrowMainPage}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.mapBox}>Map</div>
        </div>

        <div className={styles.right}>
          <TreeGrowMain />
        </div>
      </div>
    </div>
  );
};

export default TreeGrowMainPage;
