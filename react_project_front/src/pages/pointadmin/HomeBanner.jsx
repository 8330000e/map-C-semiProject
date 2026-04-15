import { useState, useEffect } from "react";
import styles from "./HomeBanner.module.css";

import bannerImage1 from "/pointimages/banner1.jpg"; // 실제 이미지 경로로 수정하세요
import bannerImage2 from "/pointimages/banner2.jpg"; // (선택) 움직이게 할 경우 두 번째 이미지
import bannerImage3 from "/pointimages/banner3.jpg";

// 배너 컨텐너
const HomeBanner = () => {
  // 움직이게(자동 슬라이드) 하기 위한 상태
  const [currentSlide, setCurrentSlide] = useState(0);

  // 배너 데이터 (이미지, 굵은 제목, 작은 설명)
  const slides = [
    {
      image: bannerImage1, // image_0.png에 해당하는 이미지
      title: "당신의 작은 힘이",
      subtitle: "세상의 흐름을 바꿉니다.",
    },
    {
      image: bannerImage2, // (선택) 두 번째 이미지가 있다면 추가
      title: "당신의 포인트 참여가",
      subtitle: "아이들의 더 나은 내일로 이어집니다.",
    },
    {
      image: bannerImage3, // image_0.png에 해당하는 이미지
      title: "진행중인 인류의 위기",
      subtitle: "캠페인 참여로 우리의 미래를 지켜주세요.",
    },

    // 더 많은 슬라이드를 추가할 수 있습니다.
  ];

  // 자동으로 슬라이드가 넘어가게 하는 효과 (5초마다)
  useEffect(() => {
    // 이미지가 하나라면 움직일 필요가 없으므로 리턴
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // 5000ms = 5초

    return () => clearInterval(timer); // 컴포넌트가 사라질 때 타이머 정리
  }, [slides.length]);

  return (
    <div
      style={{
        width: "100%",
        height: "450px",
        marginTop: "60px",
        /* position: "relative" 대신 배경 이미지 설정을 활용합니다 */
        backgroundImage: "url('배경이미지경로')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "50px", // 텍스트 위치 조절용
      }}
    >
      <div className={styles.banner_container}>
        {slides.map((slide, index) => (
          //기존 방식에서 내부 이미지가 position: absolute 등으로 붕 떠 있었다면, 후속 요소(게시글)들이 배너의 높이를 인식하지 못하고 위로 올라오게 된다.
          // 배너의 위와 같이 div 자체에 배경을 넣으면 450px만큼의 물리적 공간이 확실히 확보
          <div
            key={index}
            className={`${styles.banner_slide} ${index === currentSlide ? styles.active : ""}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <div className={styles.banner_text}>
              <h3>{slide.title}</h3>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HomeBanner;
