import { useNavigate, useParams } from "react-router-dom";
import Button from "../ui/Button";
import { Input, TextArea } from "../ui/Form";
import styles from "./CampaignSettings.module.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CampaignBanMember = () => {
  const { campaignNo, createId } = useParams();
  const navigate = useNavigate();
  const [banMember, setBanMember] = useState({
    memberId: "",
    campaignNo: campaignNo,
    campaignExileReason: "",
  });
  const [checkMember, setCheckMember] = useState(false);
  return (
    <div className={styles.camp_settings_content_wrap}>
      <div className={styles.camp_settings_content_title}>
        <h2>회원추방</h2>
      </div>
      <div className={styles.camp_settings_content_main_wrap}>
        <div className={styles.camp_settings_content_ban_memberId}>
          <label htmlFor="banMemberId">추방시킬 멤버</label>
          <div>
            <Input
              id="banMemberId"
              name="memberId"
              disabled={checkMember}
              value={banMember.memberId}
              onChange={(e) => {
                setBanMember({
                  ...banMember,
                  [e.target.name]: e.target.value,
                });
              }}
            ></Input>
            <Button
              className="btn primary sm"
              style={!checkMember ? { display: "block" } : { display: "none" }}
              onClick={() => {
                const memberId = banMember.memberId;
                const campaignNo = banMember.campaignNo;
                axios
                  .get(
                    `${import.meta.env.VITE_BACKSERVER}/campaigns/${memberId}/part?campaignNo=${campaignNo}`,
                  )
                  .then((res) => {
                    console.log(res.data);
                    if (res.data === 1) {
                      setCheckMember(true);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              회원 조회
            </Button>
            <Button
              className="btn primary sm"
              style={checkMember ? { display: "block" } : { display: "none" }}
              onClick={() => {
                setCheckMember(false);
                setBanMember({ ...banMember, memberId: "" });
              }}
            >
              취소
            </Button>
          </div>
          <p>{checkMember ? "회원 존재" : "회원이 존재하지 않습니다."}</p>
        </div>
        {checkMember && (
          <div className={styles.camp_settings_content_ban_reason}>
            <label htmlFor="exileReason">추방 이유</label>
            <TextArea
              id="exileReason"
              placeholder="예시:'캠페인이름 및 번호'에서 불건전한 행위로 인해 추방되셨습니다."
              name="campaignExileReason"
              value={banMember.campaignExileReason}
              onChange={(e) => {
                setBanMember({ ...banMember, [e.target.name]: e.target.value });
              }}
            ></TextArea>
          </div>
        )}
        {checkMember && (
          <div className={styles.camp_settings_content_btn_wrap}>
            <Button
              className="btn primary lg"
              onClick={() => {
                if (banMember.campaignExileReason === "") {
                  Swal.fire({
                    title: "추방 사유를 입력해 주세요",
                    icon: "warning",
                  });
                  return;
                }
                console.log(banMember.campaignExileReason);
                axios
                  .post(
                    `${import.meta.env.VITE_BACKSERVER}/campaigns/ban`,
                    banMember,
                  )
                  .then((res) => {
                    console.log(res.data);
                    if (res.data === 1) {
                      Swal.fire({
                        title: "회원 추방 성공",
                        text: "회원을 추방하셨습니다.",
                        icon: "success",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          navigate(
                            `/campaign/settings/${campaignNo}/${createId}/updateCamp`,
                          );
                        }
                      });
                    } else {
                      console.log("병신!!!!!!");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              추방
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CampaignBanMember;
