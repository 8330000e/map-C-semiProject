import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./MissionList.module.css";
import useAuthStore from "../../store/useAuthStore";
import Swal from "sweetalert2";

const MissionList = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();

  const [basicMission, setBasicMission] = useState(null);
  const [randomMission, setRandomMission] = useState(null);
  const [bonusMission, setBonusMission] = useState(null);

  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  useEffect(() => {
    if (!memberId) return;

    loadMissions();
    loadAttendanceStatus();
  }, [memberId]);
  const loadMissions = async () => {
    try {
      const missionRes = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/missions`,
      );
      const list = missionRes.data || [];

      const basic = list.find((mission) => mission.missionType === "BASIC");
      const bonus = list.find((mission) => mission.missionType === "BONUS");

      const randomRes = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/missions/random`,
        {
          params: { memberId },
        },
      );

      const random = randomRes.data || null;

      setBasicMission(basic || null);
      setRandomMission(random || null);
      setBonusMission(bonus || null);
    } catch (err) {
      console.error("미션 조회 실패", err);
    }
  };

  const handleAttendanceCheck = async () => {
    if (!memberId) {
      await Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다",
        text: "로그인 후 출석체크를 진행해주세요.",
        confirmButtonText: "확인",
        confirmButtonColor: "#89a93f",
        background: "#f8fbf1",
      });
      return;
    }

    if (attendanceLoading || attendanceChecked) return;

    try {
      setAttendanceLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/missions/attendance/check`,
        {
          memberId,
        },
      );

      setAttendanceChecked(true);

      await Swal.fire({
        icon: "success",
        title: "출석 완료!",
        html: `
          <div style="line-height:1.7;">
            오늘도 탄소 실천에 참여해주셨네요.<br/>
            <strong style="font-size:18px; color:#89a93f;">+1 포인트 지급</strong>
          </div>
        `,
        confirmButtonText: "확인",
        confirmButtonColor: "#89a93f",
      });
    } catch (err) {
      console.error("출석체크 실패", err);
    }
  };
  const loadAttendanceStatus = async () => {
    if (!memberId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/missions/attendance/today`,
        {
          params: { memberId },
        },
      );

      setAttendanceChecked(res.data.checked);
    } catch (err) {
      console.error("출석 상태 조회 실패", err);
    }
  };

  const handleMissionClick = (mission) => {
    if (!mission) return;

    if (mission.missionType === "BASIC") {
      navigate("/community?mode=write&mission=board-write");
      return;
    }

    if (mission.missionType === "RANDOM") {
      console.log("랜덤 미션 클릭", mission);
      return;
    }

    if (mission.missionType === "BONUS") {
      console.log("보너스 미션 클릭", mission);
    }
  };

  const renderMissionCard = (cardTitle, mission, description, buttonText) => {
    if (!mission) {
      return (
        <div className={styles.card}>
          <h3>{cardTitle}</h3>
          <div className={styles.emptyMission}>미션 정보가 없습니다.</div>
        </div>
      );
    }

    return (
      <div className={styles.card}>
        <h3>{cardTitle}</h3>

        <div className={styles.imageBox}>
          <img src={mission.missionImageUrl} alt={mission.missionTitle} />
        </div>

        <h4>{mission.missionTitle}</h4>
        <p>{description}</p>
        <strong>{mission.rewardPoint}포인트 지급</strong>

        <button type="button" onClick={() => handleMissionClick(mission)}>
          {buttonText}
        </button>
      </div>
    );
  };

  return (
    <>
      <div className={styles.hero}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          <ArrowBackIcon fontSize="small" />
          <span>홈으로</span>
        </button>

        <div className={styles.heroText}>
          <h2>탄소 미션</h2>
          <p>매일 미션을 실천하고 포인트를 받아보세요.</p>
          <span>
            기본 미션은 매일 초기화되고, 랜덤 미션은 하루 하나씩 지급됩니다.
          </span>
        </div>

        <button
          className={styles.attendanceButton}
          type="button"
          onClick={handleAttendanceCheck}
          disabled={attendanceLoading || attendanceChecked}
        >
          {attendanceLoading
            ? "처리 중..."
            : attendanceChecked
              ? "출석완료"
              : "출석체크(1포인트)"}
        </button>
      </div>

      <div className={styles.cardSection}>
        {renderMissionCard(
          "기본 미션",
          basicMission,
          "포인트는 하루에 한 번만 지급",
          "게시글 작성",
        )}

        {renderMissionCard(
          "랜덤 미션",
          randomMission,
          "랜덤 미션을 수행해보세요",
          "인증하기",
        )}

        {renderMissionCard(
          "보너스 미션",
          bonusMission,
          "모든 미션 완료 시 추가 포인트 지급",
          "포인트 받기",
        )}
      </div>

      <div className={styles.bottomNotice}>
        오늘의 탄소 실천으로 더 나은 환경을 함께 만들어보세요.
      </div>
    </>
  );
};

export default MissionList;
