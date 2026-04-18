// 게시글 모니터링 페이지 - 데이터/API 처리 담당, UI는 AdminBoard.jsx에서
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import AdminBoard from "../../components/admin/AdminBoard";

const AdminBoardPage = () => {
  // 회원 관리에서 "게시글 수" 클릭으로 넘어오면 state.memberId로 특정 회원 글만 필터링
  const location = useLocation();
  const memberId = location.state?.memberId;

  // 게시글 목록 + 선택된 게시글 (모달 상세 표시용)
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);

  // 게시글 상세 모달 open 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 게시글 목록 필터 - keyword(감지여부)/risk(위험도)/reportSort(신고수)/sort(날짜)
  const [boardFilter, setBoardFilter] = useState({
    keyword: "",
    risk: "all",
    sort: "desc",
    reportSort: "all",
  });

  // 작성일시 정렬 토글 (최신순 <-> 오래된순)
  const toggleSort = () => {
    setBoardFilter((prev) => ({
      ...prev,
      sort: prev.sort === "desc" ? "asc" : "desc",
    }));
  };

  // 셀렉트 변경 시 boardFilter 상태 업데이트
  const changeBoardFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBoardFilter({ ...boardFilter, [name]: value });
  };

  // 게시글 목록 조회 - 필터값 ALL이면 params에서 제외 (백엔드 required=false)
  const selectBoardList = () => {
    const params = {};
    if (boardFilter.keyword.trim()) params.keyword = boardFilter.keyword;
    if (boardFilter.risk !== "all") params.risk = boardFilter.risk;
    if (boardFilter.reportSort !== "all")
      params.reportSort = boardFilter.reportSort;
    if (memberId) params.memberId = memberId; // 회원관리에서 넘어온 경우에만

    params.sort = boardFilter.sort; // sort는 무조건 보냄 asc/desc
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/board`, { params })
      .then((res) => {
        setBoardList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 게시글 상세 조회 - 아이콘 클릭 시 모달 열고 데이터 세팅
  const getBoardDetail = (boardNo) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/detail/${boardNo}`)
      .then((res) => {
        setSelectedBoard(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 오늘 날짜 YY/MM/DD 형태 (DB sysdate 기본 포맷과 맞춤)
  const todayStr = useMemo(() => {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}/${mm}/${dd}`;
  }, []);

  // 현황판 집계 - 총게시글/오늘작성, 감지된 키워드 vs 정상 비율 (시각화)
  const boardStats = useMemo(() => {
    const total = boardList.length;
    const todayCount = boardList.filter((b) =>
      String(b.boardDate || "").startsWith(todayStr),
    ).length;
    const detected = boardList.filter((b) => b.detectedKeyword).length;
    const safe = total - detected;
    const detectedRate = total === 0 ? 0 : (detected / total) * 100;
    const safeRate = total === 0 ? 0 : (safe / total) * 100;
    return { total, todayCount, detected, safe, detectedRate, safeRate };
  }, [boardList, todayStr]);

  // 필터 바뀔때마다 게시글 목록 api 호출
  useEffect(() => {
    selectBoardList();
  }, [boardFilter]);

  return (
    <AdminBoard
      boardList={boardList}
      selectedBoard={selectedBoard}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      boardFilter={boardFilter}
      changeBoardFilter={changeBoardFilter}
      toggleSort={toggleSort}
      getBoardDetail={getBoardDetail}
      boardStats={boardStats}
    />
  );
};

export default AdminBoardPage;
