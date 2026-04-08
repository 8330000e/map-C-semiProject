import { useParams } from "react-router-dom";
// import CampaignDetail from "../../components/campaign/CampaignDetail";
import styles from "./CampaignDetailPage.module.css";
import useAuthStore from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";

const CampaignDetailPage = () => {
  const { memberId } = useAuthStore();
  const params = useParams();
  const campaignNo = params.campaignNo;
  const [campaignDetail, setCampaignDetail] = useState();
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}`)
      .then((res) => {
        console.log(res);
        setCampaignDetail({ ...res.data });
        console.log(campaignDetail);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    memberId && (
      <div className={styles.campdetailpage_wrap}>
        <div className={styles.campdetailpage_title}>
          <h2>캠페인 상세보기</h2>
        </div>
        <div className={styles.campdetailpage_content_wrap}>
          <div></div>
        </div>
      </div>
    )
  );
};
export default CampaignDetailPage;
