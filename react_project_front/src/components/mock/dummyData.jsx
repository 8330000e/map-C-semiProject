// 설명: src/components/mock/dummyData.jsx 컴포넌트/모듈 파일입니다. 필요한 로직 주석을 추가하세요.
const dummyData = Array.from({ length: 30 }, (_, i) => {
  const activities = [
    "자전거 출근 인증",
    "제로웨이스트 샵 방문",
    "플로깅 활동",
    "용기내 챌린지",
    "안 쓰는 플러그 뽑기",
  ];
  const activity = activities[i % activities.length];

  // 🚀 랜덤 위치 리스트 (위도, 경도 포함)
  const locations = [
    { name: "서울시 강남구", lat: 37.4979, lng: 127.0276 },
    { name: "서울시 마포구", lat: 37.5563, lng: 126.9227 },
    { name: "서울시 송파구", lat: 37.5145, lng: 127.1062 },
    { name: "서울시 영등포구", lat: 37.5264, lng: 126.8962 },
    { name: "서울시 성동구", lat: 37.5635, lng: 127.0365 },
    { name: "서울시 용산구", lat: 37.5326, lng: 126.9908 },
    { name: "서울시 서초구", lat: 37.4837, lng: 127.0324 },
    { name: "서울시 동작구", lat: 37.5124, lng: 126.9395 },
    { name: "서울시 은평구", lat: 37.6027, lng: 126.9291 },
    { name: "서울시 강동구", lat: 37.5301, lng: 127.1238 },
  ];

  // 랜덤하게 하나 선택
  const randomLoc = locations[Math.floor(Math.random() * locations.length)];

  // 날짜 포맷: 2026.03.01 형식
  const day = String((i % 25) + 1).padStart(2, "0");
  const date = `2026.03.${day}`;

  // 랜덤 댓글 생성
  const commentTemplates = [
    "정말 멋진 활동이네요! 저도 동참하겠습니다. 🌱",
    "2026년 탄소 중립 가즈아~! 응원합니다!",
    "위치가 어디인가요? 저도 가보고 싶네요.",
    "작은 실천이 모여 큰 변화를 만드네요. 보기 좋습니다.",
  ];

  const postComments = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    (v, j) => ({
      id: Date.now() + i + j,
      user: `에코친구${Math.floor(Math.random() * 100)}`,
      text: commentTemplates[
        Math.floor(Math.random() * commentTemplates.length)
      ],
      date: "방금 전",
    }),
  );

  return {
    id: i + 1,
    author: `에코워리어${i + 1}`,
    title: `${activity}로 탄소 발자국 줄이기!`,
    content: `오늘은 ${activity}를 실천했습니다. 2026년 3월의 따뜻한 날씨 속에 탄소 절감을 실천하니 기분이 좋네요. 여러분도 함께해요!`,
    date: date,
    likes: Math.floor(Math.random() * 80) + 10,
    comments: postComments,
    locationName: randomLoc.name, // 🚀 랜덤 주소 이름
    // 좌표값에 미세한 오차를 주어 핀이 겹치지 않게 함
    location: {
      lat: randomLoc.lat + (Math.random() - 0.5) * 0.01,
      lng: randomLoc.lng + (Math.random() - 0.5) * 0.01,
    },
  };
});

const storeDummyData = (() => {
  const productTemplate = [
    "업사이클 청바지 재생 판매",
    "중고 자전거 프레임 + 수리 키트",
    "재활용 유리병 화분 5개 세트",
    "친환경 우드 에코 테이블",
    "재사용 캔들잔 (빈티지)",
    "중고 컴퓨터 모니터 24인치",
    "업사이클 데님 백팩",
    "재활용 플라스틱 정리함",
    "중고 리퍼폰 (배터리 90% 이상)",
    "중고 태양광 후면 조명",
    "빈티지 우드 의자(재활용)",
    "리사이클 용기 키트 3종",
    "중고 전기자전거 배터리",
    "업사이클 티셔츠 6장 묶음",
    "친환경 대나무 칫솔 세트",
    "재사용 가능 텀블러 (중고)",
    "플라스틱 재활용 키트",
    "중고 캠핑 그릴 + 보관백",
    "리사이클 타이어 재생용품",
    "중고 노트북 (SSD 240GB)",
    "재활용 패브릭 쿠션",
    "중고 공기청정기",
    "업사이클 나무 조명",
    "중고 서랍장",
    "재사용 유리컵 세트",
  ];

  return Array.from({ length: 75 }, (_, index) => {
    const i = index;
    const title = productTemplate[i % productTemplate.length];

    const priceValue = Math.floor(Math.random() * 80 + 5) * 1000;
    return {
      id: 1001 + i,
      title,
      price: `${priceValue.toLocaleString()}원`, // 1000 단위 콤마 추가
      author: `에코상인${(i % 30) + 1}`,
      date: `2026.03.${String((i % 28) + 1).padStart(2, "0")}`,
      comments: Math.floor(Math.random() * 12),
      viewCount: Math.floor(Math.random() * 2000) + 100,
    };
  });
})();

// dummyData.jsx
// - dummyData: 메인 게시판(활동로그)용
// - storeDummyData: 중고장터 상품용
// - viewCount는 인기순 정렬에 사용합니다
export { dummyData, storeDummyData };
export default dummyData;
