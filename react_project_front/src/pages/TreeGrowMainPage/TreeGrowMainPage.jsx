import { useState } from "react";
import TreeGrowMain from "../../components/TreeGrowMain/TreeGrowMain";
import styles from "./TreeGrowMainPage.module.css";
import RegionMap from "../../components/map/RegionMap";

const TreeGrowMainPage = () => {
  const [selectedRegionNo, setSelectedRegionNo] = useState(2); // 기본 서울

  return (
    <div className={styles.treeGrowMainPage}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.mapBox}>
            <RegionMap
              selectedRegionNo={selectedRegionNo}
              onSelectRegion={setSelectedRegionNo}
            />
          </div>
        </div>

        <div className={styles.right}>
          <TreeGrowMain selectedRegionNo={selectedRegionNo} />
        </div>
      </div>
    </div>
  );
};

export default TreeGrowMainPage;
