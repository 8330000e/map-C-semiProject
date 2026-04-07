import { Route, Routes } from "react-router-dom";
import styles from "./CampaignPage.module.css";
import CampaignMain from "../../components/campaign/CampaignMain";

const CampaignPage = () => {
  return (
    <div className={styles.campaign_main_wrap}>
      <div className={styles.campaign_title_wrap}>
        <h3>캠페인</h3>
      </div>
      <div className={styles.campaign_content_wrap}>
        <Routes>
          <Route path="/main" element={<CampaignMain />}></Route>
        </Routes>
      </div>
    </div>
  );
};
export default CampaignPage;
