import CampaignBanMember from "../../components/campaign/CampaignBanMember";
import CampaignInsertNotice from "../../components/campaign/CampaignInsertNotice";
import CampaignSuccession from "../../components/campaign/CampaignSuccession";
import CampaignUpdateCamp from "../../components/campaign/CampaignUpdateCamp";
import styles from "./CampaignSettings.module.css";
import { NavLink, Route, Routes } from "react-router-dom";

const CampaignSettingsPage = () => {
  return (
    <div className={styles.camp_settings_wrap}>
      <div className={styles.camp_settings_sidebar}>
        <div className={styles.camp_setting_sidebar_title}>
          <h4>설정</h4>
        </div>
        <NavLink to="updateCamp">캠페인 업데이트</NavLink>
        <NavLink to="banMember">멤버 추방</NavLink>
        <NavLink to="insertNotice">공지사항 등록</NavLink>
        <NavLink to="succession">권한승계</NavLink>
      </div>
      <div className={styles.camp_settins_content_wrap}>
        <Routes>
          <Route to="succession" element={<CampaignSuccession />}></Route>
          <Route to="updateCamp" element={<CampaignUpdateCamp />}></Route>
          <Route to="insertNotice" element={<CampaignInsertNotice />}></Route>
          <Route to="banMember" element={<CampaignBanMember />}></Route>
        </Routes>
      </div>
    </div>
  );
};
export default CampaignSettingsPage;
