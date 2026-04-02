import { useEffect, useState } from "react";
import styles from "./AdminDashBoard.module.css";
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

const AdminDashBoard = () => {
  // 라인 차트 데이터 (회원 증가 - 하드코딩)
  const lineData = {
    labels: ["4주전", "3주전", "2주전", "1주전"],
    datasets: [
      {
        tension: 0.4,
        label: "회원 증가",
        data: [28, 45, 36, 53],
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

  // 바 차트 데이터 (카테고리별 신고 - 하드코딩)
  const reportData = {
    labels: ["광고", "욕설", "스팸", "기타"],
    datasets: [
      {
        label: "카테고리별 신고",
        data: [17, 9, 12, 5],
        backgroundColor: ["#5B8CFF", "#4B5B78", "#F0B04B", "#8D6BFF"],
        borderRadius: 8,
        borderWidth: 0,
        maxBarThickness: 50,
      },
    ],
  };

  // 공통 차트 옵션
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

      {/* 상단 KPI 카드 영역 */}
      <div className={styles.card_wrap}>
        <div className={styles.card}>
          <p>전체 회원 수</p>
          <h2>812명</h2>
          <span>+42% 이번달</span>
        </div>
        <div className={styles.card}>
          <p>오늘 가입자</p>
          <h2>13명</h2>
          <span>7% 어제대비</span>
        </div>
        <div className={styles.card}>
          <p>미처리 신고</p>
          <h2>3건</h2>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className={styles.chart_wrap}>
        <div className={styles.line_chart}>
          <Line data={lineData} options={options} />
        </div>
        <div className={styles.bar_chart}>
          <Bar data={reportData} options={options} />
        </div>
      </div>

      {/* 하단 요약 */}
      <div className={styles.totalInfo}>
        <div>
          전체 기간 총 신고건 <span className={styles.point}>43건</span> - 최다
          카테고리 <span className={styles.point}>[광고]</span>{" "}
          <span className={styles.point}>17건</span>
        </div>
        <div>
          이번 달 신규 회원 총 <span className={styles.point}>173명</span> -
          전체 회원 중 <span className={styles.point}>24%</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
