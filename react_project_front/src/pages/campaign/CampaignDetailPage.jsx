import { useParams } from "react-router-dom";
// import CampaignDetail from "../../components/campaign/CampaignDetail";
import styles from "./CampaignDetailPage.module.css";
import useAuthStore from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";

const CampaignDetailPage = () => {
  const { memberId } = useAuthStore();
  const params = useParams(); // url주소로 온 파라미터 꺼내는 함수
  const campaignNo = params.campaignNo;
  const [readComplete, setReadComplete] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [campaignDetail, setCampaignDetail] = useState();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}`)
      .then((res) => {
        console.log(res);
        if (res.data.memberId === memberId) {
          setIsCreator(true);
        }
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
            <div>{campaignDetail.memberId}</div>
          </div>
          <div className={styles.campdetailpage_sidebar}>
            <div>{campaignDetail.campaignExplanation}</div>
            <p>히히</p>
            <CampaignDetailSideBar
              campaignDetail={campaignDetail}
              isCreator={isCreator}
            />
          </div>
        </div>
        <div className={styles.campdetailpage_board_wrap}>
          <div className={styles.board_max_wrap}>
            {/**Math.random -> 0 ~ 1 사이의 숫자 */}
            <div
              style={{
                backgroundColor: "#FA9B3B",
                width: "250px",
                height: "200px",
                position: "absolute",
                left: `${Math.random() * 70}` + `px`,
                top: `${Math.random() * 100}` + "px",
                transform: `rotate(${Math.ceil(Math.random() * 2) / 2 === 1 ? 1 * (Math.random() * 15) : -1 * (Math.random() * 15)}deg)`,
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

const CampaignDetailSideBar = ({ campaignDetail, isCreator }) => {
  return (
    <div>
      <div>{campaignDetail.campaignExplanation}</div>
      <p>히히</p>
      <Button onClick={() => {}}></Button>
    </div>
  );
};
