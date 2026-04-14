import { NavLink, Route, Routes, useParams } from "react-router-dom";
import styles from "./CampaignManagerPage.module.css";
import CampaignSuccession from "../../components/campaign/CampaignSuccession";
import CampaignUpdateCamp from "../../components/campaign/CampaignUpdateCamp";
import CampaignInsertNotice from "../../components/campaign/CampaignInsertNotice";
import CampaignBanMember from "../../components/campaign/CampaignBanMember";
import useAuthStore from "../../store/useAuthStore";

const CampaignManagerPage = () => {
  const { campaignNo, createId } = useParams();
  const { memberId } = useAuthStore();

  return (
    createId === memberId && (
      <div className={styles.camp_settings_wrap}>
        <div className={styles.camp_settings_title}>
          <h2>캠페인 설정</h2>
        </div>
        <div className={styles.camp_settings_main_wrap}>
          <div className={styles.camp_settings_sidebar}>
            <div className={styles.camp_setting_sidebar_title}>
              <h3>설정</h3>
            </div>
            <NavLink
              to={`/campaign/settings/${campaignNo}/${memberId}/updateCamp`}
            >
              캠페인 업데이트
            </NavLink>
            <NavLink
              to={`/campaign/settings/${campaignNo}/${memberId}/banMember`}
            >
              멤버 추방
            </NavLink>
            <NavLink
              to={`/campaign/settings/${campaignNo}/${memberId}/insertNotice`}
            >
              공지사항 등록
            </NavLink>
            <NavLink
              to={`/campaign/settings/${campaignNo}/${memberId}/succession`}
            >
              권한승계
            </NavLink>
          </div>
          <div className={styles.camp_settings_content_wrap}>
            <Routes>
              <Route path="succession" element={<CampaignSuccession />}></Route>
              <Route path="updateCamp" element={<CampaignUpdateCamp />}></Route>
              <Route
                path="insertNotice"
                element={<CampaignInsertNotice />}
              ></Route>
              <Route path="banMember" element={<CampaignBanMember />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    )
  );
};
export default CampaignManagerPage;
