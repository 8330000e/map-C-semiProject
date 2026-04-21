import { useNavigate, useParams } from "react-router-dom";
// import CampaignDetail from "../../components/campaign/CampaignDetail";
import styles from "./CampaignDetailPage.module.css";
import useAuthStore from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";
import { normalizeImageUrl } from "../../utils/getImageUrl";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  plugins,
} from "chart.js";
import Pagination from "../../components/ui/Pagination";

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
  const [banMember, setBanMember] = useState(true);
  const [readBan, setReadBan] = useState(false);
  const [totalPage, setTotalPage] = useState();
  const [page, setPage] = useState(0);
  const data =
    readComplete &&
    new Date(campaignDetail.campaignExpireDate).getTime() - Date.now() > 0
      ? {
          labels: ["남은기간", "지난기간"],

          datasets: [
            {
              data: [
                new Date(campaignDetail.campaignExpireDate).getTime() -
                  Date.now(),
                new Date(campaignDetail.campaignExpireDate).getTime() -
                  new Date(campaignDetail.campaignStartDate).getTime() -
                  (new Date(campaignDetail.campaignExpireDate) - Date.now()),
              ],
              backgroundColor: ["#FA9B3B", "#6b7280"],
            },
          ],
        }
      : {
          labels: ["남은기간", "지난기간"],
          datasets: [
            {
              data: [0, 100],
              backgroundColor: ["#FA9B3B", "#afafaf"],
            },
          ],
        };
  const option =
    readComplete &&
    new Date(campaignDetail.campaignExpireDate).getTime() - Date.now() > 0
      ? {
          cutout: "83%",
          plugins: {
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: 12,
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
              callbacks: {
                title: (tooltipItems) => {
                  // 타이틀 커스터마이징(한번만 가능)
                  // return "";
                },
                label: (context) => {
                  //이게 출력되는 안쪽의 내용을 바꾸는 설정(내용 커스터마이징))option/plugins/tooltip/callbacks/label/:content
                  const day =
                    Math.floor(context.raw / 86400000) > 0
                      ? Math.floor(context.raw / 86400000) + "일"
                      : Math.floor(context.raw / 3600000) + "시간";
                  //context.raw는 데이터셋 안의 각 데이터를 리턴
                  return `${day}`;
                },
              },
            },
          },
        }
      : {
          cutout: "83%",
          plugins: {
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: 12,
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
              callbacks: {
                title: (tooltipItems) => {
                  // 타이틀 커스터마이징
                  return "시간 소진";
                },
                label: (context) => {
                  //이게 출력되는 안쪽의 내용을 바꾸는 설정(내용 커스터마이징))option/plugins/tooltip/callbacks/label/:context
                  return "0일";
                },
              },
            },
          },
        };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}/noBanMember?memberId=${memberId}`,
      )
      .then((res) => {
        console.log(res.data);
        if (res.data === 1) {
          setBanMember(false);
        }
        setReadBan(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
        `${import.meta.env.VITE_BACKSERVER}/campaigns/boards?campaignNo=${campaignNo}&page=${page}&size=6`,
      )
      .then((res) => {
        // console.log(res.data);
        setBoardList([...res.data.campPart]);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleteBoard, page]);
  if (readBan && banMember && memberId) {
    return (
      readComplete && (
        <div className={styles.campdetailpage_wrap}>
          <div className={styles.campdetailpage_title}>
            <h2>캠페인 상세보기</h2>
          </div>
          <div className={styles.campdetailpage_content_wrap}>
            <div
              className={styles.return_btn}
              onClick={() => {
                navigate("/campaign/main");
              }}
            >
              {"<" + "돌아가기"}
            </div>
            <div className={styles.campdetailpage_details_wrap}>
              <div className={styles.campdetailpage_visible_wrap}>
                <div className={styles.campdetailpage_chart}>
                  <div className={styles.campdetailpage_chart_title}>
                    <h4>시간 경과</h4>
                    {/* toLocaleDateString -> Date 타입에 한하여 날짜를 원하는 나라별표기 형식으로 바꾸는 것(자동으로도 되긴 함) */}
                  </div>
                  <Doughnut data={data} options={option} />
                </div>
                <div className={styles.camp_polygon_wrap}>
                  <h4>참여 회원 현황</h4>
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
                    className={`${styles.camp_polygon0} ${campaignDetail.memberCount >= campaignDetail.campaignGoalMember * 1 ? styles.camp_success : ""}`}
                  ></div>
                </div>
              </div>
              <div className={styles.campdetailpage_info_wrap}>
                <div className={styles.campdetailpage_info1}>
                  <p>{"캠페인 주최자 : " + campaignDetail.memberId}</p>
                  <p>{"캠페인 주제 : " + campaignDetail.campaignTitle}</p>
                  <p>
                    {"캠페인 진행 날짜 : " +
                      `${new Date(campaignDetail.campaignStartDate).toLocaleDateString("kr-KR")}` +
                      ` ~ ` +
                      `
                    ${new Date(
                      new Date(campaignDetail.campaignExpireDate).setDate(
                        new Date(campaignDetail.campaignExpireDate).getDate() -
                          1,
                      ),
                    ).toLocaleDateString("kr-KR")}
                    `}
                    {/* 캠페인 진행 날짜의 campaignExpireDate부분은 실제 등록된 날짜는 다음날 00:00이기 때문에 하루를 뺀 로직임(여기서 시간계산이 차트에 존재해 sql에서 다듬지 않음) */}
                  </p>
                </div>
                <div className={styles.campdetailpage_info2}>
                  <p>{"캠페인 참여인원 : " + campaignDetail.memberCount}</p>
                  <p>
                    {"캠페인 목표 인원 : " + campaignDetail.campaignGoalMember}
                  </p>
                  <p>
                    {"캠페인 달성 여부 : " +
                      (campaignDetail.campaignStatus >= 3
                        ? campaignDetail.campaignStatus === 3
                          ? "목표달성 성공"
                          : campaignDetail.campaignStatus === 4
                            ? "목표달성 실패"
                            : "조기종료"
                        : "진행중")}
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.campdetailpage_sidebar}>
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
            totalPage={totalPage}
            setPage={setPage}
            page={page}
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
  } else if (memberId) {
    return (
      <div>
        <p>
          당신은 추방된 멤버입니다.법적인 문제는 변호사와 상담하시고,문의는
          고객센터로 해주시기 바랍니다.
        </p>
        <Button
          className="btn primary sm"
          onClick={() => {
            navigate(`/campaign/main`);
          }}
        >
          돌아가기
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>회원가입 후 이용해주세요</h1>
        <Button
          className="btn primary sm"
          onClick={() => {
            navigate(`/`);
          }}
        >
          메인으로 돌아가기
        </Button>
      </div>
    );
  }
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
      <div className={styles.campdetailpage_sidebar_content}>
        <h4>{campaignDetail.campaignExplanation}</h4>
      </div>
      <div className={styles.campdetailpage_sidebar_btn_wrap}>
        {/* <Button
          className="btn primary lg"
          onClick={() => {
            navigate("/campaign/main");
          }}
        >
          돌아가기
        </Button> */}
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
        {inCampaign && (
          <Button
            className="btn primary lg"
            onClick={() => {
              Swal.fire({
                title: "정말로 캠페인에서 탈퇴하시겠습니까?",
                icon: "warning",
                text: "탈퇴시에는 캠페인이 성공해도 포인트를 지급받지 못합니다.",
                confirmButtonText: "탈퇴",
                showCancelButton: true,
                cancelButtonText: "취소",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .patch(
                      `${import.meta.env.VITE_BACKSERVER}/campaigns/${memberId}/leaveMember?campaignNo=${campaignNo}`,
                    )
                    .then((res) => {
                      console.log(res);
                      if (res.data == 1) {
                        Swal.fire({
                          title: "멤버를 탈퇴하셨습니다.",
                          icon: "success",
                        }).then((result) => {
                          // if (result.isConfirmed) {
                          navigate("/campaign/main");
                          // }
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
            캠페인탈퇴
          </Button>
        )}
      </div>
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
  totalPage,
  page,
  setPage,
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
                <p>{list.memberId}</p>
                <div className={styles.camp_board_img}>
                  {/*
                    캠페인 리스트 이미지도 lazy loading을 적용함.
                    보이지 않는 이미지는 로딩을 늦춰서 데이터 사용을 줄임.
                  */}
                  <img
                    src={normalizeImageUrl(list.campaignThumb)}
                    loading="lazy"
                    decoding="async"
                    alt="캠페인 이미지"
                  />
                </div>
                <div className={styles.camp_board_content_wrap}>
                  <p>{list.campaignMemo}</p>
                  {list.memberId === memberId && (
                    <div className={styles.board_btn_wrap}>
                      <button
                        onClick={() => {
                          navigate(
                            `/campaign/update/${list.campaignParticipanceNo}/${campaignNo}`,
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
                                  } else {
                                    console.log("오류발생");
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
        <div className={styles.campaign_pagination}>
          <Pagination
            page={page}
            totalPage={totalPage}
            setPage={setPage}
            naviSize={6}
          />
        </div>
      </div>
    )
  );
};
