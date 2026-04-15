import Swal from "sweetalert2";
import Button from "../ui/Button";
import styles from "./CampaignSettings.module.css";
import { Input } from "../ui/Form";
import useAuthStore from "../../store/useAuthStore";
import { useParams } from "react-router-dom";
import { useState } from "react";

const CampaignTerminate = () => {
  const { memberId } = useAuthStore();
  const { createId, campaignNo } = useParams();
  const [input, setInput] = useState("");
  return (
    <div className={styles.camp_settings_content_wrap}>
      <div className={styles.camp_settings_content_title}>
        <h2>캠페인 조기종료</h2>
      </div>
      <div className={styles.camp_settings_content_main_wrap}>
        <div className={styles.camp_settings_content_terminate}>
          <h3>이 버튼은 캠페인을 강제로 종료 시키는 버튼입니다.</h3>
          <Input
            id="inputId"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></Input>
          <label htmlFor="inputId"></label>
          <p>
            주의사항:캠페인울 강제로 종료시킬경우 포인트는 지급되지 않습니다.
          </p>
        </div>
        <Button
          className="btn primary sm"
          onClick={() => {
            Swal.fire({
              title: "정말로 이 캠페인을 종료시키겠습니까?",
              text: "캠페인은 실패로 끝나고,포인트도 지급되지 않으며,되돌리는 것은 불가능합니다.",
              icon: "warning",
              showCancelButton: true,
              cancelButtonText: "아니요",
              confirmButtonText: "강제로 종료",
            });
          }}
        >
          캠페인 조기 종료
        </Button>
      </div>
    </div>
  );
};
export default CampaignTerminate;
