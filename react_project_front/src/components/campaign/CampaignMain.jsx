import { useEffect, useState } from "react";
import styles from "./CampaignMain.module.css";
import axios from "axios";
import Button from "@mui/material/Button";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const CampaignMain = () => {
  const [campaignList, setCampaignList] = useState([]);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignSendSearch, setCampaignSendSearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns?campaignTitle=${campaignSendSearch}`,
      )
      .then((res) => {
        console.log(res.data);
        setCampaignList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [campaignSendSearch]);
  return (
    <div className={styles.campaignmain_wrap}>
      <div className={styles.campaignmain_title_wrap}>
        <h2>캠페인 참여화면</h2>
        <div>
          <label
            htmlFor="campaignSearch"
            onClick={() => {
              setCampaignSendSearch(campaignSearch);
              setCampaignSearch("");
            }}
          >
            <SearchIcon />
          </label>
          <Input
            id="campaignSearch"
            name="campaignTitle"
            value={campaignSearch}
            onChange={(e) => {
              setCampaignSearch(e.target.value);
            }}
          ></Input>
        </div>
      </div>
      <div className={styles.campaignmain_content_wrap}>
        <div className={styles.campaignmain_notice}>
          <p>공지사항 들어가는 곳</p>
        </div>
        {campaignList.map((camp, index) => {
          return (
            <div
              key={camp.campaignNo + camp.campaignTitle}
              className={styles.campaignmain_list}
              onClick={() => {
                navigate(`/campaign/detail/${camp.campaignNo}`);
              }}
            >
              <ul>
                {console.log(camp.campaignNo)}
                <li className={styles.campaignmain_campaign_title}>
                  <h3>{camp.campaignTitle}</h3>
                </li>
                <li className={styles.campaignmain_campaign_goal_member}>
                  <div>{"목표인원수 : " + camp.campaignGoalMember}</div>
                </li>
                <li className={styles.campaignmain_campaign_status}>
                  <div>
                    {camp.campaignStatus === 2 ? "진행중" : "챌린지 종료"}
                  </div>
                </li>
                <li className={styles.campaignmain_date}>
                  <div>
                    {camp.campaignStartDate + " ~ " + camp.campaignExpireDate}
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
        <div className={styles.campaignmain_btn_wrap}>
          <Button
            onClick={() => {
              navigate("/campaign/create");
            }}
          >
            챌린지 생성하기
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CampaignMain;
