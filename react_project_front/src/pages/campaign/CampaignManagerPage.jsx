import { Route, Routes } from "react-router-dom";
import UpdateCampaign from "../../components/campaign/UpdateCampaign";

const CampaignManagerPage = () => {
  return (
    <div>
      <h1>캠페인 설정 페이지</h1>
      <div>
        <Routes>
          <Route path="updateCampaign" element={<UpdateCampaign />}></Route>
        </Routes>
      </div>
    </div>
  );
};
export default CampaignManagerPage;
