// 대시보드 페이지 - 서버에서 통계 데이터 받아서 DashBoard 컴포넌트에 props로 넘겨줌
// 데이터 계산도 여기서 다 처리하고 UI는 DashBoard.jsx에서 담당
import { useEffect, useState } from "react";
import axios from "axios";
import DashBoard from "../../components/admin/DashBoard";

const DashBoardPage = () => {
  // 회원 통계 상태값들
  const [totalMember, setTotalMember] = useState(null); // 전체회원
  const [todayMember, setTodayMember] = useState(null); // 오늘가입
  const [yesterdayMember, setYesterdayMember] = useState(null); // 어제가입
  const [thisMonthMember, setThisMonthMember] = useState(null); // 이번달 가입
  const [lastMonthMember, setLastMonthMember] = useState(null); // 저번달 가입

  // 신고 카테고리별 건수 배열 [부적절게시글, 부적절댓글, 스팸, 욕설, 허위, 기타]
  const [categoryCount, setCategoryCount] = useState([]); // 카테고리별 총 신고수
  const [pendingReport, setPendingReport] = useState(null); // 미처리 신고수

  // 주간 회원 증가 추이 [4주전, 3주전, 2주전, 1주전]
  const [weeklyCount, setWeeklyCount] = useState([]);

  // 전체 신고 건수 - categoryCount 배열 합산
  // a: 누적값, b: 현재 요소, 배열을 순회하면서 누적값을 만들기 0은 초기값
  const totalReportCount = categoryCount.reduce((a, b) => a + b, 0);

  // 월별 증감률 (이번달 - 저번달) / 저번달 * 100,    0 나누기 방지
  const monthlyGrowthRate =
    lastMonthMember === 0
      ? 0
      : ((thisMonthMember - lastMonthMember) / lastMonthMember) * 100;
  // 일별 증감률 (오늘 - 어제) / 어제 * 100,     0 나누기 방지
  const dailyGrowthRate =
    yesterdayMember === 0
      ? 0
      : ((todayMember - yesterdayMember) / yesterdayMember) * 100;

  // 전체 회원 중 이번달 가입자 비율 > (이번달 / 전체) * 100   0나누기 방지
  const thisMonthRatio =
    thisMonthMember === 0 ? 0 : (thisMonthMember / totalMember) * 100;

  // 증감률 앞에 붙는 부호 (양수면 +, 음수면 자동으로 붙여줌)
  const monthSign = monthlyGrowthRate >= 0 ? "+" : "";
  const dailySign = dailyGrowthRate >= 0 ? "+" : "";

  // Math.max() 받은 숫자들 중 가장 큰 숫자 리턴, categoryCount는 배열이라 펼처서 넣어줌
  const maxCount = Math.max(...categoryCount);

  // 위에서 계산한 maxCount가 몇번째 index에 있는지 찾아서 리턴
  const maxIndex = categoryCount.indexOf(maxCount);

  // 인덱스로 카테고리 이름 꺼냄
  const maxCategory = [
    "부적절한 게시글",
    "부적절한 댓글",
    "스팸/광고",
    "욕설/비방",
    "허위정보",
    "기타",
  ][maxIndex];

  // 페이지 진입 시 대시보드 통계 한 번에 불러오기
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/dashdata`)
      .then((res) => {
        setTotalMember(res.data.totalMember);
        setTodayMember(res.data.todayMember);
        setYesterdayMember(res.data.yesterdayMember);
        setThisMonthMember(res.data.thisMonthMember);
        setLastMonthMember(res.data.lastMonthMember);
        // 신고 카테고리 순서 맞춰서 배열로 넣음
        setCategoryCount([
          res.data.inappropriateBoard,
          res.data.inappropriateComment,
          res.data.spam,
          res.data.hate,
          res.data.falseInfo,
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
