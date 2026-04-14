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
    <div className={styles.banner_container}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.banner_slide} ${
            index === currentSlide ? styles.active : ""
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className={styles.banner_text}>
            <h3>{slide.title}</h3>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default HomeBanner;
