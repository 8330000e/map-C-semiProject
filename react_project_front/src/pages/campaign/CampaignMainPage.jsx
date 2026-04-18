import { Route, Routes, useNavigate } from "react-router-dom";
import styles from "./CampaignPage.module.css";
import CampaignMain from "../../components/campaign/CampaignMain";

import useAuthStore from "../../store/useAuthStore";
import Button from "../../components/ui/Button";

const CampaignMainPage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  return (
    memberId && (
      <div className={styles.campaign_main_wrap}>
        <div className={styles.campaign_content_wrap}>
          {/* <Button
            className="btn primary sm"
            onClick={() => {
              navigate("/");
            }}
          >
            돌아가기
          </Button> */}
          <CampaignMain />
        </div>
      </div>
    )
  );
};
export default CampaignMainPage;
