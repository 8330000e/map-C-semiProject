import { useNavigate, useParams } from "react-router-dom";
// import CampaignDetail from "../../components/campaign/CampaignDetail";
import styles from "./CampaignDetailPage.module.css";
import useAuthStore from "../../store/useAuthStore";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";

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
  const realtime = Date.now();

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

  return (
    memberId &&
    readComplete && (
      <div className={styles.campdetailpage_wrap}>
        <div className={styles.campdetailpage_title}>
          <h2>캠페인 상세보기</h2>
        </div>
        <div className={styles.campdetailpage_content_wrap}>
          <div className={styles.campdetailpage_details_wrap}>
            <div>{campaignNo}</div>
            <div>{campaignDetail.campaignTitle}</div>
            <div>{campaignDetail.campaignStatus}</div>
            <div>{campaignDetail.campaignGoalMember}</div>
            <div>{campaignDetail.campaignStartDate}</div>
            <div>{campaignDetail.memberCount}</div>
            <div>{campaignDetail.memberId}</div>
            <div>{campaignDetail.campaignExpireDate}</div>
          </div>
          <div className={styles.campdetailpage_sidebar}>
            <div>{campaignDetail.campaignExplanation}</div>
            <p>히히</p>
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
                ? navigate("/campaign/settings/updateCampaign")
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
}) => {
  return (
    <div className={styles.campdetailpage_board_wrap}>
      <div className={styles.board_max_wrap}>
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
        ></div>
      </div>
      <div className={styles.board_max_wrap}></div>
      <div className={styles.board_max_wrap}></div>
      <div className={styles.board_max_wrap}></div>
      <div className={styles.board_max_wrap}></div>
      <div className={styles.board_max_wrap}></div>
      <button
        className={styles.board_btn}
        disabled={!dateOut || !inCampaign}
        onClick={() => {
          navigate(`/campaign/memoWrite/${campaignNo}`);
        }}
      >
        메모등록
      </button>
    </div>
  );
};
