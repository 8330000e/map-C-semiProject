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
  const monthlyGrowthRate =
    lastMonthMember === 0
      ? 0
      : ((thisMonthMember - lastMonthMember) / lastMonthMember) * 100;
  const dailyGrowthRate =
    yesterdayMember === 0
      ? 0
      : ((todayMember - yesterdayMember) / yesterdayMember) * 100;
  const monthSign = monthlyGrowthRate >= 0 ? "+" : "";
  const dailySign = dailyGrowthRate >= 0 ? "+" : "";
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <DashBoard
      totalMember={totalMember}
      todayMember={todayMember}
      monthlyGrowthRate={monthlyGrowthRate}
      dailyGrowthRate={dailyGrowthRate}
      monthSign={monthSign}
      dailySign={dailySign}
    />
  );
};

export default DashBoardPage;
