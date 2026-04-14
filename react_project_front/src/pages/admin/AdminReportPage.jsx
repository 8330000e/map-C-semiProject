// AdminReportPage.jsx
// 데이터 조회, 상태 선언 등 모든 로직은 여기서 처리하고
// AdminReport 컴포넌트에 props로 내려줌

import axios from "axios";
import AdminReport from "../../components/admin/AdminReport";
import { useEffect, useState } from "react";
import { useRef } from "react"; // DOM 요소를 직접 참조할 때 쓰는 훅

const AdminReportPage = () => {
  // 신고 목록 전체 (게시글/댓글 신고 모두 포함)
  const [reportList, setReportList] = useState([]);

  // 상세보기 모달에서 CommunityDetail 컴포넌트에 넘길 게시글/댓글 데이터
  const [boardDetail, setBoardDetail] = useState({});

  // 모달 열림/닫힘 상태 (true: 열림, false: 닫힘)
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 신고 목록에서 클릭한 신고 1건 (모달에 신고 상세 표시용)
  const [selectedReport, setSelectedReport] = useState(null);

  // 원본 보기 버튼 클릭 시 CommunityDetail 컴포넌트 표시 여부
  const [showDetail, setShowDetail] = useState(false);

  // CommunityDetail이 렌더링된 DOM 요소를 직접 참조
  // 원본 버튼 클릭 시 이 요소로 스크롤 내리기 위해 사용
  const detailRef = useRef(null); // 처음엔 아무 요소도 참조하지 않음

  const [reportAction, setReportAction] = useState({
    boardAction: "미처리",
    memberAction: "미처리",
    reason: "",
  });

  const changeReportAction = (e) => {
    const { name, value } = e.target;
    setReportAction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/admins/processReport`, {
        ...reportAction,
        reportNo: selectedReport.reportNo,
        targetNo: selectedReport.targetNo,
        targetId: selectedReport.targetId,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 상세보기 아이콘 클릭 시 호출
  // targetType: 'board' 또는 'comment', targetNo: 해당 게시글/댓글 번호
  const selectDetail = (targetType, targetNo) => {
    if (targetType === "board") {
      // 게시글인 경우 백엔드에서 게시글 상세 데이터 조회
      axios
        .get(`${import.meta.env.VITE_BACKSERVER}/boards/detail/${targetNo}`)
        .then((res) => {
          console.log(res);
          setBoardDetail(res.data);
          setIsModalOpen(true); // 모달 열기
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // 댓글인 경우 처리 예정
    }
  };

  // 신고 목록 전체 조회
  const selectReportList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/report`)
      .then((res) => {
        console.log(res);
        setReportList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 페이지 진입하자마자 신고 목록 불러오기
  useEffect(() => {
    selectReportList();
  }, []);

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
        selectDetail={selectDetail}
        boardDetail={boardDetail}
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        detailRef={detailRef} // ref도 props로 내려줌 (컴포넌트에서 직접 DOM에 붙일 수 있게)
        reportAction={reportAction}
        changeReportAction={changeReportAction}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default AdminReportPage;
