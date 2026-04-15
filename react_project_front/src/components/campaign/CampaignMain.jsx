import { useEffect, useState } from "react";
import styles from "./CampaignMain.module.css";
import axios from "axios";
import Button from "@mui/material/Button";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide, useSwiper } from "Swiper/react";
import "swiper/css/autoplay";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const CampaignMain = () => {
  const [campaignList, setCampaignList] = useState([]);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignSendSearch, setCampaignSendSearch] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [readComplete, setReadComplete] = useState(false);
  const navigate = useNavigate();
  const swiper = useSwiper();
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
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/campaigns/onlyFiveNotice`)
      .then((res) => {
        console.log(res);
        setNoticeList([...res.data]);
        setReadComplete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // useEffect(() => {
  //   let int = 1;
  //   const c8 = setInterval(() => {
  //     int++;
  //     if (int === 5) {
  //       clearInterval(c8); // 여기서 멈춤
  //     }
  //     console.log("병신" + int);
  //   }, 3000);
  //   return () => {
  //     clearInterval(c8);
  //   };
  // }, []);
  return (
    readComplete && (
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
            <div
            // onClick={() => {
            //   navigate("/campaign/notice");
            // }}
            >
              {/* {console.log(integer())}
              {noticeList.at(1).campaignNoticeWriter +
                " - " +
                noticeList.at(1).campaignNoticeTitle} */}
              <Swiper
                // spaceBetween={10}?
                //Autoplay 가 핵심임(npm i swiper 해서 이런식으로 해야함....))
                modules={[Autoplay]}
                loop={true} //한번 순환후에 계속 돌건지 여부(false면 안돔)
                autoplay={{
                  delay: 4000, //몇밀리초마다
                  disableOnInteraction: false, //사용자가 건드려도 계속 돌아감(true 면 멈춤)
                }}
                slidesPerView={1} //swiper하나당 몇개 보여줄지
                //onSlideChange={() => console.log("slide change")} //slide 한번 할때마다 작동(그행위시마다)
                speed={1500} //넘어가는 시간
                // onSwiper={(swiper) => console.log(swiper)}?
              >
                <SwiperSlide>
                  {noticeList.at(0).campaignNoticeWriter +
                    " - " +
                    noticeList.at(0).campaignNoticeTitle}
                </SwiperSlide>
                <SwiperSlide>
                  {noticeList.at(1).campaignNoticeWriter +
                    " - " +
                    noticeList.at(1).campaignNoticeTitle}
                </SwiperSlide>
                <SwiperSlide>
                  {noticeList.at(2).campaignNoticeWriter +
                    " - " +
                    noticeList.at(2).campaignNoticeTitle}
                </SwiperSlide>
                <SwiperSlide>
                  {noticeList.at(3).campaignNoticeWriter +
                    " - " +
                    noticeList.at(3).campaignNoticeTitle}
                </SwiperSlide>
                <SwiperSlide>
                  {noticeList.at(4).campaignNoticeWriter +
                    " - " +
                    noticeList.at(4).campaignNoticeTitle}
                </SwiperSlide>
              </Swiper>
            </div>
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
                      {camp.campaignStatus === 2 || camp.campaignStatus === 1
                        ? "진행중"
                        : "챌린지 종료"}
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
    )
  );
};
export default CampaignMain;
