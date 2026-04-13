import { useNavigate, useParams } from "react-router-dom";
// import CampaignDetail from "../../components/campaign/CampaignDetail";
import styles from "./CampaignDetailPage.module.css";
import useAuthStore from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
} from "chart.js";

Chart.register(DoughnutController, ArcElement, Title, Tooltip);

const CampaignDetailPage = () => {
  const navigate = useNavigate();
  const { memberId } = useAuthStore();
  const params = useParams(); // url주소로 온 파라미터 꺼내는 함수
  const campaignNo = params.campaignNo;
  const [readComplete, setReadComplete] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [campaignDetail, setCampaignDetail] = useState();
  const [inCampaign, setInCampaign] = useState(false);
  const [dateOut, setDateout] = useState(true);
  // const realtime = Date.now(); 로직이 back으로 감
  const [boardList, setBoardList] = useState([]);
  const [deleteBoard, setDeleteBoard] = useState(false);
  const data = readComplete && {
    labels: ["남은기간", "지난기간"],
    datasets: [
      {
        data: [
          new Date(campaignDetail.campaignExpireDate).getTime() - Date.now(),
          new Date(campaignDetail.campaignExpireDate).getTime() -
            new Date(campaignDetail.campaignStartDate).getTime() -
            (new Date(campaignDetail.campaignExpireDate) - Date.now()),
        ],
        backgroundColor: ["#FA9B3B", "#fefefe"],
      },
    ],
  };
  const option = {
    cutout: "83%",
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}`)
      .then((res) => {
        // const expire = new Date(res.data.campaignExpireDate);
        // const deadline = expire.getTime();
        // console.log(realtime - deadline);
        if (res.data.campaignStatus === 3 || res.data.campaignStatus === 4) {
          setDateout(false);
        }
        if (res.data.memberId === memberId) {
          setIsCreator(true);
        }
        setCampaignDetail({ ...res.data });
        setReadComplete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/${memberId}/part?campaignNo=${campaignNo}`,
      )
      .then((res) => {
        if (res.data === 1) {
          setInCampaign(true);
        }
        console.log(inCampaign);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [inCampaign]);
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/boards?campaignNo=${campaignNo}`,
      )
      .then((res) => {
        // console.log(res.data);
        setBoardList([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleteBoard]);

  return (
    memberId &&
    readComplete && (
      <div className={styles.campdetailpage_wrap}>
        <div className={styles.campdetailpage_title}>
          <h2>캠페인 상세보기</h2>
        </div>
        <div className={styles.campdetailpage_content_wrap}>
          <div className={styles.campdetailpage_details_wrap}>
            <div className={styles.campdetailpage_chart}>
              <Doughnut data={data} options={option} />
            </div>
            <div className={styles.camp_polygon_wrap}>
              <div
                className={`${styles.camp_polygon1} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.1 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon2} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.2 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon3} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.3 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon4} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.4 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon5} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.5 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon6} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.6 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon7} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.7 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon8} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.8 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon9} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.9 ? styles.camp_success : ""}`}
              ></div>
              <div
                className={`${styles.camp_polygon0} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 0.04 ? styles.camp_success : ""}`}
              ></div>
            </div>
          </div>
          <div className={styles.campdetailpage_sidebar}>
            <div>{campaignDetail.campaignExplanation}</div>
            <CampaignDetailSideBar
              campaignDetail={campaignDetail}
              isCreator={isCreator}
              inCampaign={inCampaign}
              dateOut={dateOut}
              memberId={memberId}
              campaignNo={campaignNo}
              setInCampaign={setInCampaign}
              navigate={navigate}
            />
          </div>
        </div>
        <PostBoard
          navigate={navigate}
          inCampaign={inCampaign}
          campaignNo={campaignNo}
          dateOut={dateOut}
          memberId={memberId}
          isCreator={isCreator}
          boardList={boardList}
          deleteBoard={deleteBoard}
          setDeleteBoard={setDeleteBoard}
        />
      </div>
    )
  );
};
export default CampaignDetailPage;

const CampaignDetailSideBar = ({
  campaignDetail,
  isCreator,
  inCampaign,
  dateOut,
  memberId,
  campaignNo,
  setInCampaign,
  navigate,
}) => {
  console.log(inCampaign);
  return (
    <div className={styles.campdetailpage_sidebar_wrap}>
      <div className={styles.campdetailpage_sidebar_title}>
        <h3>캠페인 상세내용</h3>
      </div>
      <div>{campaignDetail.campaignExplanation}</div>
      <Button
        className="btn primary lg"
        onClick={(e) => {
          dateOut
            ? inCampaign
              ? (e.target.disabled = true)
              : isCreator
                ? navigate(
                    `/campaign/settings/${campaignNo}/${memberId}/updateCamp`,
                  )
                : Swal.fire({
                    title: "캠페인을 참여하시겠습니까?",
                    icon: "question",
                    showCancelButton: "아니요",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      axios
                        .post(
                          `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}/join`,
                          { memberId: memberId },
                        )
                        .then((res) => {
                          console.log(res);
                          if (res.data === 1) {
                            setInCampaign(true);
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  })
            : (e.target.disabled = true);
        }}
      >
        {dateOut
          ? inCampaign
            ? "참여중"
            : isCreator
              ? "설정"
              : "참여하기"
          : "캠페인 종료"}
      </Button>
    </div>
  );
};
const PostBoard = ({
  navigate,
  inCampaign,
  campaignNo,
  memberId,
  dateOut,
  isCreator,
  boardList,
  deleteBoard,
  setDeleteBoard,
}) => {
  return (
    boardList && (
      <div className={styles.campdetailpage_board_wrap}>
        {console.log(boardList)}
        {boardList.map((list, index) => {
          return (
            <div
              className={styles.board_max_wrap}
              key={index + list.campaignMemo}
            >
              {/**Math.random -> 0 ~ 1 사이의 숫자 */}
              <div
                style={{
                  backgroundColor: "#FA9B3B",
                  width: "250px",
                  height: "200px",
                  position: "absolute",
                  left: `${Math.random() * 70}` + `px`,
                  top: `${Math.random() * 100}` + "px",
                  transform: `rotate(${Math.ceil(Math.random() * 2) / 2 === 1 ? 1 * (Math.random() * 15) : -1 * (Math.random() * 15)}deg)`,
                }}
              >
                <div className={styles.camp_board_img}>
                  <img
                    src={`${import.meta.env.VITE_BACKSERVER}/campaign/memo/${list.campaignThumb}`}
                  />
                </div>
                <div className={styles.camp_board_content_wrap}>
                  <p>{list.campaignMemo}</p>
                  {list.memberId === memberId && (
                    <div className={styles.board_btn_wrap}>
                      <button
                        onClick={() => {
                          navigate(
                            `/campaign/update/${list.campaignParticipanceNo}`,
                          );
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => {
                          const campaignParticipanceNo =
                            list.campaignParticipanceNo;
                          console.log(campaignParticipanceNo);
                          Swal.fire({
                            title: "정말로 삭제하시겠습니까?",
                            text: "삭제시 복구 불가",
                            icon: "warning",
                            showCancelButton: true,
                            cancelButtonText: "취소",
                            confirmButtonText: "강행",
                          }).then((res) => {
                            if (res.isConfirmed) {
                              axios
                                .delete(
                                  `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignParticipanceNo}/board`,
                                )
                                .then((res) => {
                                  console.log(res.data);
                                  if (res.data === 1) {
                                    Swal.fire({
                                      text: "삭제되었습니다",
                                      title: "삭제완료",
                                      icon: "info",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        setDeleteBoard(!deleteBoard);
                                        navigate(
                                          `/campaign/detail/${list.campaignNo}`,
                                        );
                                      }
                                    });
                                  }
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }
                          });
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <button
          className={styles.board_btn}
          disabled={isCreator ? !dateOut : !inCampaign || !dateOut} //현재 캠페인 생성자가 못건드림(생성자를 campaign_member_tbl에 추가시켜야 할 것 같음)
          onClick={() => {
            navigate(`/campaign/memoWrite/${campaignNo}`);
          }}
        >
          메모등록
        </button>
      </div>
    )
  );
};
