import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CampaignMemoWritePage.module.css";
import { useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Form";
import axios from "axios";
import Swal from "sweetalert2";
import { compressImageFile } from "../../utils/compressImage";

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
  const [pickImg, setPickImg] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const insertMemo = async () => {
    let thumb = ref.current.files && ref.current.files[0];
    console.log(fileExist);
    console.log(memberId);
    // 캠페인 메모 이미지도 업로드 전에 압축해서 전송함
    if (thumb && thumb.type.startsWith("image/")) {
      thumb = await compressImageFile(thumb, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.75,
      });
    }
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
          URL.revokeObjectURL(imageUrl);
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
          <div
            className={styles.return_btn}
            onClick={() => {
              navigate(`/campaign/detail/${campaignNo}`);
            }}
          >
            {"<" + "돌아가기"}
          </div>
          <div className={styles.campMemoWrite_img_wrap}>
            <img
              style={pickImg ? { opacity: "1" } : { opacity: "0" }}
              loading="lazy"
              decoding="async"
              alt="캠페인 이미지"
              src={pickImg ? imageUrl : null}
            />
          </div>
          <div className={styles.btn_wrap1}>
            <Button
              className="btn primary sm"
              onClick={() => {
                ref.current.click();
              }}
            >
              사진선택
            </Button>
          </div>

          <input
            type="file"
            ref={ref}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (!e.target.files[0]) {
                return;
              }
              setFileExist(true);
              setPickImg(true);
              if (imageUrl) {
                URL.revokeObjectURL(imageUrl); //그거 삭제 시키는 로직(아예 없앰)(없애지 않으면 계속 url이 저장되어 있음)
              }
              setImageUrl(URL.createObjectURL(e.target.files[0])); //임시로 URL가져와서 이미지나 파일 띄울수 있는 로직
            }}
          />
          {/* <input readOnly value={fileExist ? ref.current.value : "없음"} /> */}
          <div>
            <label htmlFor="memoText">작성할 메모</label>
            <Input
              id="memoText"
              name="campaignMemo"
              value={writeMemo.campaignMemo}
              onChange={(e) => {
                setWriteMemo({ ...writeMemo, [e.target.name]: e.target.value });
              }}
            ></Input>
          </div>
          <div className={styles.btn_wrap2}>
            <Button className="btn primary lg" onClick={insertMemo}>
              메모 등록
            </Button>
          </div>
        </div>
      </div>
    )
  );
};
export default CampaignMemoWritePage;
