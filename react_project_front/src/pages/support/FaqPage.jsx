import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FaqList from "../../components/support/FaqList";

const FaqPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [category, setCategory] = useState("전체");

  useEffect(() => {
    fetchFaqs();
  }, [category]);

  const fetchFaqs = () => {
    const params = category !== "전체" ? { category } : {};
    axios
      .get(`${import.meta.env.VITE_API_URL}/admins/faqs`, { params })
      .then((res) => setFaqs(res.data))
      .catch((err) => console.error(err));
  };

  return (
    <FaqList
      faqs={faqs}
      category={category}
      onCategoryChange={setCategory}
      onBack={() => navigate("/support")}
    />
  );
};

export default FaqPage;
