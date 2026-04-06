import { useEffect, useRef } from "react";

const REGION_MARKERS = [
  { regionNo: 2, name: "서울", lat: 37.5665, lng: 126.978 },
  { regionNo: 3, name: "경기", lat: 37.4138, lng: 127.5183 },
  { regionNo: 4, name: "인천", lat: 37.4563, lng: 126.7052 },
  { regionNo: 5, name: "강원권", lat: 37.8228, lng: 128.1555 },
  { regionNo: 6, name: "충청권", lat: 36.5184, lng: 127.929 },
  { regionNo: 7, name: "전라권", lat: 35.7175, lng: 127.153 },
  { regionNo: 8, name: "경상권", lat: 35.4606, lng: 128.2132 },
  { regionNo: 9, name: "제주권", lat: 33.4996, lng: 126.5312 },
];

const getMarkerContent = (name, active) => `
  <div style="
    padding: 8px 14px;
    border-radius: 999px;
    background: ${active ? "#9cc63b" : "#ffffff"};
    color: #222;
    font-size: 14px;
    font-weight: 700;
    border: 1px solid rgba(0,0,0,0.08);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    white-space: nowrap;
    transform: translate(-50%, -50%);
  ">
    ${name}
  </div>
`;

const RegionMap = ({ selectedRegionNo, onSelectRegion }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;

    const map = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(36.9, 127.4),
      zoom: 8,
      draggable: true, // 이동 막기
      pinchZoom: true, // 모바일 확대/축소 허용
      scrollWheel: true, // 휠 줌 허용
      keyboardShortcuts: false, // 키보드 이동은 막기
      disableDoubleTapZoom: false,
      disableDoubleClickZoom: false,
      disableTwoFingerTapZoom: false,
      zoomControl: true, // + / - 버튼 표시
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    });

    map.setOptions("minZoom", 7);
    map.setOptions("maxZoom", 9);

    mapInstanceRef.current = map;

    markerRefs.current = REGION_MARKERS.map((region) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(region.lat, region.lng),
        map,
        icon: {
          content: getMarkerContent(
            region.name,
            selectedRegionNo === region.regionNo,
          ),
          anchor: new window.naver.maps.Point(0, 0),
        },
      });

      window.naver.maps.Event.addListener(marker, "click", () => {
        onSelectRegion(region.regionNo);
      });

      return { regionNo: region.regionNo, marker, region };
    });

    setTimeout(() => {
      window.naver.maps.Event.trigger(map, "resize");
      map.setCenter(new window.naver.maps.LatLng(36.35, 127.67));
    }, 100);

    return () => {
      markerRefs.current.forEach(({ marker }) => marker.setMap(null));
      markerRefs.current = [];
    };
  }, [onSelectRegion]);

  useEffect(() => {
    markerRefs.current.forEach(({ regionNo, marker, region }) => {
      marker.setIcon({
        content: getMarkerContent(region.name, selectedRegionNo === regionNo),
        anchor: new window.naver.maps.Point(0, 0),
      });
    });
  }, [selectedRegionNo]);

  return (
    <div
      ref={mapRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default RegionMap;
