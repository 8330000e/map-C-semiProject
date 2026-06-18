import { useEffect, useState } from "react";
import SupportFaq from "../../components/support/SupportFaq";
import styles from "./SupportFaqPage.module.css";
import axios from "axios";
const SupportFaqPage = () => {
  const [category, setCategory] = useState("전체");
  const [faqList, setFaqList] = useState([]);
  const [openId, setOpenId] = useState(null);
  const selectFaqList = () => {
    const params = {};
    if (category !== "전체") {
      params.category = category; // 빈 객체 params에 {category: value} key:value 형태
    }
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/supports/faq`, { params })
      .then((res) => {
        console.log(res);
        setFaqList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    selectFaqList();
  }, [category]);
  return (
    <>
      <SupportFaq
        category={category}
        setCategory={setCategory}
        faqList={faqList}
        openId={openId}
        setOpenId={setOpenId}
      />
    </>
  );
};

export default SupportFaqPage;
