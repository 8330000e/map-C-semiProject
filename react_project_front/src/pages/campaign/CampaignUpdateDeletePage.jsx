import { useNavigate, useParams } from "react-router-dom";
import styles from "./CampaignUpdateDelete.module.css";
import useAuthStore from "../../store/useAuthStore";
import { normalizeImageUrl } from "../../utils/getImageUrl";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import Swal from "sweetalert2";

const CampaignUpdateDeletePage = () => {
  const param = useParams();
  const { memberId } = useAuthStore();
  const campaignParticipanceNo = param.campaignParticipanceNo;
  const campaignNo = param.campaignNo;
  const [campBoardList, setCampBoardList] = useState();
  const [ready, setReady] = useState(false);
  const ref = useRef();
  const [imgChange, setImgChange] = useState(false);
  const [imgUrl, setImgUrl] = useState();
  const [deletePath, setDeletePath] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/board/${campaignParticipanceNo}`,
      )
      .then((res) => {
        console.log(res.data);
        setCampBoardList({ ...res.data });
        setDeletePath(res.data.campaignThumb);
        setReady(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updateMemo = () => {
    const file = campBoardList.campaignThumb;
    const form = new FormData();
    form.append("file", file);
    form.append("campaignMemo", campBoardList.campaignMemo);
    form.append("deletePath", deletePath);
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/${campBoardList.campaignParticipanceNo}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        if (res.data === 1) {
          Swal.fire({
            title: "성공적으로 수정",
            text: "성공적으로 수정",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              URL.revokeObjectURL(imgUrl); //마지막으로 나가기 전에 임시 url 삭제
              navigate("/campaign/main"); //campaign_no를 가져와야 detail page로 넘긴다...
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    ready &&
    memberId === campBoardList.memberId && (
      <div className={styles.camp_update_wrap}>
        <div className={styles.camp_update_title}>
          <h2>게시물 수정</h2>
        </div>
        <div
          className={styles.return_btn}
          onClick={() => {
            navigate(`/campaign/detail/${campaignNo}`);
          }}
        >
          {"< " + "돌아가기"}
        </div>
        <div className={styles.camp_update_content_wrap}>
          <div className={styles.camp_update_img_wrap}>
            <p>사진 수정</p>
            <img
              loading="lazy"
              decoding="async"
              alt="캠페인 이미지"
              src={
                imgChange
                  ? imgUrl
                  : normalizeImageUrl(campBoardList.campaignThumb)
              }
            />
            <Button
              className="btn primary sm"
              onClick={() => {
                ref.current.click();
              }}
            >
              사진 바꾸기
            </Button>
            <input
              type="file"
              ref={ref}
              name="campaignThumb"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (campBoardList.campaignThumb !== "") {
                  setCampBoardList({ ...campBoardList, [e.target.name]: "" });
                }
                setCampBoardList({
                  ...campBoardList,
                  [e.target.name]: e.target.files[0],
                });
                if (imgUrl !== null) {
                  URL.revokeObjectURL(imgUrl); //그거 삭제 시키는 로직(아예 없앰)(없애지 않으면 계속 url이 저장되어 있음)
                }
                setImgUrl(URL.createObjectURL(e.target.files[0])); //임시로 URL가져와서 이미지나 파일 띄울수 있는 로직
                setImgChange(true);
              }}
            ></input>
          </div>
          <div className={styles.camp_update_memo_wrap}>
            <label htmlFor="campaignMemo">{"메모 내용"}</label>
            <Input
              id="campaignMemo"
              name="campaignMemo"
              value={campBoardList.campaignMemo}
              onChange={(e) => {
                setCampBoardList({
                  ...campBoardList,
                  [e.target.name]: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div className={styles.camp_update_btn_wrap}>
            <Button className="btn primary lg" onClick={updateMemo}>
              수정하기
            </Button>
          </div>
        </div>
      </div>
    )
  );
};
export default CampaignUpdateDeletePage;
