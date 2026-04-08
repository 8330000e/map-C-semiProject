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
  const [readComplete, setReadComplete] = useState(false);
  const [campaignDetail, setCampaignDetail] = useState();

  useEffect(() => {
    const leftRight = Math.floor(Math.random() * 35);
    const topBottom = Math.floor(Math.random() * 50);
    console.log(leftRight);
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}`)
      .then((res) => {
        console.log(res);
        setCampaignDetail({ ...res.data });
        setReadComplete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    memberId &&
    readComplete && (
      <div className={styles.campdetailpage_wrap}>
        <div className={styles.campdetailpage_title}>
          <h2>캠페인 상세보기</h2>
        </div>
        <div className={styles.campdetailpage_content_wrap}>
          <div className={styles.campdetailpage_details_wrap}>
            <div>{campaignNo}</div>
            <div>{campaignDetail.campaignTitle}</div>
            <div>{campaignDetail.campaignStatus}</div>
            <div>{campaignDetail.campaignGoalMember}</div>
            <div>{campaignDetail.campaignStartDate}</div>
            <div>{campaignDetail.memberCount}</div>
          </div>
          <div className={styles.campdetailpage_sidebar}>
            <div>{campaignDetail.campaignExplanation}</div>
            <p>히히</p>
          </div>
        </div>
        <div className={styles.campdetailpage_board_wrap}>
          <div className={styles.board_max_wrap}>
            {/**Math.random -> 0 ~ 1 사이의 숫자 */}
            <div
              style={{
                width: "250px",
                height: "200px",
                position: "absolute",
                backgroundColor: "var(--gray8)",
                left: `${Math.random() * 70}` + `px`,
                right: `${Math.random() * 70}` + `px`,
                top: `${Math.random() * 100}` + "px",
                bottom: `${Math.random() * 100}` + "px",
              }}
            ></div>
          </div>
          <div className={styles.board_max_wrap}></div>
          <div className={styles.board_max_wrap}></div>
          <div className={styles.board_max_wrap}></div>
          <div className={styles.board_max_wrap}></div>
          <div className={styles.board_max_wrap}></div>
        </div>
      </div>
    )
  );
};
export default CampaignDetailPage;
