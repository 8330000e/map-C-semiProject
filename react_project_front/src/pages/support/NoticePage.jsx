import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NoticeList from "../../components/support/NoticeList";

const NoticePage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotices();
  }, [page]);

  const fetchNotices = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/admins/notices`, {
        params: { page, size: 10 },
      })
      .then((res) => {
        setNotices(res.data.list);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  return (
    <NoticeList
      notices={notices}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      onBack={() => navigate("/support")}
    />
  );
};

export default NoticePage;
