import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CampaignNoticeDetailPage.module.css";

const CampaignNoticeDetailPage = () => {
  const { memberId } = useAuthStore();
  const { campaignNoticeNo } = useParams(); //파라미터로 들어온 공지사항 시퀀스 번호
  const navigate = useNavigate();
  const [noticeDetail, setNoticeDetail] = useState(); //공지사항 정보 담는 state
  const [readComplete, setReadComplete] = useState(false); //axios 읽고 return부분 작성하라고 정의한 state
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNoticeNo}/noticeDetail`,
      )
      .then((res) => {
        console.log(res.data);
        setNoticeDetail({ ...res.data });
        setReadComplete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); //캠페인 컨트롤러 마지막 부분에 적혀 있음
  return (
    memberId &&
    readComplete && (
      <div className={styles.campNoDe_wrap}>
        <div className={styles.campNoDe_title_wrap}>
          <h2>캠페인 공지 상세보기</h2>
        </div>
      </div>
    )
  );
};

export default CampaignNoticeDetailPage;
