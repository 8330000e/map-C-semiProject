import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TreeGrowMain from "../../components/TreeGrowMain/TreeGrowMain";
import styles from "./TreeGrowMainPage.module.css";
import RegionMap from "../../components/mainpage/RegionMap";

const BASE_NOTICE =
  "📢 8개 지역중 거주한 지역에 물을 주세요.📢 나무는 일주일마다 초기화 됩니다..";

const NOTICE_STORAGE_KEY = "tree_temp_notice";
const MARQUEE_START_KEY = "tree_notice_marquee_start";
const MARQUEE_DURATION = 14; // CSS와 맞춰야 함(초)

const TreeGrowMainPage = () => {
  const [selectedRegionNo, setSelectedRegionNo] = useState(2);
  const navigate = useNavigate();

  const [tempNotice, setTempNotice] = useState(null);
  const [marqueeDelay, setMarqueeDelay] = useState(0);
  const noticeTimerRef = useRef(null);

  useEffect(() => {
    const savedNotice = localStorage.getItem(NOTICE_STORAGE_KEY);
    if (!savedNotice) return;

    try {
      const parsed = JSON.parse(savedNotice);
      const now = Date.now();

      if (parsed.expiresAt > now) {
        setTempNotice(parsed);

        const remainTime = parsed.expiresAt - now;

        noticeTimerRef.current = setTimeout(() => {
          setTempNotice(null);
          localStorage.removeItem(NOTICE_STORAGE_KEY);
        }, remainTime);
      } else {
        localStorage.removeItem(NOTICE_STORAGE_KEY);
      }
    } catch (error) {
      console.error("공지 복구 실패:", error);
      localStorage.removeItem(NOTICE_STORAGE_KEY);
    }
  }, []);

  // marquee 시작 시각 복구
  useEffect(() => {
    const now = Date.now();
    let savedStart = localStorage.getItem(MARQUEE_START_KEY);

    if (!savedStart) {
      localStorage.setItem(MARQUEE_START_KEY, String(now));
      savedStart = String(now);
    }

    const elapsedSeconds =
      ((now - Number(savedStart)) / 1000) % MARQUEE_DURATION;

    // 이미 elapsedSeconds 만큼 진행된 상태로 시작
    setMarqueeDelay(-elapsedSeconds);
  }, []);

  const addNotice = (message) => {
    const expiresAt = Date.now() + 60000;

    const newNotice = {
      message,
      expiresAt,
    };

    setTempNotice(newNotice);
    localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify(newNotice));

    if (noticeTimerRef.current) {
      clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = setTimeout(() => {
      setTempNotice(null);
      localStorage.removeItem(NOTICE_STORAGE_KEY);
    }, 60000);
  };

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const marqueeText = useMemo(() => {
    if (tempNotice?.message) {
      return `${BASE_NOTICE}   ✦   ${tempNotice.message}`;
    }
    return BASE_NOTICE;
  }, [tempNotice]);

  return (
    <div className={styles.treeGrowMainPage}>
      <div className={styles.topSection}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← 홈으로
        </button>

        <div className={styles.noticeBox}>
          <span className={styles.noticeLabel}>공지</span>

          <div className={styles.noticeViewport}>
            <div
              className={styles.noticeTrack}
              style={{
                animationDuration: `${MARQUEE_DURATION}s`,
                animationDelay: `${marqueeDelay}s`,
              }}
            >
              <span className={styles.noticeText}>{marqueeText}</span>
              <span className={styles.noticeText}>{marqueeText}</span>
            </div>
          </div>
        </div>
      </div>

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
          <TreeGrowMain
            selectedRegionNo={selectedRegionNo}
            onAddNotice={addNotice}
          />
        </div>
      </div>
    </div>
  );
};

export default TreeGrowMainPage;
