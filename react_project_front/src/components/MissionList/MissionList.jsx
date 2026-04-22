import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import styles from "./MissionList.module.css";
import useAuthStore from "../../store/useAuthStore";
import Swal from "sweetalert2";
import ImageIcon from "@mui/icons-material/Image";

const MissionList = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();

  const [basicMission, setBasicMission] = useState(null);
  const [randomMission, setRandomMission] = useState(null);
  const [bonusMission, setBonusMission] = useState(null);

  const [attendanceChecked, setAttendanceChecked] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [basicMissionCompleted, setBasicMissionCompleted] = useState(false);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const [certPreview, setCertPreview] = useState("");

  const [randomMissionCompleted, setRandomMissionCompleted] = useState(false);

  const [bonusMissionCompleted, setBonusMissionCompleted] = useState(false);
  const [bonusMissionAvailable, setBonusMissionAvailable] = useState(false);

  const [randomMissionCertImage, setRandomMissionCertImage] = useState("");

  useEffect(() => {
    if (!memberId) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다",
        text: "미션 페이지는 로그인 후 이용할 수 있습니다.",
        showCancelButton: true,
        confirmButtonText: "로그인",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/members/login", { state: { from: "/mission" } });
        } else {
          navigate("/");
        }
      });
    }
  }, [memberId, navigate]);

  useEffect(() => {
    if (!memberId) return;

    loadMissions();
    loadAttendanceStatus();
    loadBasicMissionStatus();
    loadBonusMissionStatus();
  }, [memberId]);

  useEffect(() => {
    updateBonusMissionState(
      basicMissionCompleted,
      randomMissionCompleted,
      bonusMissionCompleted,
    );
  }, [basicMissionCompleted, randomMissionCompleted, bonusMissionCompleted]);

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

      if (random?.missionNo) {
        loadRandomMissionStatus(random.missionNo);
      } else {
        setRandomMissionCompleted(false);
      }
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

      const { streak, bonusPoint, totalPoint } = res.data;

      await Swal.fire({
        icon: "success",
        title: "출석 완료!",
        html: `
    <div style="line-height:1.7;">
      오늘도 탄소 실천에 참여해주셨네요.<br/>
      ${
        bonusPoint > 0
          ? `<strong style="font-size:18px; color:#89a93f;">${streak}일 연속 출석! 총 +${totalPoint} 포인트 지급</strong>`
          : `<strong style="font-size:18px; color:#89a93f;">+${totalPoint} 포인트 지급</strong>`
      }
    </div>
  `,
        confirmButtonText: "확인",
        confirmButtonColor: "#89a93f",
      });
    } catch (err) {
      console.error("출석체크 실패", err);
    } finally {
      setAttendanceLoading(false);
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
  const loadBasicMissionStatus = async () => {
    if (!memberId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/missions/basic/today`,
        {
          params: { memberId },
        },
      );

      setBasicMissionCompleted(res.data.completed === true);
    } catch (err) {
      console.error("기본 미션 상태 조회 실패", err);
    }
  };
  const loadRandomMissionStatus = async (missionNo) => {
    if (!memberId || !missionNo) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/missions/random/today/completed`,
        {
          params: { memberId, missionNo },
        },
      );

      setRandomMissionCompleted(res.data.completed === true);
      setRandomMissionCertImage(res.data.certImageUrl || "");
    } catch (err) {
      console.error("랜덤 미션 상태 조회 실패", err);
    }
  };

  const handleMissionClick = (mission) => {
    if (!mission) return;

    if (mission.missionType === "BASIC") {
      if (basicMissionCompleted) return;
      navigate("/community?mode=write&mission=board-write", {
        state: { fromMission: true },
      });
      return;
    }

    if (mission.missionType === "RANDOM") {
      if (randomMissionCompleted) return;
      setIsCertModalOpen(true);
      return;
    }

    if (mission.missionType === "BONUS") {
      handleBonusMissionClaim();
    }
  };

  const getImageUrl = (value, type = "mission") => {
    if (!value) return "";

    // 이미 완전한 주소면 그대로 사용
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }

    // 이미 /uploads/... 처럼 경로가 들어있으면 서버 주소만 붙임
    if (value.startsWith("/")) {
      return `${import.meta.env.VITE_BACKSERVER}${value}`;
    }

    // 파일명만 저장된 경우
    if (type === "cert") {
      return `${import.meta.env.VITE_BACKSERVER}/uploads/mission/random/${value}`;
    }

    return `${import.meta.env.VITE_BACKSERVER}/uploads/mission/${value}`;
  };

  const renderMissionCard = (
    cardTitle,
    mission,
    description,
    buttonText,
    completed = false,
    disabled = false,
  ) => {
    if (!mission) {
      return (
        <div className={styles.card}>
          <h3>{cardTitle}</h3>
          <div className={styles.emptyMission}>미션 정보가 없습니다.</div>
        </div>
      );
    }

    return (
      <div
        className={`${styles.card} ${completed ? styles.completedCard : ""}`}
      >
        <h3>{cardTitle}</h3>

        <div className={styles.imageBox}>
          <img
            loading="lazy"
            decoding="async"
            src={
              mission.missionType === "RANDOM"
                ? completed && randomMissionCertImage
                  ? getImageUrl(randomMissionCertImage, "cert")
                  : mission.missionImageUrl
                : mission.missionType === "BONUS"
                  ? completed
                    ? "/images/bonus-open.png"
                    : "/images/bonus.png"
                  : mission.missionImageUrl
            }
            alt={mission.missionTitle}
          />
        </div>

        <h4>{mission.missionTitle}</h4>
        <p>{completed ? "오늘 미션을 완료했습니다." : description}</p>
        <strong>{mission.rewardPoint}포인트 지급</strong>

        <button
          type="button"
          onClick={() => handleMissionClick(mission)}
          disabled={completed || disabled}
          className={
            completed
              ? styles.completedButton
              : disabled
                ? styles.disabledButton
                : ""
          }
        >
          {completed ? "완료" : buttonText}
        </button>
      </div>
    );
  };

  const handleCertFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCertFile(file);
    setCertPreview(URL.createObjectURL(file));
  };
  const handleCloseCertModal = () => {
    setIsCertModalOpen(false);
    setCertFile(null);
    setCertPreview("");
  };

  const handleSubmitCertification = async () => {
    if (!certFile) {
      await Swal.fire({
        icon: "warning",
        title: "사진을 선택해주세요",
        text: "인증할 이미지를 먼저 업로드해주세요.",
        confirmButtonColor: "#89a93f",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("memberId", memberId);
      formData.append("missionNo", randomMission.missionNo);
      formData.append("certImage", certFile);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/missions/random/certify`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setRandomMissionCompleted(true);
      setRandomMissionCertImage(res.data.certImageUrl || "");

      await Swal.fire({
        icon: "success",
        title: "인증 완료!",
        text: "랜덤 미션 완료! 20포인트 지급 🎉",
        confirmButtonColor: "#89a93f",
      });

      handleCloseCertModal();
      await loadMissions();
      await loadBonusMissionStatus();
    } catch (err) {
      console.error(err);

      await Swal.fire({
        icon: "error",
        title: "인증 실패",
        text: err.response?.data || "서버 오류가 발생했습니다.",
        confirmButtonColor: "#d33",
      });
    }
  };
  const updateBonusMissionState = (
    basicCompleted,
    randomCompleted,
    bonusCompleted,
  ) => {
    setBonusMissionAvailable(
      basicCompleted && randomCompleted && !bonusCompleted,
    );
  };

  const loadBonusMissionStatus = async () => {
    if (!memberId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKSERVER}/missions/bonus/today`,
        {
          params: { memberId },
        },
      );

      setBonusMissionCompleted(res.data.completed === true);
    } catch (err) {
      console.error("보너스 미션 상태 조회 실패", err);
    }
  };

  const handleBonusMissionClaim = async () => {
    if (!memberId) return;

    if (!basicMissionCompleted || !randomMissionCompleted) {
      return;
    }

    if (bonusMissionCompleted) {
      await Swal.fire({
        icon: "info",
        title: "이미 수령 완료",
        text: "오늘 보너스 미션 보상은 이미 받았습니다.",
        confirmButtonColor: "#89a93f",
      });
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/missions/bonus/claim`,
        {
          memberId,
          missionNo: bonusMission?.missionNo,
        },
      );

      setBonusMissionCompleted(true);
      setBonusMissionAvailable(false);

      await Swal.fire({
        icon: "success",
        title: "보너스 미션 완료!",
        text: `${bonusMission?.rewardPoint || 30}포인트 지급 완료 🎉`,
        confirmButtonColor: "#89a93f",
      });
    } catch (err) {
      console.error("보너스 미션 지급 실패", err);

      await Swal.fire({
        icon: "error",
        title: "보너스 지급 실패",
        text: err.response?.data || "서버 오류가 발생했습니다.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <>
      <div className={styles.hero}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          <ArrowBackIosOutlinedIcon fontSize="small" />
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
          {attendanceChecked ? "출석완료" : "출석체크(5포인트)"}
        </button>
      </div>

      <div className={styles.cardSection}>
        {renderMissionCard(
          "기본 미션",
          basicMission,
          "포인트는 하루에 한 번만 지급",
          "게시글 작성",
          basicMissionCompleted,
        )}

        {renderMissionCard(
          "랜덤 미션",
          randomMission,
          "랜덤 미션을 수행해보세요",
          "인증하기",
          randomMissionCompleted,
        )}

        {renderMissionCard(
          "보너스 미션",
          bonusMission,
          bonusMissionAvailable
            ? "모든 미션 완료! 보너스 포인트를 받아보세요"
            : "기본/랜덤 미션 완료 시 추가 포인트 지급",
          "포인트 받기",
          bonusMissionCompleted,
          !bonusMissionAvailable && !bonusMissionCompleted,
        )}
      </div>

      <div className={styles.bottomNotice}>
        오늘의 탄소 실천으로 더 나은 환경을 함께 만들어보세요.
      </div>

      {isCertModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseCertModal}>
          <div
            className={styles.certModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseButton}
              onClick={handleCloseCertModal}
            >
              ×
            </button>

            <div className={styles.modalHeader}>
              <h3>미션 인증하기</h3>
              <p>랜덤 미션 수행 사진을 업로드해주세요.</p>
            </div>

            <label className={styles.uploadBox}>
              {certPreview ? (
                <img
                  src={certPreview}
                  alt="인증 미리보기"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.uploadPlaceholder}>
                  <div className={styles.placeholderIcon}>
                    <ImageIcon size={50} strokeWidth={1.5} />
                  </div>
                  <strong>인증 사진 추가</strong>
                  <span>클릭해서 이미지를 선택해주세요</span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleCertFileChange}
                hidden
              />
            </label>

            <div className={styles.fileGuide}>JPG, PNG 이미지 업로드 가능</div>

            <div className={styles.modalButtonGroup}>
              <button
                type="button"
                className={styles.certSubmitButton}
                onClick={handleSubmitCertification}
              >
                인증하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionList;
