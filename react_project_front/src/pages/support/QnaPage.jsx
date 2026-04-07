import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QnaSection from "../../components/support/QnaSection";

const QnaPage = () => {
  const navigate = useNavigate();
  const [myQnas, setMyQnas] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMyQnas();
  }, []);

  const fetchMyQnas = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/qnas/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setMyQnas(res.data))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/qnas`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        alert("문의가 등록되었습니다.");
        setForm({ title: "", content: "" });
        fetchMyQnas();
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <QnaSection
      form={form}
      myQnas={myQnas}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
      onBack={() => navigate("/support")}
    />
  );
};

export default QnaPage;
