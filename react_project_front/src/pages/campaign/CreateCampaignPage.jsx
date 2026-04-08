import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CreateCampaignPage.module.css";
import { Input, TextArea } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";
import Swal from "sweetalert2";

const CreateCampaignPage = () => {
  const goalRef = useRef();
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
      writeInfo.campaignGoalMember !== ""
    ) {
      axios
        .post(
          `${import.meta.env.VITE_BACKSERVER}/campaigns/${memberId}`,
          writeInfo,
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Swal.fire({
        icon: "error",
        text: "입력양식에 빠진 부분이 있어서는 안됩니다.",
        title: "입력양식을 확인해 주세요",
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
