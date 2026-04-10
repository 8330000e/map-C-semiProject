import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CampaignMemoWritePage.module.css";
import { useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { TextArea } from "../../components/ui/Form";
import axios from "axios";
import Swal from "sweetalert2";

const CampaignMemoWritePage = () => {
  const { memberId } = useAuthStore();
  const navigate = useNavigate();
  const params = useParams();
  const ref = useRef(null);
  const campaignNo = params.campaignNo;
  const [fileExist, setFileExist] = useState(false);
  const [writeMemo, setWriteMemo] = useState({
    campaignMemo: "",
  });
  const insertMemo = () => {
    const thumb = ref.current.files && ref.current.files[0];
    console.log(fileExist);
    console.log(memberId);
    const data = new FormData();
    data.append("campaignThumb", thumb);
    data.append("campaignMemo", writeMemo.campaignMemo);
    data.append("campaignNo", campaignNo);
    axios
      .post(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/${memberId}/memothumb`,
        data,
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
            title: "파일 삽입 성공",
            icon: "success",
            text: "파일 삽입을 성공했습니다.",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/campaign/detail/${campaignNo}`);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    memberId && (
      <div className={styles.campMemoWrite_wrap}>
        <div className={styles.campMemoWrite_title}>
          <h2>메모작성</h2>
        </div>
        <div className={styles.campMemoWrite_content_wrap}>
          <Button
            className="btn primary lg"
            onClick={() => {
              ref.current.click();
            }}
          >
            사진선택
          </Button>
          <input
            type="file"
            ref={ref}
            accept="image/*"
            style={{ display: "none" }}
            onChange={() => {
              setFileExist(!fileExist);
            }}
          />
          <input readOnly value={fileExist ? ref.current.value : "없음"} />
          <div>
            <label htmlFor="memoText">작성할 메모</label>
            <TextArea
              id="memoText"
              name="campaignMemo"
              value={writeMemo.campaignMemo}
              onChange={(e) => {
                setWriteMemo({ ...writeMemo, [e.target.name]: e.target.value });
              }}
            ></TextArea>
          </div>
          <Button className="btn primary lg" onClick={insertMemo}>
            메모 등록
          </Button>
        </div>
      </div>
    )
  );
};
export default CampaignMemoWritePage;
