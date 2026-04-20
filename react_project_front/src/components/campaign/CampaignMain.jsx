import { useEffect, useState } from "react";
import styles from "./CampaignMain.module.css";
import axios from "axios";
import Button from "@mui/material/Button";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/autoplay";
import "swiper/css";
import { Autoplay } from "swiper/modules";

import Pagination from "../ui/Pagination";

const CampaignMain = () => {
  const [campaignList, setCampaignList] = useState([]);
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignSendSearch, setCampaignSendSearch] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [readComplete, setReadComplete] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState();
  const [searchFilter, setSearchFilter] = useState(1); //1:제목,2:캠페인 생성자
  const [orderFilter, setOrderFilter] = useState(1); //1: 시간순,2오래된수
  const navigate = useNavigate();
  // const Swiper = useSwiper();
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns?campaignTitle=${campaignSendSearch}&size=6&page=${page}&searchFilter=${searchFilter}&orderFilter=${orderFilter}`,
      )
      .then((res) => {
        console.log(res.data);
        setCampaignList(res.data.campList);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [campaignSendSearch, page, searchFilter, orderFilter]);
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
        <div
          className={styles.return_btn}
          onClick={() => {
            navigate(`/`);
          }}
        >
          {"<" + "돌아가기"}
        </div>
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
            <select
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
              }}
            >
              <option value={1}>제목</option>
              <option value={2}>주최자</option>
            </select>
            <select
              value={orderFilter}
              onChange={(e) => {
                setOrderFilter(e.target.value);
              }}
            >
              <option value={1}>최신순</option>
              <option value={2}>오래된순</option>
              <option value={3}>진행중</option>
              <option value={4}>종료 캠페인</option>
            </select>
          </div>
        </div>
        <div className={styles.campaignmain_content_wrap}>
          <div className={styles.campaignmain_notice}>
            {/* {console.log(integer())}
              {noticeList.at(1).campaignNoticeWriter +
                " - " +
                noticeList.at(1).campaignNoticeTitle} */}
            <Swiper
              // spaceBetween={10}?
              //Autoplay 가 핵심임(npm i swiper 해서 이런식으로 해야함....))
              direction="vertical"
              modules={[Autoplay]}
              loop={true} //한번 순환후에 계속 돌건지 여부(false면 안돔)
              // effect="fade"
              // fadeEffect={(crossFade = true)}//direction이 vertical일때는 사용 불가(애니메이션은 horizontal만 구현)
              autoplay={{
                delay: 4000, //몇밀리초마다
                disableOnInteraction: false, //사용자가 건드려도 계속 돌아감(true 면 멈춤)
                pauseOnMouseEnter: true, //마우스 들어가면 정지
              }}
              slidesPerView={1} //swiper하나당 몇개 보여줄지
              style={{ height: "40px" }}
              //onSlideChange={() => console.log("slide change")} //slide 한번 할때마다 작동(그행위시마다)
              speed={1500} //넘어가는 시간
              // onSwiper={(swiper) => console.log(swiper)}?
            >
              {noticeList.map((notice, index) => {
                return (
                  <SwiperSlide key={notice.campaignNoticeTitle + index}>
                    <div
                      onClick={() => {
                        navigate(
                          `/campaign/noticeDetail/${notice.campaignNoticeNo}`,
                        );
                      }}
                    >
                      {notice.campaignNo +
                        "." +
                        notice.campaignTitle +
                        " : " +
                        notice.campaignNoticeTitle +
                        " - " +
                        notice.campaignNoticeWriter}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
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
          {console.log(totalPage)}
          {(totalPage != 1 || totalPage != 0) && (
            <Pagination
              page={page}
              setPage={setPage}
              totalPage={totalPage}
              naviSize={6}
            />
          )}
          <div className={styles.campaignmain_btn_wrap}>
            <Button
              onClick={() => {
                navigate(`/campaign/notice`);
              }}
            >
              공지사항
            </Button>
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
