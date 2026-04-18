import { useNavigate, useParams } from "react-router-dom";
import styles from "./CampaignSettings.module.css";
import useAuthStore from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input, TextArea } from "../ui/Form";
import Button from "../ui/Button";
import Swal from "sweetalert2";

const CampaignUpdateCamp = () => {
  const { campaignNo } = useParams();
  const { memberId } = useAuthStore();
  const [campList, setCampList] = useState();
  const [read, setRead] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}/forUpdate`,
      )
      .then((res) => {
        console.log(res.data);
        setCampList({ ...res.data });
        setRead(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    read && (
      <div className={styles.camp_settings_content_wrap}>
        <div className={styles.camp_settings_content_title}>
          <h2>캠페인 수정</h2>
        </div>
        <div className={styles.camp_settings_content_main_wrap}>
          <label htmlFor="campaignTitle">주제</label>
          <Input
            className="campaignTitle"
            name="campaignTitle"
            value={campList.campaignTitle}
            onChange={(e) => {
              setCampList({ ...campList, [e.target.name]: e.target.value });
            }}
          ></Input>
          <label htmlFor="campaignExplanation">설명</label>
          <TextArea
            className={styles.campaignUpdate_textarea}
            id="campaignExplanation"
            name="campaignExplanation"
            value={campList.campaignExplanation}
            onChange={(e) => {
              setCampList({ ...campList, [e.target.name]: e.target.value });
            }}
          ></TextArea>
          <label htmlFor="campaignGoalMember">달성인원</label>
          <Input
            id="campaignGoalMember"
            name="campaignGoalMember"
            value={campList.campaignGoalMember}
            onChange={(e) => {
              setCampList({ ...campList, [e.target.name]: e.target.value });
            }}
          ></Input>
          <div className={styles.camp_settings_content_btn_wrap}>
            <Button
              className="btn primary lg"
              onClick={() => {
                if (
                  isFinite(campList.campaignGoalMember) &&
                  campList.campaignGoalMember >= 100 &&
                  campList.campaignExplanation !== "" &&
                  campList.campaignTitle !== ""
                ) {
                  axios
                    .patch(
                      `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}/updateCamp`,
                      campList,
                    )
                    .then((res) => {
                      console.log(res.data);
                      if (res.data === 1) {
                        Swal.fire({
                          title: "수정을 등록하셨습니다.",
                          text: "관리자가 승인할때까지 기다리세요",
                          icon: "success",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            navigate(`/campaign/main`);
                          }
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  Swal.fire({
                    title: "입력내용을 확인하시오",
                    text: "달성인원의 경우 100이상의 숫자여야만 합니다.",
                    icon: "warning",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      return;
                    }
                  });
                }
              }}
            >
              수정
            </Button>
          </div>
        </div>
      </div>
    )
  );
};
export default CampaignUpdateCamp;
