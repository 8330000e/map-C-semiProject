import styles from "./DashBoardPage.module.css";

import DashBoard from "../../components/admin/DashBoard";
import { useEffect, useState } from "react";
import axios from "axios";

const DashBoardPage = () => {
  const [totalMember, setTotalMember] = useState(null);
  const [todayMember, setTodayMember] = useState(null);
  const [yesterdayMember, setYesterdayMember] = useState(null);
  const [thisMonthMember, setThisMonthMember] = useState(null);
  const [lastMonthMember, setLastMonthMember] = useState(null);
  const [categoryCount, setCategoryCount] = useState([]);
  const [pendingReport, setPendingReport] = useState(null);
  const totalReportCount = categoryCount.reduce((a, b) => a + b, 0);
  const monthlyGrowthRate =
    lastMonthMember === 0
      ? 0
      : ((thisMonthMember - lastMonthMember) / lastMonthMember) * 100;
  const dailyGrowthRate =
    yesterdayMember === 0
      ? 0
      : ((todayMember - yesterdayMember) / yesterdayMember) * 100;
  const thisMonthRatio =
    thisMonthMember === 0 ? 0 : (thisMonthMember / totalMember) * 100;
  const monthSign = monthlyGrowthRate >= 0 ? "+" : "";
  const dailySign = dailyGrowthRate >= 0 ? "+" : "";

  const maxCount = Math.max(...categoryCount); // categoryCount 중 제일 큰 숫자 반환
  const maxIndex = categoryCount.indexOf(maxCount); // 제일 큰 숫자가 몇번째 인덱스에 있는지
  const maxCategory = ["광고", "욕설", "스팸", "기타"][maxIndex]; // 카테고리 중 maxIndex에 있는 값 꺼내기

  const [weeklyCount, setWeeklyCount] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/dashdata`)
      .then((res) => {
        console.log(res);
        setTotalMember(res.data.totalMember);
        setTodayMember(res.data.todayMember);
        setYesterdayMember(res.data.yesterdayMember);
        setThisMonthMember(res.data.thisMonthMember);
        setLastMonthMember(res.data.lastMonthMember);
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
