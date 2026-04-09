import { useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CampaignMemoWritePage.module.css";
import { useRef, useState } from "react";
import Button from "../../components/ui/Button";

const CampaignMemoWritePage = () => {
  const { memberId } = useAuthStore;
  const params = useParams();
  const ref = useRef(null);
  const campaignNo = params.campaignNo;
  const [writeMemo, setWriteMemo] = useState({
    campaignMemo: "",
    campaignNo: campaignNo,
    memberId: memberId,
  });
  return (
    <div className={styles.campMemoWrite_wrap}>
      <div className={styles.campMemoWrite_title}>
        <h2>메모작성</h2>
      </div>
      <div className={styles.campMemoWrite_content_wrap}>
        <Button className="btn primary lg">사진선택</Button>
        <input
          type="file"
          ref={ref}
          accept="image/*"
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};
export default CampaignMemoWritePage;
