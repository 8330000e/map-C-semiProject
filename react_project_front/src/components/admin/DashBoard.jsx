// 대시보드 UI 컴포넌트 - KPI 카드, 라인/바 차트, 요약 정보 표시
// 데이터 계산은 DashBoardPage.jsx에서 다 하고 여기선 props 받아서 렌더링만 함
import styles from "../../pages/admin/DashBoardPage.module.css";
import {
  Chart as ChartJS, // 별칭
  CategoryScale, // chart.js 안에 있는 기능들 꺼내옴 아래 동일
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"; // 여기서 꺼내옴
import { Line, Bar } from "react-chartjs-2"; // chart.js를 리액트 컴포넌트에서 사용할 수 있게 해줌

// Chart.js에서 쓸 요소들 등록 다 위에서 꺼낸 기능들임 - 안 하면 차트 안 그려짐
ChartJS.register(
  CategoryScale, // x축
  LinearScale, // y축
  PointElement, // line 점
  LineElement, // 선
  BarElement, // 막대
  Title, // 차트제목
  Tooltip, // 마우스 올리면 나오는 툴팁
  Legend, // 범례
  Filler, // line 아래 배경 채우기
);

const DashBoard = ({
  totalMember,
  todayMember,
  monthlyGrowthRate,
  dailyGrowthRate,
  monthSign,
  dailySign,
  categoryCount,
  pendingReport,
  totalReportCount,
  maxCategory,
  maxCount,
  thisMonthMember,
  thisMonthRatio,
  weeklyCount,
}) => {
  // 라인 차트 - 주간 회원 증가 추이
  // <Line /> 에 넘겨줄 데이터 객체
  const lineData = {
    labels: ["4주전", "3주전", "2주전", "1주전"], // x축에 표시되는 텍스트
    datasets: [
      // 실제 차트 데이터 []인 이유는 선이 여러 개 들어갈 수 있음 (일단1개)
      {
        tension: 0.4, // 선 굴곡도
        label: "회원 증가", // 범례에 표시되는 이름
        data: weeklyCount, // 실제 데이터
        borderColor: "#5B8CFF", // 선 색깔
        backgroundColor: "rgba(91, 140, 255, 0.18)", // 선 아래 채우는 색 (투명도라 rgba)
        fill: true, // 선 아래 면적 채울지 말지
        pointRadius: 3, // 데이터 점 크기
        pointHoverRadius: 5, // 점 크기 hover 마우스 올리면 5로 키움
        pointBackgroundColor: "#5B8CFF", // 점 안쪽 색
        pointBorderColor: "#5B8CFF", // 점 테두리 색
      },
    ],
  };

  // 바 차트 - 카테고리별 신고 건수
  // <Bar /> 에 넘겨줄 데이터 객체
  const reportData = {
    labels: [
      "부적절한 게시글",
      "부적절한 댓글",
      "스팸/광고",
      "욕설/비방",
      "허위정보",
      "기타",
    ], // x축 텍스트
    datasets: [
      // 실제 차트 데이터
      {
        label: "카테고리별 신고", // 막대 범례
        data: categoryCount, // 실제 데이터
        backgroundColor: [
          "#5B8CFF",
          "#4B5B78",
          "#F0B04B",
          "#8D6BFF",
          "#7a6B12",
          "#246B12",
        ], // 막대 색깔 각각 지정 가능
        borderRadius: 8, // 막대 border값
        borderWidth: 0, // border: 0px
        maxBarThickness: 50, // 막대 최대 두께
      },
    ],
  };

  // line, bar 차트 공통 옵션 설정
  const options = {
    responsive: true, // 부모 컨테이너 크기에 맞게 차트 크기 자동조절
    maintainAspectRatio: false, //비율 고정 해제. 컨테이너 높이를 CSS로 직접 제어할 수 있게 됨. (true면 width 기준으로 height가 자동 계산돼서 CSS height가 무시됨)
    // plugins: { legend: { display: false } }, // 범례 숨김

    // x축, y축 스타일
    scales: {
      x: {
        grid: { color: "#2d3748" }, // 격자선 색
        ticks: { color: "#a0aec0" }, // 숫자, 텍스트 색
      },
      y: {
        beginAtZero: true, // y축 0부터 시작
        grid: { color: "#2d3748" },
        ticks: { color: "#a0aec0" },
      },
    },
  };

  return (
    <div className={styles.dashboard_wrap}>
      <div className={styles.content_title}>
        <span>대시보드</span>
      </div>

      {/* 상단 카드 영역 */}
      <div className={styles.card_wrap}>
        <div className={styles.card}>
          <p>전체 회원 수</p>
          <h2>{totalMember}명</h2>
          <span>
            {monthSign}
            {monthlyGrowthRate.toFixed(1)}% 지난 달 대비
          </span>
        </div>
        <div className={styles.card}>
          <p>오늘 가입자</p>
          <h2>{todayMember}명</h2>
          <span>
            {dailySign}
            {dailyGrowthRate.toFixed(1)}% 어제 대비
          </span>
        </div>
        <div className={styles.card}>
          <p>미처리 신고</p>
          <h2>{pendingReport}건</h2>
        </div>
      </div>

      {/* 차트 영역 - 왼쪽 라인차트(주간 회원), 오른쪽 바차트(신고 카테고리) */}
      <div className={styles.chart_wrap}>
        <div className={styles.line_chart}>
          <Line data={lineData} options={options} />
        </div>
        <div className={styles.bar_chart}>
          <Bar data={reportData} options={options} />
        </div>
      </div>

      {/* 하단 요약 텍스트 */}
      <div className={styles.totalInfo}>
        <div>
          전체 기간 총 신고건{" "}
          <span className={styles.point}>{totalReportCount}건</span> - 최다
          카테고리 <span className={styles.point}>[{maxCategory}]</span>{" "}
          <span className={styles.point}>{maxCount}건</span>
        </div>
        <div>
          이번 달 신규 회원 총{" "}
          <span className={styles.point}>{thisMonthMember}명</span> - 전체 회원
          중 <span className={styles.point}>{thisMonthRatio.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
