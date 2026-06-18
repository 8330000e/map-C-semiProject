import Swal from "sweetalert2";
import Button from "../ui/Button";
import styles from "./CampaignSettings.module.css";
import { Input } from "../ui/Form";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";

const CampaignTerminate = () => {
  const { memberId } = useAuthStore();
  const { createId, campaignNo } = useParams();
  const [input, setInput] = useState("");
  const [inputCheck, setInputCheck] = useState(false);
  const navigate = useNavigate();
  return (
    <div className={styles.camp_settings_content_wrap}>
      <div className={styles.camp_settings_content_title}>
        <h2>캠페인 조기종료</h2>
      </div>
      <div className={styles.camp_settings_content_main_wrap}>
        <div className={styles.camp_settings_content_terminate}>
          <h3>이 페이지는 캠페인을 강제로 종료 시키는 버튼입니다.</h3>
          <Input
            id="inputId"
            value={input}
            placeholder="현재 사용한 아이디를 입력해 주세요"
            disabled={inputCheck}
            onChange={(e) => {
              setInput(e.target.value);
              if (e.target.value === createId && createId === memberId) {
                setInputCheck(true);
              }
            }}
          ></Input>
          <label htmlFor="inputId">
            {input === createId ? "아이디 체크 완료" : "아이디 체크 필요"}
          </label>
          <p>
            주의사항:캠페인울 강제로 종료시킬경우 포인트는 지급되지
            않습니다.또한 공지사항에 이유등을 공지해 놓으시기 바랍니다.
          </p>
        </div>
        <Button
          className="btn primary lg"
          onClick={() => {
            if (inputCheck) {
              Swal.fire({
                title: "정말로 이 캠페인을 종료시키겠습니까?",
                text: "캠페인은 실패로 끝나고,포인트도 지급되지 않으며,되돌리는 것은 불가능합니다.",
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: "아니요",
                confirmButtonText: "강제로 종료",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .patch(
                      `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}/terminate`,
                    )
                    .then((res) => {
                      console.log(res.data);
                      if (res.data === 1) {
                        Swal.fire({
                          title: "캠페인이 조기종료되었습니다",
                          icon: "success",
                          text: "멤버들에게 알림을 보냈습니다.",
                        }).then(() => {
                          navigate("/");
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  return;
                }
              });
            } else {
              Swal.fire({
                title: "아이디 체크를 해주셔야 합니다",
                icon: "error",
              });
            }
          }}
        >
          캠페인 조기 종료
        </Button>
      </div>
    </div>
  );
};
export default CampaignTerminate;
