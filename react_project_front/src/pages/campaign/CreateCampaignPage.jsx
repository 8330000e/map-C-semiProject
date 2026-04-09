import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CreateCampaignPage.module.css";
import { Input, TextArea } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateCampaignPage = () => {
  const goalRef = useRef();
  const navigate = useNavigate();
  const { memberId } = useAuthStore();
  const [ready, setReady] = useState(false);
  const [writeInfo, setWriteInfo] = useState({
    campaignExpireDate: "",
    campaignGoalMember: "",
    campaignTitle: "",
    campaignExplanation: "",
  });
  const createChallenge = () => {
    console.log(writeInfo);
    console.log(memberId);
    if (
      writeInfo.campaignTitle !== "" &&
      writeInfo.campaignExpireDate !== "" &&
      writeInfo.campaignExplanation !== "" &&
      writeInfo.campaignGoalMember !== "" &&
      isFinite(writeInfo.campaignGoalMember) && //숫자면 true,아니면 false/반대는 isNaN
      writeInfo.campaignGoalMember >= 100
    ) {
      axios
        .post(
          `${import.meta.env.VITE_BACKSERVER}/campaigns/${memberId}`,
          writeInfo,
        )
        .then((res) => {
          console.log(res.data);
          if (res.data === 1) {
            Swal.fire({
              title: "캠페인 승인 요청을 관리자에게 보냈습니다.",
              icon: "success",
              text: "관리자가 승인할시에 챌린지가 시작됩니다.",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/");
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        icon: "error",
        text: "입력양식에 빠진 부분이 있어서는 안됩니다.",
        title:
          "입력양식을 확인해 주세요(목표인원수는 문자가 없고 100이상의 숫자여야 합니다.)",
      });
    }
  };
  return (
    memberId && (
      <div className={styles.createcampaign_wrap}>
        <div className={styles.createcampaign_title}>
          <h2>챌린지 생성</h2>
        </div>
        <div className={styles.createcampaign_content_wrap}>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              createChallenge();
            }}
          >
            <div>
              <label htmlFor="cTitle">캠페인 제목(주제)</label>
              <Input
                id="cTitle"
                name="campaignTitle"
                ref={goalRef}
                value={writeInfo.campaignTitle}
                onChange={(e) => {
                  setWriteInfo({
                    ...writeInfo,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </div>
            {/**일자 정하는 것 */}
            <Input
              type="date"
              onChange={(e) => {
                setWriteInfo({
                  ...writeInfo,
                  campaignExpireDate: e.target.value,
                });
              }}
            />
            {/** */}
            <div>
              <label htmlFor="cGoalMember">목표인원수</label>
              <Input
                id="cGoalMember"
                name="campaignGoalMember"
                value={writeInfo.campaignGoalMember}
                placeholder="최소 인원은 100명부터입니다."
                onChange={(e) => {
                  setWriteInfo({
                    ...writeInfo,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
              <p></p>
            </div>
            <div>
              <label htmlFor="cTitle">캠페인 설명문</label>
              <TextArea
                id="cExplanation"
                name="campaignExplanation"
                value={writeInfo.campaignExplanation}
                onChange={(e) => {
                  setWriteInfo({
                    ...writeInfo,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </div>
            <div className={styles.createcampaign_btn_wrap}>
              <Button className="btn primary lg" type="submit">
                승인요청
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
export default CreateCampaignPage;
