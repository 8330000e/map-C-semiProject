import { useEffect, useRef, useState } from "react";
import styles from "./Map.module.css";
import axios from "axios";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const Map = () => {
  // 네이버 지도 DOM을 참조하기 위한 ref임.
  // 실제 지도가 그려질 div를 가리키기 위해 사용함.
  const mapDivRef = useRef(null);

  // 전체 게시글 수를 저장하는 상태임.
  // 메인 페이지에서 "몇 명의 구민들이"라는 문구에 사용될 값임.
  const [postCount, setPostCount] = useState(0);

  // 한국 전체 지역의 총 탄소 배출량을 저장하는 상태임.
  // 오른쪽 카키색 말풍선 안의 "탄소 배출량" 수치에 사용됨.
  const [countryCo2, setCountryCo2] = useState(0);

  useEffect(() => {
    // 게시글 통계를 백엔드에서 가져와서 메인 맵의 게시물 수를 갱신함.
    // 이 목록에는 지역별 boardCount가 들어오므로, 모든 지역을 더해서 전체 게시물 수를 계산함.
    const fetchBoardCount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKSERVER}/boards/boardCount`);
        const list = response.data;
        if (Array.isArray(list)) {
          const total = list.reduce((sum, item) => {
            // boardCount가 문자열일 수 있으므로 숫자로 변환함.
            const count = Number(item.boardCount || 0);
            return sum + (Number.isNaN(count) ? 0 : count);
          }, 0);
          setPostCount(total);
        }
      } catch (error) {
        console.error("Failed to load board count:", error);
      }
    };

    // 한국 전체 배출량을 백엔드에서 가져옴.
    // 이 값은 전체 국가 배출량을 보여주기 위해 사용함.
    const fetchCountryEmission = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKSERVER}/carbon/total`);
        setCountryCo2(response.data ?? 0);
      } catch (error) {
        console.error("Failed to load country carbon emission:", error);
      }
    };

    fetchBoardCount();
    fetchCountryEmission();
  }, []);

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return;
    }
    const map = new window.naver.maps.Map(mapDivRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
      zoom: 1,
    });
  }, []);
  return (
    <div className={styles.map_div}>
      <div>
        <div className={styles.spot_box}>
          <div className={styles.spot_box_top}>
            <p>대한민국</p>
            <div>
              <div className={styles.spot_box_top_posts}>
                <DescriptionOutlinedIcon sx={{ fontSize: "20px" }} />
                <p>{postCount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div>
            <p>
              <CelebrationOutlinedIcon />
            </p>
            <p>
              {/* 게시물 수 * 2kg는 실제 계산값이 아니라, 게시물을 쓴 사람이 탄소 저감 활동에 참여한 것으로 보는 간단한 추정치임. */}
              <strong>{postCount.toLocaleString()}</strong>명의 구민들이 탄소 배출량{" "}
              <strong>{(postCount * 2).toLocaleString()}kg</strong>을 절감했습니다!
            </p>
          </div>
        </div>
        <div className={styles.map_item}>
          <p>
            <ErrorOutlineOutlinedIcon
              sx={{ color: "#fff", fontSize: "18px" }}
            />
          </p>
          <p>
            {/* 여기에는 한국 전체 지역 배출량을 표시함. */}
            탄소 배출량 {countryCo2.toLocaleString()}kg
          </p>
        </div>
      </div>
      <div id="map" className={styles.map} ref={mapDivRef}></div>
    </div>
  );
};

export default Map;
