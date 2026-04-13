import { useEffect, useState } from "react";
import AdminBoard from "../../components/admin/AdminBoard";
import axios from "axios";

const AdminBoardPage = () => {
  const [boardList, setBoardList] = useState([]);

  const selectBoardList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/board`)
      .then((res) => {
        console.log(res);
        setBoardList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    selectBoardList();
  }, []);
  return <AdminBoard boardList={boardList} />;
};

export default AdminBoardPage;
