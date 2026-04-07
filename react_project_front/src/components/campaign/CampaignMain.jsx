import { useEffect, useState } from "react";
import styles from "./CampaignMain.module.css";
import axios from "axios";

const CampaignMain = () => {
  const [campaignList, setCampaignList] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/campaigns`)
      .then((res) => {
        console.log(res.data);
        setCampaignList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className={styles.campaignmain_wrap}>
      <div className={styles.campaignmain_title_wrap}>
        <h3>캠페인 참여화면</h3>
      </div>
      <div className={styles.campaignmain_content_wrap}>
        <div>
          {campaignList.map((camp, index) => {
            return (
              <ul className={styles.campaignmain_list}>
                <li>{camp.campaignNo}</li>
                <li>{camp.campaignTitle}</li>
                <li>{camp.campaignStatus}</li>
                <li>{camp.campaignGoalMember}</li>
                <li>{camp.campaignExpireDate}</li>
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CampaignMain;
