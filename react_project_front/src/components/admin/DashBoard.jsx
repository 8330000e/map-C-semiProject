// 대시보드 UI 컴포넌트 - KPI 카드, 라인/바 차트, 요약 정보 표시
// 데이터 계산은 DashBoardPage.jsx에서 다 하고 여기선 props 받아서 렌더링만 함
import styles from "../../pages/admin/DashBoardPage.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Chart.js에서 쓸 요소들 등록 - 안 하면 차트 안 그려짐
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
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
  const lineData = {
    labels: ["4주전", "3주전", "2주전", "1주전"],
    datasets: [
      {
        tension: 0.4,
        label: "회원 증가",
        data: weeklyCount,
        borderColor: "#5B8CFF",
        backgroundColor: "rgba(91, 140, 255, 0.18)",
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "#5B8CFF",
        pointBorderColor: "#5B8CFF",
      },
    ],
  };

  // 바 차트 - 카테고리별 신고 건수
  const reportData = {
    labels: ["광고", "욕설", "스팸", "기타"],
    datasets: [
      {
        label: "카테고리별 신고",
        data: categoryCount,
        backgroundColor: ["#5B8CFF", "#4B5B78", "#F0B04B", "#8D6BFF"],
        borderRadius: 8,
        borderWidth: 0,
        maxBarThickness: 50,
      },
    ],
  };

  // 라인/바 차트 공통 옵션 - 반응형, 범례 숨김, 그리드 색상 설정
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: "#2d3748" },
        ticks: { color: "#a0aec0" },
      },
      y: {
        beginAtZero: true,
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

      {/* 상단 KPI 카드 - 전체 회원 수 / 오늘 가입자 / 미처리 신고 */}
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
