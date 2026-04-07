import axios from "axios";
import SupportNotice from "../../components/support/SupportNotice";
import styles from "./SupportNoticePage.module.css";
import { useEffect, useState } from "react";
const SupportNoticePage = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [openId, setOpenId] = useState(null);
  const selectNoticeList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/supports/notice`)
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
  }, []);
  return (
    <>
      <SupportNotice
        openId={openId}
        setOpenId={setOpenId}
        noticeList={noticeList}
      />
    </>
  );
};

export default SupportNoticePage;
