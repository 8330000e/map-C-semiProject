import { use, useEffect, useRef, useState } from "react";
import Community from "../../components/board/Community/Community";
import styles from "./MapCommunityPage.module.css";
import defaultImg from "../../assets/img/defaultImg.png";
import borderPin from "../../assets/img/borderPin.svg";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CelebrationOutlinedIcon from "@mui/icons-material/CelebrationOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import heart from "../../assets/img/heart.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../../utils/getImageUrl";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const getImageUrl = normalizeImageUrl;

const MapCommunityPage = () => {
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [addr, setAddr] = useState("서울특별시 중구");
  const [lnglat, setLnglat] = useState({
    lat: 37.5665 - 0.001,
    lng: 126.978,
  });
  const [ctpvsgg, setCtpvsgg] = useState({
    ctpv: "서울특별시",
    sgg: "중구",
  });

  return (
    <div className={styles.mapCommunityPage}>
      <div className={styles.to_main}>
        <div onClick={() => (window.location.href = "/")}>
          <ArrowBackIosOutlinedIcon />
          <span>메인으로 돌아가기</span>
        </div>
        ㅣ
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.mapBox}>
            <Map
              sido={sido}
              setSido={setSido}
              sigungu={sigungu}
              setSigungu={setSigungu}
              addr={addr}
              lnglat={lnglat}
              ctpvsgg={ctpvsgg}
              setAddr={setAddr}
              setLnglat={setLnglat}
              setCtpvsgg={setCtpvsgg}
            />
          </div>
        </div>

        <div className={styles.right}>
          <Community
            addr={addr}
            lnglat={lnglat}
            ctpvsgg={ctpvsgg}
            setAddr={setAddr}
            setLnglat={setLnglat}
            setCtpvsgg={setCtpvsgg}
          />
        </div>
      </div>
    </div>
  );
};

