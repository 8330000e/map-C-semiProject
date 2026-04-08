import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CreateCampaignPage.module.css";
import { Input, TextArea } from "../../components/ui/Form";
import Button from "../../components/ui/Button";
import axios from "axios";

const CreateCampaignPage = () => {
  const goalRef = useRef();
  const { memberId } = useAuthStore();
  const [sendInfo, setSendInfo] = useState();
  const [ready, setReady] = useState(false);
  const [writeInfo, setWriteInfo] = useState({
    campaignExpireDate: "",
    campaignGoalMember: "",
    campaignTitle: "",
    campaignExplanation: "",
  });
  //   const createChallenge = () => {
  //     console.log(sendInfo);
  //     console.log(memberId);
  //     if (
  //       (sendInfo !== null,
  //       sendInfo.campaignTitle !== "",
  //       sendInfo.campaignExpireDate !== "",
  //       sendInfo.campaignExplanation !== "",
  //       sendInfo.campaignGoalMember !== "")
  //     ) {
  //       axios
  //         .post(
  //           `${import.meta.env.VITEBACKSERVER}/campaigns/${memberId}`,
  //           sendInfo,
  //         )
  //         .then((res) => {
  //           console.log(res.data);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   };
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
              console.log(234);
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
              <Button
                className="btn primary lg"
                type="submit"
                onClick={() => {
                  console.log(123);
                  setSendInfo({ ...writeInfo });
                }}
              >
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
