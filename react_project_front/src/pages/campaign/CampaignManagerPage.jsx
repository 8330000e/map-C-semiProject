import { NavLink, Route, Routes } from "react-router-dom";
import styles from "./CampaignManagerPage.module.css";
import CampaignSuccession from "../../components/campaign/CampaignSuccession";
import CampaignUpdateCamp from "../../components/campaign/CampaignUpdateCamp";
import CampaignInsertNotice from "../../components/campaign/CampaignInsertNotice";
import CampaignBanMember from "../../components/campaign/CampaignBanMember";

const CampaignManagerPage = () => {
  return (
    <div className={styles.camp_settings_wrap}>
      <div className={styles.camp_settings_title}>
        <h2>캠페인 설정</h2>
      </div>
      <div className={styles.camp_settings_sidebar}>
        <div className={styles.camp_setting_sidebar_title}>
          <h4>설정</h4>
        </div>
        <NavLink to="/campaign/settings/updateCamp">캠페인 업데이트</NavLink>
        <NavLink to="/campaign/settings/banMember">멤버 추방</NavLink>
        <NavLink to="/campaign/settings/insertNotice">공지사항 등록</NavLink>
        <NavLink to="/campaign/settings/succession">권한승계</NavLink>
      </div>
      <div className={styles.camp_settings_content_wrap}>
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
export default CampaignManagerPage;
