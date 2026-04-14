import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";

const CampaignNotice = () => {
  const { memberId } = useAuthStore();
  const [noticeList, setNoticeList] = useState([]);
  return (
    <div>
      <div>
        <h1>공지사항</h1>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};
export default CampaignNotice;
