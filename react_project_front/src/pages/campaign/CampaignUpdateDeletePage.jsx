import { useParams } from "react-router-dom";
import styles from "./CampaignUpdateDelete.module.css";
import useAuthStore from "../../store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Input } from "../../components/ui/Form";
import Button from "../../components/ui/Button";

const CampaignUpdateDeletePage = () => {
  const param = useParams();
  const { memberId } = useAuthStore();
  const campaignParticipanceNo = param.campaignParticipanceNo;
  const [campBoardList, setCampBoardList] = useState();
  const [ready, setReady] = useState(false);
  const ref = useRef();
  const [imgChange, setImgChange] = useState(false);
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/board/${campaignParticipanceNo}`,
      )
      .then((res) => {
        console.log(res.data);
        setCampBoardList({ ...res.data });
        setReady(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const updateMemo = () => {};
  return (
    ready &&
    memberId === campBoardList.memberId && (
      <div className={styles.camp_update_wrap}>
        <div className={styles.camp_update_title}>
          <h2>게시물 수정</h2>
        </div>
        <div className={styles.camp_update_img_wrap}>
          <img
            src={
              imgChange
                ? ref.current.value
                : `${import.meta.env.VITE_BACKSERVER}/campaign/memo/${campBoardList.campaignThumb}`
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
              setImgChange(true);
              setCampBoardList({
                ...campBoardList,
                [e.target.name]: e.target.value,
              });
              console.log(campBoardList);
            }}
          ></input>
        </div>
        <div className={styles.camp_update_memo_wrap}>
          <label htmlFor="campaignMemo"></label>
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
    )
  );
};
export default CampaignUpdateDeletePage;
