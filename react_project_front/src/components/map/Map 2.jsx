import { useEffect, useRef } from "react";
import styles from "./Map.module.css";

const Map = () => {
  const mapDivRef = useRef(null);
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
      <div id="map" className={styles.map} ref={mapDivRef}></div>
    </div>
  );
};

export default Map;
