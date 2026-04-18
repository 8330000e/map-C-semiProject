// AdminReportPage.jsx
// 데이터 조회, 상태 선언 등 모든 로직은 여기서 처리하고
// AdminReport 컴포넌트에 props로 내려줌

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminReport from "../../components/admin/AdminReport";
import useAuthStore from "../../store/useAuthStore";

const AdminReportPage = () => {
  const { memberId } = useAuthStore();

  // 신고 목록 전체 (게시글/댓글 신고 모두 포함, 그룹 대표 기준)
  const [reportList, setReportList] = useState([]);

  // 신고 목록에서 클릭한 신고 1건 (모달에 신고 상세 표시용)
  const [selectedReport, setSelectedReport] = useState(null);

  // 상세보기 모달에서 CommunityDetail 컴포넌트에 넘길 게시글/댓글 데이터
  const [boardDetail, setBoardDetail] = useState({});

  // 그룹 펼침 - 펼쳐진 그룹의 상세 신고 목록 + 현재 펼쳐진 키
  const [groupList, setGroupList] = useState([]);
  const [openedKey, setOpenedKey] = useState(null);

  // 모달 open / 원본보기 토글
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // 처리완료 신고의 admin_log + 정지 해제 사유
  const [adminLog, setAdminLog] = useState(null);
  const [logReason, setLogReason] = useState("");

  // 신고 목록 필터 - 유형/카테고리/상태/정렬
  const [reportFilter, setReportFilter] = useState({
    type: "all",
    category: "all",
    status: "all",
    sortBy: "reportDate",
    sortOrder: "desc",
  });

  // 신고 처리 action - 게시글/댓글/회원 조치 + 사유
  const [reportAction, setReportAction] = useState({
    boardAction: "미처리",
    commentAction: "미처리",
    memberAction: "미처리",
    reason: "",
    lockReason: "",
  });

  // CommunityDetail이 렌더링된 DOM 요소를 직접 참조
  // 원본 버튼 클릭 시 이 요소로 스크롤 내리기 위해 사용
  const detailRef = useRef(null); // 처음엔 아무 요소도 참조하지 않음

  // 신고수 정렬 토글 - 현재 sortBy가 reportCount면 desc/asc 뒤집기, 아니면 desc로 시작
  const toggleCountSort = () => {
    setReportFilter({
      ...reportFilter,
      sortBy: "reportCount",
      sortOrder:
        reportFilter.sortBy === "reportCount"
          ? reportFilter.sortOrder === "desc"
            ? "asc"
            : "desc"
          : "desc",
    });
  };

  // 신고일 정렬 토글 - 동일 패턴
  const toggleDateSort = () => {
    setReportFilter({
      ...reportFilter,
      sortBy: "reportDate",
      sortOrder:
        reportFilter.sortBy === "reportDate"
          ? reportFilter.sortOrder === "desc"
            ? "asc"
            : "desc"
          : "desc",
    });
  };

  // 셀렉트 변경 시 reportFilter 상태 업데이트
  const changeReportFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setReportFilter({ ...reportFilter, [name]: value });
  };

  // 라디오 변경 시 reportAction 상태 업데이트
  const changeReportAction = (e) => {
    const { name, value } = e.target;
    setReportAction((prev) => ({ ...prev, [name]: value }));
  };

  // 모달 닫을 때 관련 상태 초기화
  const resetModal = () => {
    setIsModalOpen(false);
    setShowDetail(false);
    setAdminLog(null);
    setReportAction({
      boardAction: "미처리",
      commentAction: "미처리",
      memberAction: "미처리",
      reason: "",
      lockReason: "",
    });
  };

  // 현황판 집계 - 그룹 대표 기준 reportCount 합산 (한 그룹의 처리 상태는 일괄이라 대표 status가 그룹 status)
  const reportStats = useMemo(() => {
    const total = reportList.reduce((sum, r) => sum + (r.reportCount || 0), 0);
    const pending = reportList
      .filter((r) => r.reportStatus === 0)
      .reduce((sum, r) => sum + (r.reportCount || 0), 0);
    const done = total - pending;
    const pendingRate = total === 0 ? 0 : (pending / total) * 100;
    const doneRate = total === 0 ? 0 : (done / total) * 100;
    return { total, pending, done, pendingRate, doneRate };
  }, [reportList]);

  // 신고 목록 전체 조회 - 필터 ALL이면 params에서 제외
  const selectReportList = () => {
    const params = {
      sortBy: reportFilter.sortBy,
      sortOrder: reportFilter.sortOrder,
    };
    if (reportFilter.type !== "all") params.type = reportFilter.type;
    if (reportFilter.category !== "all")
      params.category = reportFilter.category;
    if (reportFilter.status !== "all") params.status = reportFilter.status;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/report`, { params })
      .then((res) => {
        setReportList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 그룹 펼침 - 같은 target_no + target_type 기준 나머지 신고 목록 조회
  const selectReportGroup = (targetNo, targetType, reportNo) => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/reportGroup/${targetNo}/${targetType}/${reportNo}`,
      )
      .then((res) => {
        setGroupList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 게시글 상세 조회 - 원본 보기 + 모달 열기
  const selectDetail = (boardNo) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/detail/${boardNo}`)
      .then((res) => {
        setBoardDetail(res.data);
        setIsModalOpen(true); // 모달 열기
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 처리완료 신고의 admin_log 조회
  const selectAdminLog = (reportNo) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/adminLog/${reportNo}`)
      .then((res) => {
        setAdminLog(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 신고 처리 확정 - 게시글/댓글 조치 + 회원 조치 + admin_log 삽입
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "게시글 및 회원 조치를 진행하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${import.meta.env.VITE_BACKSERVER}/admins/processReport`, {
            ...reportAction,
            reportNo: selectedReport.reportNo,
            targetNo: selectedReport.targetNo,
            targetId: selectedReport.targetId,
            targetType: selectedReport.targetType,
            memberId: memberId,
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "처리가 완료되었습니다.",
              timer: 1500,
            });
            resetModal();
            selectReportList();
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "처리에 실패했습니다.",
            });
          });
      }
    });
  };

  // 정지 해제 처리 - releaseMember 엔드포인트 호출
  const handleRelease = (targetId, logReason) => {
    Swal.fire({
      icon: "warning",
      title: "해당 회원의 정지를 해제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "해제",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${import.meta.env.VITE_BACKSERVER}/admins/releaseMember`, {
            targetId: targetId,
            memberId: memberId,
            reason: logReason,
          })
          .then((res) => {
            Swal.fire({
              icon: "success",
              title: "정지가 해제되었습니다.",
              timer: 5000,
            });
            resetModal();
            selectReportList();
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "해제에 실패했습니다.",
            });
          });
      }
    });
  };

  // 페이지 진입/필터 변경 시 신고 목록 불러오기
  useEffect(() => {
    selectReportList();
  }, [reportFilter]);

  // showDetail이 true로 바뀌는 순간 실행
  // CommunityDetail이 렌더링된 후 해당 위치로 스크롤
  useEffect(() => {
    if (showDetail) {
      // detailRef.current: ref가 붙어있는 실제 DOM 요소
      // ?.: current가 null이면 실행 안 함 (옵셔널 체이닝)
      // scrollIntoView: 해당 요소가 화면에 보이도록 스크롤
      // behavior: "smooth": 부드럽게 스크롤
      detailRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showDetail]); // showDetail 값이 바뀔 때마다 실행

  return (
    <>
      <AdminReport
        reportList={reportList}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
        boardDetail={boardDetail}
        groupList={groupList}
        openedKey={openedKey}
        setOpenedKey={setOpenedKey}
        isModalOpen={isModalOpen}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        adminLog={adminLog}
        logReason={logReason}
        setLogReason={setLogReason}
        reportFilter={reportFilter}
        changeReportFilter={changeReportFilter}
        toggleCountSort={toggleCountSort}
        toggleDateSort={toggleDateSort}
        reportAction={reportAction}
        changeReportAction={changeReportAction}
        detailRef={detailRef}
        resetModal={resetModal}
        selectDetail={selectDetail}
        selectReportGroup={selectReportGroup}
        selectAdminLog={selectAdminLog}
        handleSubmit={handleSubmit}
        handleRelease={handleRelease}
        reportStats={reportStats}
      />
    </>
  );
};

export default AdminReportPage;
