// 대시보드 페이지 - 서버에서 통계 데이터 받아서 DashBoard 컴포넌트에 props로 넘겨줌
// 데이터 계산도 여기서 다 처리하고 UI는 DashBoard.jsx에서 담당
import styles from "./DashBoardPage.module.css";

import DashBoard from "../../components/admin/DashBoard";
import { useEffect, useState } from "react";
import axios from "axios";

const DashBoardPage = () => {
  // 회원 통계 상태값들
  const [totalMember, setTotalMember] = useState(null);
  const [todayMember, setTodayMember] = useState(null);
  const [yesterdayMember, setYesterdayMember] = useState(null);
  const [thisMonthMember, setThisMonthMember] = useState(null);
  const [lastMonthMember, setLastMonthMember] = useState(null);

  // 신고 카테고리별 건수 배열 [광고, 욕설, 스팸, 기타]
  const [categoryCount, setCategoryCount] = useState([]);
  const [pendingReport, setPendingReport] = useState(null);

  // 전체 신고 건수 - categoryCount 배열 합산
  const totalReportCount = categoryCount.reduce((a, b) => a + b, 0);

  // 월별/일별 증감률 계산 - 이전 값이 0이면 나누기 방지용으로 0 반환
  const monthlyGrowthRate =
    lastMonthMember === 0
      ? 0
      : ((thisMonthMember - lastMonthMember) / lastMonthMember) * 100;
  const dailyGrowthRate =
    yesterdayMember === 0
      ? 0
      : ((todayMember - yesterdayMember) / yesterdayMember) * 100;

  // 이번달 가입자가 전체 회원 중 몇 퍼센트인지
  const thisMonthRatio =
    thisMonthMember === 0 ? 0 : (thisMonthMember / totalMember) * 100;

  // 증감률 앞에 붙는 부호 (양수면 +, 음수면 그냥 - 붙음)
  const monthSign = monthlyGrowthRate >= 0 ? "+" : "";
  const dailySign = dailyGrowthRate >= 0 ? "+" : "";

  // categoryCount 중 제일 큰 숫자 반환
  const maxCount = Math.max(...categoryCount);
  // 제일 큰 숫자가 몇번째 인덱스에 있는지
  const maxIndex = categoryCount.indexOf(maxCount);
  // 인덱스로 카테고리 이름 꺼냄
  const maxCategory = ["광고", "욕설", "스팸", "기타"][maxIndex];

  // 주간 회원 증가 추이 [4주전, 3주전, 2주전, 1주전]
  const [weeklyCount, setWeeklyCount] = useState([]);

  useEffect(() => {
    // 컴포넌트 마운트 시 대시보드 데이터 한 번만 불러옴
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/dashdata`)
      .then((res) => {
        console.log(res);
        setTotalMember(res.data.totalMember);
        setTodayMember(res.data.todayMember);
        setYesterdayMember(res.data.yesterdayMember);
        setThisMonthMember(res.data.thisMonthMember);
        setLastMonthMember(res.data.lastMonthMember);
        // 신고 카테고리 순서 맞춰서 배열로 넣음
        setCategoryCount([
          res.data.ad,
          res.data.hate,
          res.data.spam,
          res.data.etc,
        ]);
        setWeeklyCount([
          res.data.fourWeekAgo,
          res.data.threeWeekAgo,
          res.data.twoWeekAgo,
          res.data.oneWeekAgo,
        ]);
        setPendingReport(res.data.pendingReport);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <DashBoard
      totalMember={totalMember}
      todayMember={todayMember}
      thisMonthMember={thisMonthMember}
      monthlyGrowthRate={monthlyGrowthRate}
      dailyGrowthRate={dailyGrowthRate}
      thisMonthRatio={thisMonthRatio}
      monthSign={monthSign}
      dailySign={dailySign}
      categoryCount={categoryCount}
      pendingReport={pendingReport}
      totalReportCount={totalReportCount}
      maxCategory={maxCategory}
      maxCount={maxCount}
      weeklyCount={weeklyCount}
    />
  );
};

export default DashBoardPage;
