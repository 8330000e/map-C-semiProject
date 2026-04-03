import { useState } from "react";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import styles from "./TreeGrowMain.module.css";
import stage1Img from "../../assets/img/stage1.png";
import stage2Img from "../../assets/img/stage2.png";
import stage3Img from "../../assets/img/stage3.png";
import stage4Img from "../../assets/img/stage4.png";
import stage5Img from "../../assets/img/stage5.png";
import waterDropImg from "../../assets/img/waterdrop.png";
import useAuthStore from "../../store/useAuthStore";
import CloseIcon from "@mui/icons-material/Close";

const TreeGrowMain = () => {
  const selectedRegion = {
    name: "서울",
    water: 0,
    multiplier: [
      { name: "서울", value: "x1.2" },
      { name: "경기", value: "x1.0" },
      { name: "인천", value: "x2.1" },
      { name: "충청권", value: "x1.6" },
      { name: "전라권", value: "x1.7" },
      { name: "경상권", value: "x1.1" },
      { name: "강원권", value: "x3.0" },
      { name: "제주권", value: "x3.0" },
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
    if (water >= 10000) return 5;
    if (water >= 5000) return 4;
    if (water >= 3000) return 3;
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
    if (water >= 10000) return 10000;
    if (water >= 5000) return 10000;
    if (water >= 3000) return 5000;
    if (water >= 1000) return 3000;
    return 1000;
  };
  const getStageStartWater = (water) => {
    if (water >= 10000) return 10000;
    if (water >= 5000) return 5000;
    if (water >= 3000) return 3000;
    if (water >= 1000) return 1000;
    return 0;
  };
  const getTreeScale = (stage) => {
    if (stage === 1) return 0.95;
    if (stage === 2) return 1.15;
    if (stage === 3) return 1.25;
    if (stage === 4) return 1.35;
    return 1.45;
  };

  const { memberId } = useAuthStore();
  const isLogin = !!memberId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const [waterAmount, setWaterAmount] = useState(0);
  const [regionWater, setRegionWater] = useState(selectedRegion.water);
  const [ownedPoint, setOwnedPoint] = useState(300);

  const [resultData, setResultData] = useState({
    regionName: "",
    donatedWater: 0,
    totalWater: 0,
    targetWater: 0,
    remainPoint: 0,
  });

  const currentStage = getStageByWater(regionWater);
  const currentStageLabel = getStageLabel(currentStage);
  const currentTreeImage = getTreeImage(currentStage);

  const currentStageTarget = getCurrentStageTarget(regionWater);
  const currentStageStartWater = getStageStartWater(regionWater);
  const currentTreeScale = getTreeScale(currentStage);
  const MAX_WATER = 100;

  const handleWaterChange = (amount) => {
    setWaterAmount((prev) => Math.max(0, Math.min(prev + amount, MAX_WATER)));
  };
  const handleConfirmWater = () => {
    if (waterAmount <= 0) return;

    const updatedRegionWater = regionWater + waterAmount;
    const updatedPoint = ownedPoint - waterAmount;

    setRegionWater(updatedRegionWater);
    setOwnedPoint(updatedPoint);

    setResultData({
      regionName: selectedRegion.name,
      donatedWater: waterAmount,
      totalWater: updatedRegionWater,
      targetWater: currentStageTarget,
      remainPoint: updatedPoint,
    });

    setWaterAmount(0);
    setIsModalOpen(false);
    setIsCompleteModalOpen(true);
  };
  const currentStageProgress =
    currentStage === 5
      ? 100
      : ((regionWater - currentStageStartWater) /
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
              <div className={styles.treeFloatWrap}>
                <div
                  className={styles.treeScaleWrap}
                  style={{ transform: `scale(${currentTreeScale})` }}
                >
                  <img
                    key={currentStage}
                    src={currentTreeImage}
                    alt={currentStageLabel}
                    className={styles.treeImage}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.waterActionRow}>
            <div className={styles.waterInfoBox}>
              <div className={styles.waterGauge}>
                <div className={styles.waterGaugeInner}>
                  <div
                    className={styles.waterFill}
                    style={{ height: `${currentStageProgress}%` }}
                  />
                </div>

                <img
                  src={waterDropImg}
                  alt="물방울 게이지"
                  className={styles.waterDropImage}
                />
              </div>

              <span className={styles.waterText}>
                {regionWater}h2O/{currentStageTarget}h2O
              </span>
            </div>

            {isLogin ? (
              <button
                className={styles.waterButton}
                onClick={() => setIsModalOpen(true)}
              >
                물 주기(포인트 기여)
              </button>
            ) : (
              <span className={styles.loginGuide}>
                로그인 후 물 주기가 가능합니다.
              </span>
            )}
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
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setWaterAmount(0);
                setIsModalOpen(false);
              }}
            >
              <CloseIcon />
            </button>
            <h3>{selectedRegion.name}에 물을 주시겠어요?</h3>

            <div className={styles.modalContent}>
              <p className={styles.needText}>
                다음 성장까지 필요한 물 {currentStageTarget - regionWater}h2O
              </p>

              {/* 중앙 물방울 */}
              <div className={styles.modalCenter}>
                <div className={styles.modalGauge}>
                  <div className={styles.modalGaugeInner}>
                    <div
                      className={styles.modalFill}
                      style={{ height: `${(waterAmount / MAX_WATER) * 100}%` }}
                    >
                      <div className={styles.modalWave}></div>
                    </div>
                  </div>

                  <img
                    src={waterDropImg}
                    alt="물방울"
                    className={styles.modalWaterDrop}
                  />
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.leftText}>
                    보유 포인트: {ownedPoint}
                  </span>

                  <span className={styles.centerText}>
                    선택한 물: {waterAmount}h2O
                  </span>

                  <span className={styles.rightText}>
                    최대 {MAX_WATER}포인트까지 사용가능
                  </span>
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className={styles.amountButtons}>
                <button
                  className={styles.minusBtn}
                  onClick={() => handleWaterChange(-100)}
                >
                  -100
                </button>
                <button
                  className={styles.minusBtn}
                  onClick={() => handleWaterChange(-50)}
                >
                  -50
                </button>
                <button
                  className={styles.minusBtn}
                  onClick={() => handleWaterChange(-10)}
                >
                  -10
                </button>

                <button
                  className={styles.plusBtn}
                  onClick={() => handleWaterChange(10)}
                >
                  +10
                </button>
                <button
                  className={styles.plusBtn}
                  onClick={() => handleWaterChange(50)}
                >
                  +50
                </button>
                <button
                  className={styles.plusBtn}
                  onClick={() => handleWaterChange(100)}
                >
                  +100
                </button>
              </div>

              <button
                className={styles.confirmFullBtn}
                onClick={handleConfirmWater}
              >
                물 주기
              </button>
            </div>
          </div>
        </div>
      )}
      {isCompleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.completeModalBox}>
            <div className={styles.completeInner}>
              <p className={styles.completeTitle}>
                {resultData.regionName}에 {resultData.donatedWater}h2O
                주었습니다.
              </p>

              <div className={styles.completeWaterWrap}>
                <div className={styles.completeGauge}>
                  <div className={styles.completeGaugeInner}>
                    <div
                      className={styles.completeFill}
                      style={{
                        height: `${Math.min(
                          (resultData.totalWater / resultData.targetWater) *
                            100,
                          100,
                        )}%`,
                      }}
                    >
                      <div className={styles.completeWave}></div>
                    </div>
                  </div>

                  <img
                    src={waterDropImg}
                    alt="물방울"
                    className={styles.completeWaterDrop}
                  />
                </div>

                <p className={styles.completeAmountText}>
                  {resultData.totalWater}h2O/{resultData.targetWater}h2O
                </p>
              </div>

              <p className={styles.remainPointText}>
                남은 보유포인트:{resultData.remainPoint}
              </p>

              <button
                className={styles.completeBtn}
                onClick={() => setIsCompleteModalOpen(false)}
              >
                물주기 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeGrowMain;
