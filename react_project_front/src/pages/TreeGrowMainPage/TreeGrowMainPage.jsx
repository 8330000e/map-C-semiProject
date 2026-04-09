import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TreeGrowMain from "../../components/TreeGrowMain/TreeGrowMain";
import styles from "./TreeGrowMainPage.module.css";
import RegionMap from "../../components/mainpage/RegionMap";

const BASE_NOTICE =
  "📢 8개 지역중 거주한 지역에 물을 주세요. 📢 나무는 일주일마다 초기화 됩니다.";

const NOTICE_STORAGE_KEY = "tree_temp_notice";
const NOTICE_DURATION = 60000; // 유저 공지 1분 유지
const SLIDE_DURATION = 3000; // 공지 3초마다 변경

const TreeGrowMainPage = () => {
  const [selectedRegionNo, setSelectedRegionNo] = useState(2);
  const navigate = useNavigate();

  const [tempNotice, setTempNotice] = useState(null);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);

  const noticeTimerRef = useRef(null);
  const slideTimerRef = useRef(null);

  // 저장된 임시 공지 복구
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

  // 공지 추가
  const addNotice = (message) => {
    const expiresAt = Date.now() + NOTICE_DURATION;

    const newNotice = {
      id: `temp-${Date.now()}`,
      message: `${message}`,
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
    }, NOTICE_DURATION);
  };

  // 공지 리스트 구성
  const notices = useMemo(() => {
    const list = [
      {
        id: "base",
        message: BASE_NOTICE,
      },
    ];

    if (tempNotice?.message) {
      list.push({
        id: tempNotice.id || "temp",
        message: tempNotice.message,
      });
    }

    return list;
  }, [tempNotice]);

  // 공지 자동 슬라이드
  useEffect(() => {
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current);
    }

    if (notices.length <= 1) {
      setCurrentNoticeIndex(0);
      return;
    }

    slideTimerRef.current = setInterval(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % notices.length);
    }, SLIDE_DURATION);

    return () => {
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, [notices]);

  // notices 길이 변경 시 index 보정
  useEffect(() => {
    if (currentNoticeIndex >= notices.length) {
      setCurrentNoticeIndex(0);
    }
  }, [currentNoticeIndex, notices.length]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        clearTimeout(noticeTimerRef.current);
      }
      if (slideTimerRef.current) {
        clearInterval(slideTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.treeGrowMainPage}>
      <div className={styles.topSection}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← 홈으로
        </button>

        <div className={styles.noticeBox}>
          <span className={styles.noticeLabel}>공지</span>

          <div className={styles.noticeViewport}>
            {notices.map((notice, index) => (
              <div
                key={notice.id}
                className={`${styles.noticeSlide} ${
                  index === currentNoticeIndex ? styles.active : ""
                }`}
                aria-hidden={index !== currentNoticeIndex}
              >
                <span className={styles.noticeText}>{notice.message}</span>
              </div>
            ))}
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
