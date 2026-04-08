import { Route, Routes } from "react-router-dom";
import styles from "./CampaignPage.module.css";
import CampaignMain from "../../components/campaign/CampaignMain";

import useAuthStore from "../../store/useAuthStore";

const CampaignMainPage = () => {
  const { memberId } = useAuthStore();
  return (
    memberId && (
      <div className={styles.campaign_main_wrap}>
        <div className={styles.campaign_content_wrap}>
          <CampaignMain />
        </div>
      </div>
    )
  );
};
export default CampaignMainPage;
