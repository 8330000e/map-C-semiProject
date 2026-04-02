import WaterDropIcon from "@mui/icons-material/WaterDrop";
import styles from "./TreeGrowMain.module.css";
import stage1Img from "../../../assets/img/stage1.png";
import stage2Img from "../../../assets/img/stage2.png";
import stage3Img from "../../../assets/img/stage3.png";
import stage4Img from "../../../assets/img/stage4.png";
import stage5Img from "../../../assets/img/stage5.png";

const TreeGrowMain = () => {
  const selectedRegion = {
    name: "서울",
    water: 250,
    multiplier: [
      { name: "서울", value: "x1.0" },
      { name: "경기", value: "x1.0" },
      { name: "인천", value: "x1.0" },
      { name: "충청권", value: "x1.2" },
      { name: "전라권", value: "x1.2" },
      { name: "경상권", value: "x1.2" },
      { name: "강원권", value: "x1.5" },
      { name: "제주권", value: "x1.7" },
    ],
  };

  const chartData = [
    { name: "서울", value: 250 },
    { name: "경기", value: 230 },
    { name: "인천", value: 150 },
    { name: "충청권", value: 200 },
    { name: "전라권", value: 100 },
    { name: "경상권", value: 125 },
    { name: "강원권", value: 175 },
    { name: "제주권", value: 175 },
  ];

  const rankedChartData = chartData
    .map((item) => {
      const rank =
        chartData.filter((compareItem) => compareItem.value > item.value)
          .length + 1;

      return {
        ...item,
        rank,
      };
    })
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return b.value - a.value;
    });

  const maxValue = Math.max(...rankedChartData.map((item) => item.value));

  const getLegendColorClass = (rank) => {
    if (rank === 1) return styles.gold;
    if (rank === 2) return styles.silver;
    if (rank === 3) return styles.bronze;
    return styles.blue;
  };

  const getBarColorClass = () => styles.blue;

  // 누적 경험치 기준
  const getStageByWater = (water) => {
    if (water >= 5000) return 5;
    if (water >= 3000) return 4;
    if (water >= 2000) return 3;
    if (water >= 1000) return 2;
    return 1;
  };

  const getStageLabel = (stage) => {
    if (stage === 1) return "새싹";
    if (stage === 2) return "성장 1단계";
    if (stage === 3) return "성장 2단계";
    if (stage === 4) return "성장 3단계";
    return "완성";
  };

  const getTreeImage = (stage) => {
    if (stage === 1) return stage1Img;
    if (stage === 2) return stage2Img;
    if (stage === 3) return stage3Img;
    if (stage === 4) return stage4Img;
    return stage5Img;
  };

  const getCurrentStageTarget = (water) => {
    if (water >= 3000) return 5000;
    if (water >= 2000) return 3000;
    if (water >= 1000) return 2000;
    return 1000;
  };

  const getStageStartWater = (water) => {
    if (water >= 5000) return 5000;
    if (water >= 3000) return 3000;
    if (water >= 2000) return 2000;
    if (water >= 1000) return 1000;
    return 0;
  };

  const currentStage = getStageByWater(selectedRegion.water);
  const currentStageLabel = getStageLabel(currentStage);
  const currentTreeImage = getTreeImage(currentStage);

  const currentStageTarget = getCurrentStageTarget(selectedRegion.water);
  const currentStageStartWater = getStageStartWater(selectedRegion.water);

  const currentStageProgress =
    currentStage === 5
      ? 100
      : ((selectedRegion.water - currentStageStartWater) /
          (currentStageTarget - currentStageStartWater)) *
        100;

  return (
    <div className={styles.treeGrowMain}>
      <section className={styles.topCard}>
        <div className={styles.topHeader}>
          <span className={styles.regionName}>{selectedRegion.name}</span>
          <span className={styles.stageText}>{currentStageLabel}</span>
        </div>

        <div className={styles.topContent}>
          <div className={styles.leftInfo}>
            <div className={styles.multiplierBox}>
              <p className={styles.multiplierTitle}>물 주기 배율안내</p>
              <ul className={styles.multiplierList}>
                {selectedRegion.multiplier.map((item) => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.rightTreeArea}>
            <div className={styles.treeStageLabel}>{currentStageLabel}</div>

            <div className={styles.treeBox}>
              <div className={styles.treeImageWrap}>
                <img
                  src={currentTreeImage}
                  alt={currentStageLabel}
                  className={styles.treeImage}
                />
              </div>
            </div>
          </div>

          <div className={styles.waterActionRow}>
            <div className={styles.waterDropWrap}>
              <div className={styles.waterDrop}>
                <div
                  className={styles.waterFill}
                  style={{ height: `${currentStageProgress}%` }}
                />
              </div>
              <span className={styles.waterText}>
                {selectedRegion.water}h2O/{currentStageTarget}h2O
              </span>
            </div>

            <button className={styles.waterButton}>물 주기(포인트 기여)</button>
          </div>
        </div>
      </section>

      <section className={styles.chartCard}>
        <div className={styles.chartInner}>
          <div className={styles.legendBox}>
            {rankedChartData.map((item) => (
              <div key={item.name} className={styles.legendItem}>
                <WaterDropIcon
                  className={`${styles.legendIcon} ${getLegendColorClass(item.rank)}`}
                />
                <span className={styles.legendLabel}>
                  {item.name} : {item.value}h2O
                </span>
              </div>
            ))}
          </div>

          <div className={styles.barChart}>
            {rankedChartData.map((item) => (
              <div key={item.name} className={styles.barItem}>
                <span className={styles.barValue}>{item.value}</span>
                <div
                  className={`${styles.bar} ${getBarColorClass()}`}
                  style={{ height: `${(item.value / maxValue) * 90 + 18}px` }}
                ></div>
                <span className={styles.barLabel}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TreeGrowMain;
