import axios from "axios";
import SupportNotice from "../../components/support/SupportNotice";
import styles from "./SupportNoticePage.module.css";
import { useEffect, useState } from "react";
const SupportNoticePage = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [category, setCategory] = useState("전체");

  const selectNoticeList = () => {
    const params = {};
    if (category !== "전체") {
      params.category = category;
    }
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/supports/notice`, { params })
      .then((res) => {
        console.log(res);
        setNoticeList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    selectNoticeList();
  }, [category]);
  return (
    <>
      <SupportNotice
        noticeList={noticeList}
        setCategory={setCategory}
        category={category}
      />
    </>
  );
};

export default SupportNoticePage;
