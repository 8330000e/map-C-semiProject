import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import Button from "../ui/Button";
import { Input, TextArea } from "../ui/Form";
import styles from "./CampaignSettings.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const CampaignInsertNotice = () => {
  const { campaignNo, createId } = useParams();
  const [writeNotice, setWriteNotice] = useState({
    campaignNoticeTitle: "",
    campaignNoticeContent: "",
    campaignNo: campaignNo,
    campaignNoticeWriter: createId,
  });
  const insertCampNotice = () => {
    if (
      writeNotice.campaignNoticeContent !== "" ||
      writeNotice.campaignNoticeTitle !== ""
    ) {
      console.log(writeNotice);
      axios
        .post(
          `${import.meta.env.VITE_BACKSERVER}/campaigns/insertNotice`,
          writeNotice,
        )
        .then((res) => {
          console.log(res.data);
          if (res.data === 1) {
            Swal.fire({
              title: "공지글이 등록되었습니다.",
              text: "공지사항에 게시글이 등록되었습니다.",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                setWriteNotice({
                  ...writeNotice,
                  campaignNoticeTitle: "",
                  campaignNoticeContent: "",
                });
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <div className={styles.camp_settings_content_wrap}>
      <div className={styles.camp_settings_content_title}>
        <h2>공지사항 등록</h2>
      </div>
      <div className={styles.camp_settings_content_main_wrap}>
        <label htmlFor="noticeTitle">공지 제목</label>
        <Input
          id="noticeTitle"
          name="campaignNoticeTitle"
          value={writeNotice.campaignNoticeTitle}
          onChange={(e) => {
            setWriteNotice({ ...writeNotice, [e.target.name]: e.target.value });
          }}
        ></Input>
        <label htmlFor="noticeContent">공지 내용</label>
        <TextArea
          id="noticeContent"
          name="campaignNoticeContent"
          value={writeNotice.campaignNoticeContent}
          onChange={(e) => {
            setWriteNotice({ ...writeNotice, [e.target.name]: e.target.value });
          }}
        ></TextArea>
        <div className={styles.camp_settings_content_btn_wrap}>
          <Button className="btn primary lg" onClick={insertCampNotice}>
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CampaignInsertNotice;
