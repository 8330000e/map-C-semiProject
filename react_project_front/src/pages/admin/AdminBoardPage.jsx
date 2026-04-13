import { useEffect, useState } from "react";
import AdminBoard from "../../components/admin/AdminBoard";
import axios from "axios";

const AdminBoardPage = () => {
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectBoardList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/board`)
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
  }, []);
  return (
    <AdminBoard
      boardList={boardList}
      getBoardDetail={getBoardDetail}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      selectedBoard={selectedBoard}
    />
  );
};

export default AdminBoardPage;
