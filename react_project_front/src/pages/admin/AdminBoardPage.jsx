import { useEffect, useState } from "react";
import AdminBoard from "../../components/admin/AdminBoard";
import axios from "axios";

const AdminBoardPage = () => {
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [boardFilter, setBoardFilter] = useState({
    keyword: "",
    risk: "all",
    sort: "desc",
    reportSort: "all",
  });

  const toggleSort = () => {
    setBoardFilter((prev) => ({
      ...prev,
      sort: prev.sort === "desc" ? "asc" : "desc",
    }));
  };

  const changeBoardFilter = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBoardFilter({ ...boardFilter, [name]: value });
  };

  const selectBoardList = () => {
    const params = {};
    if (boardFilter.keyword.trim()) params.keyword = boardFilter.keyword;
    if (boardFilter.risk !== "all") params.risk = boardFilter.risk;
    if (boardFilter.reportSort !== "all")
      params.reportSort = boardFilter.reportSort;
    params.sort = boardFilter.sort;
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/board`, { params })
      .then((res) => {
        console.log(res);
        console.log(res.data.detectedKeyword);
        setBoardList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBoardDetail = (boardNo) => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/detail/${boardNo}`)
      .then((res) => {
        console.log(res);
        setSelectedBoard(res.data);
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    selectBoardList();
  }, [boardFilter]);

  return (
    <AdminBoard
      boardList={boardList}
      getBoardDetail={getBoardDetail}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      selectedBoard={selectedBoard}
      boardFilter={boardFilter}
      toggleSort={toggleSort}
      changeBoardFilter={changeBoardFilter}
    />
  );
};

export default AdminBoardPage;
