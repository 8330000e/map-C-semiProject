import { useParams } from "react-router-dom";
import SupportNoticeDetail from "../../components/support/SupportNoticeDetail";
import axios from "axios";
import { useEffect, useState } from "react";

const SupportNoticeDetailPage = () => {
  const { noticeNo } = useParams();
  const [notice, setNotice] = useState({});
  const [noticeList, setNoticeList] = useState([]);

  const selectNoticeDetail = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/supports/notice/${noticeNo}`)
      .then((res) => {
        console.log(res);
        setNotice(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/supports/notice`)
      .then((res) => {
        setNoticeList(
          res.data.filter((item) => item.noticeNo !== Number(noticeNo)),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    selectNoticeDetail();
  }, [noticeNo]);

  return (
    <>
      <SupportNoticeDetail notice={notice} noticeList={noticeList} />
    </>
  );
};

export default SupportNoticeDetailPage;
