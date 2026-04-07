import { useEffect, useRef } from "react";
import Community from "../../components/board/Community/Community";
import styles from "./MapCommunityPage.module.css";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const MapCommunityPage = () => {
  return (
    <div className={styles.mapCommunityPage}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.mapBox}>
            <MapInCommunity />
          </div>
        </div>

        <div className={styles.right}>
          <Community />
        </div>
      </div>
    </div>
  );
};

const MapInCommunity = () => {
  const mapDivRef = useRef(null);
  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return;
    }
    const map = new window.naver.maps.Map(mapDivRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 시청 좌표
      zoom: 10,
    });
  }, []);
  useEffect(() => {}, []);

  return (
    <div className={styles.map_div}>
      <div>
        <div className={styles.spot_box}>
          <div className={styles.spot_box_top}>
            <p>대한민국</p>
            <div>
              <div className={styles.spot_box_top_posts}>
                <DescriptionOutlinedIcon sx={{ fontSize: "20px" }} />
                <p>125</p>
              </div>
            </div>
          </div>
          <div>
            <p>
              <CelebrationOutlinedIcon />
            </p>
            <p>
              <strong>1,321명</strong>의 구민들이 탄소 배출량{" "}
              <strong>10,151kg</strong>을 절감했습니다!
            </p>
          </div>
        </div>
        <div className={styles.map_item}>
          <p>
            <ErrorOutlineOutlinedIcon
              sx={{ color: "#fff", fontSize: "18px" }}
            />
          </p>
          <p>탄소 배출량</p>
        </div>
      </div>
      <div id="map" className={styles.map} ref={mapDivRef}></div>
    </div>
  );
};

export default MapCommunityPage;