const Map = ({
  addr,
  lnglat,
  ctpvsgg,
  setAddr,
  setLnglat,
  setCtpvsgg,
  sido,
  setSido,
  sigungu,
  setSigungu,
}) => {
  // const [detailMode, setDetailMode] = useState(false);
  const navigate = useNavigate();
  const mapDivRef = useRef(null);
  const [markerList, setMarkerList] = useState([]);
  let mapMarkerList = [];
  let mapaddr = "서울특별시 중구";
  let maplnglat = {
    lat: 37.5665 - 0.001,
    lng: 126.978,
  };
  let mapctpvsgg = {
    ctpv: "서울특별시",
    sgg: "중구",
  };
  let detailMode = false;
  let ctpvsgglength = 0;

  const boardView = (boardNo) => {
    if (boardNo) {
      navigate(`/map-community?boardNo=${boardNo}`);
    } else {
      navigate("/map-community");
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/markers`)
      .then((res) => {
        setMarkerList(res.data);
      })
      .catch((err) => {
        console.error("마커 데이터 로드 실패:", err);
      });
  }, []);
  console.log("마커 리스트:", markerList);
  mapMarkerList = { ...markerList };

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return;
    }
    const map = new naver.maps.Map(mapDivRef.current, {
      center: new window.naver.maps.LatLng(
        `${maplnglat.lat}`,
        `${maplnglat.lng}`,
      ),
      zoom: 15,
    });

    const defaultMarker = new naver.maps.Marker({
      position: new window.naver.maps.LatLng(
        `${maplnglat.lat}`,
        `${maplnglat.lng}`,
      ),
      map: map,
      icon: {
        content:
          '<img loading="lazy" decoding="async" src="src/assets/img/marker.png" style="width: 30px; margin: 0px; padding: 0px; border: 0px solid transparent; display: block; min-width: 30px; min-height: none; z-index=99999; -webkit-user-select: none; position: absolute; left: 0px; top: 0px;">',
        size: new naver.maps.Size(22, 35),
        anchor: new naver.maps.Point(11, 35),
      },
    });

    defaultMarker.setTitle("Default Marker");
    defaultMarker.setDraggable(false);

    markerList.map((marker, i) => {
      mapaddr = "선택된 위치 없음";
      const writerAvatar = getImageUrl(marker.memberThumb) || defaultImg;
      const markerSrc = getImageUrl(marker.boardThumb) || defaultImg;
      const markerName = new naver.maps.Marker({
        key: `marker-${i}`,
        position: new window.naver.maps.LatLng(
          `${marker.boardLat}`,
          `${marker.boardLng}`,
        ),
        map: map,
        icon: {
          content: `
          <div>
        <img
        loading="lazy"
        decoding="async"
        src='${markerSrc}'
        style="width: 38px; height: 36px; object-fit: cover; border-radius: 50%;margin: 0px; padding: 0px; z-index:${2 + i}; border: 0px solid transparent; display: block; min-width: 38px; min-height: none; -webkit-user-select: none; position: absolute; left: 0px; top: 0px; transform: translate(15%, 15%);"
        />
        <img
        loading="lazy"
        decoding="async"
        src='src/assets/img/defaultthumbmarker.png'
        style="width: 30px; margin: 0px; padding: 0px; border: 0px solid transparent; display: block; min-width: 50px; min-height: none; -webkit-user-select: none; z-index:${1 + i}; position: absolute; left: 0px; top: 0px;"
        />
      </div>`,
          size: new naver.maps.Size(22, 35),
          anchor: new naver.maps.Point(11, 35),
        },
      });
      markerName.setTitle(marker.boardTitle || "제목 없음" || "Default Marker");
      markerName.setDraggable(false);

      naver.maps.Event.addListener(markerName, "click", (e) => {
        detailMode = !detailMode;
        console.log("marker click");
        e.coord._lat = marker.boardLat;
        e.coord._lng = marker.boardLng;
        naver.maps.Service.reverseGeocode(
          {
            location: e.coord,
          },
          (status, response) => {
            if (status != naver.maps.Service.Status.OK) {
              alert("주소를 찾을 수 없습니다.");
              return;
            }
            mapaddr = response.result.items[0].address;
            ((mapctpvsgg.ctpv = response.result.items[0].addrdetail.sido),
              (mapctpvsgg.sgg = response.result.items[0].addrdetail.sigugun));
          },
        );

        console.log(markerName.key);

        if (detailMode) {
          map.setCenter(
            new window.naver.maps.LatLng(
              markerName.getPosition().lat() + 0.003,
              markerName.getPosition().lng(),
            ),
          );
          map.setZoom(15);
          markerName.setIcon({
            content: `
            <div>
              <div style="position: relative; width: 100%;">
                <div
                style="
                  position: absolute;
                  width: 300px;
                  left: 50%;
                  bottom: 50%;
                  transform: translate(-42%, -260%);
                  height: max-content;
                  border-radius: 25px;
                  border: var(--border2);
                  z-index: ${5000 + 2};
                  padding: 15px 20px;
                  font-size: 15px;
                  font-weight: 600;
                  text-align: center;
                  background-color: var(--gray8);
                "
                >
                <div>
                  <img
                    loading="lazy"
                    decoding="async"
                    src=${borderPin}
                    style="
                      position: absolute;
                      width: 32px;
                      z-index: ${5000 + 3};
                      bottom: 80%;
                      left: 50%;
                      color: #ff593c;
                    "
                  />
                </div>
                <p>${marker.addr}</p>
              </div>
              <div
                style="
                  position: absolute;
                  left: 50%;
                  bottom: 50%;
                  transform: translate(-42%, -10%);
                  margin-top: 60px;
                  width: 300px;
                  height: max-content;
                  border-radius: 25px;
                  border: var(--border2);
                  z-index: ${5000 + 2};
                  padding: 15px 20px;
                  font-size: 15px;
                  font-weight: 600;
                  text-align: center;
                  background-color: var(--gray8);
                  display: flex;
                  flex-direction: column;
                  justify-items: center;
                  align-content: space-between;
                "
                >
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 100%;
                    "
                  >
                    <div
                      style=" display: flex; gap: 8px; align-items: center; "
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src=${defaultImg}
                        alt=""
                        style="
                          width: 35px;
                          height:35px;
                          z-index: ${5000 + 3};
                          border-radius: 50%;
                          border: var(--border2);
                        "
                      />
                    <p>${marker.memberNickname}</p>
                  </div>
                <div
                  style=" display: flex; gap: 1px; align-items: center; "
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src=${heart}
                    alt=""
                    style="
                      width: 25px;
                      z-index: ${5000 + 3};
                      border-radius: 50%;
                    "
                  />
                  <p>${marker.likeCount}</p>
                </div>
              </div>
              <div style=" padding: 8px 4px; line-height: 1; ">
                <div style=" text-align: left; ">${marker.boardTitle.substring(0, 10)}</div>
                  <div
                    style="
                      width: 100%;
                      padding: 5px 0;
                      font-size: 14px;
                      font-weight: 500;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      text-align: left;
                      z-index=${5000 + 3};
                    "
                  >
                    ${marker.boardContent
                      .replace(/<img[^>]*>/gi, "")
                      .replace(/<[^>]*>?/g, "")
                      .substring(0, 30)}
                  </div>
                </div>
              </div>
            </div>
          <div style="position: relative;">
            <img
              loading="lazy"
              decoding="async"
              src=${marker.memberThumb || defaultImg}
              style="width: 38px; height: 36px; object-fit: cover; border-radius: 50%;margin: 0px; padding: 0px; z-index:${2 + i}; border: 0px solid transparent; display: block; min-width: 38px; min-height: none; -webkit-user-select: none; position: absolute; left: 0px; top: 0px; transform: translate(15%, 15%);"
            />
            <img
              loading="lazy"
              decoding="async"
              src='src/assets/img/defaultthumbmarker.png'
              style="width: 30px; margin: 0px; padding: 0px; border: 0px solid transparent; display: block; min-width: 50px; min-height: none; -webkit-user-select: none; z-index:${1 + i}; position: absolute; left: 0px; top: 0px;"
            />
          </div>
          </div>
                `,
            size: new naver.maps.Size(22, 35),
            anchor: new naver.maps.Point(11, 35),
            onClick: boardView(marker.boardNo),
          });
        } else {
          navigate("/map-community");
          markerName.setIcon({
            content: `
          <div>
            <img
              loading="lazy"
              decoding="async"
              src=${marker.memberThumb || defaultImg}
              style="width: 38px; height: 36px; object-fit: cover; border-radius: 50%;margin: 0px; padding: 0px; z-index:${2 + i}; border: 0px solid transparent; display: block; min-width: 38px; min-height: none; -webkit-user-select: none; position: absolute; left: 0px; top: 0px; transform: translate(15%, 15%);"
            />
            <img
              loading="lazy"
              decoding="async"
              src='src/assets/img/defaultthumbmarker.png'
              style="width: 30px; margin: 0px; padding: 0px; border: 0px solid transparent; display: block; min-width: 50px; min-height: none; -webkit-user-select: none; z-index:${1 + i}; position: absolute; left: 0px; top: 0px;"
            />
          </div>`,
            size: new naver.maps.Size(22, 35),
            anchor: new naver.maps.Point(11, 35),
          });
        }
      });
    });

    naver.maps.Event.addListener(map, "click", function (e) {
      console.log("map click");
      detailMode = false;
      defaultMarker.setPosition(e.coord);
      naver.maps.Service.reverseGeocode(
        {
          location: e.coord,
        },
        (status, response) => {
          if (status != naver.maps.Service.Status.OK) {
            alert("주소를 찾을 수 없습니다.");
            return;
          }
          console.log(response);

          setAddr(response.result.items[0].address);
          setLnglat({
            lat: e.coord.lat(),
            lng: e.coord.lng(),
          });
          setCtpvsgg({
            ctpv: response.result.items[0].addrdetail.sido,
            sgg: response.result.items[0].addrdetail.sigugun,
          });
        },
      );
    });
  }, [markerList]);
  useEffect(() => {
    axios
      .get(`${BACKSERVER}/boards/markers&sgg=${ctpvsgg.sgg}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.map_div}>
      <div>
        {detailMode ? (
          ""
        ) : (
          <>
            <div className={styles.spot_box}>
              <div className={styles.spot_box_top}>
                <p>
                  {addr == " "
                    ? "주소 정보가 없습니다"
                    : ctpvsgg.ctpv + " " + ctpvsgg.sgg}
                </p>
                <div>
                  <div className={styles.spot_box_top_posts}>
                    <DescriptionOutlinedIcon sx={{ fontSize: "24px" }} />
                    <p>{}</p>
                  </div>
                </div>
              </div>
              <div>
                <p>
                  <CelebrationOutlinedIcon sx={{ fontSize: "30px" }} />
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
          </>
        )}
      </div>
      <div id="map" className={styles.map} ref={mapDivRef}></div>
    </div>
  );
};

export default MapCommunityPage;
