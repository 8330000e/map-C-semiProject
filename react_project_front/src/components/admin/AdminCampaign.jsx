import styles from "./AdminCampaign.module.css";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Groups2Icon from "@mui/icons-material/Groups2";

const AdminCampaign = ({
  campaignList,
  selectedCampaign,
  setSelectedCampaign,
  approveCampaign,
  campaignStats,
  loading,
}) => {
  return (
    <section className={styles.campaign_wrap}>
      <div className={styles.campaign_header}>
        <h3>캠페인 승인센터</h3>
        <div className={styles.stat_item}>
          <FactCheckIcon className={styles.header_icon} />
          <span className={styles.stat_label}>승인 대기</span>
          <span className={styles.stat_value}>{campaignStats.total}건</span>
        </div>
        <div className={styles.stat_item}>
          <Groups2Icon className={styles.header_icon} />
          <span className={styles.stat_label}>목표 인원 합계</span>
          <span className={styles.stat_value}>
            {campaignStats.goalMemberSum}명
          </span>
        </div>
        <div className={styles.stat_item}>
          <HowToRegIcon className={styles.header_icon} />
          <span className={styles.stat_label}>평균 목표 인원</span>
          <span className={styles.stat_value}>
            {campaignStats.averageGoalMember}명
          </span>
        </div>
      </div>

      {campaignList.length === 0 ? (
        <div className={styles.empty_state_wrap}>
          <div className={styles.empty_state_title}>승인 대기 캠페인</div>
          <div className={styles.empty_state_text}>
            현재 승인 대기 중인 캠페인이 없습니다.
          </div>
        </div>
      ) : (
        <div className={styles.campaign_content}>
          <div className={styles.campaign_list_wrap}>
            <table className={styles.campaign_table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>신청자</th>
                  <th>제목</th>
                  <th>목표인원</th>
                  <th>마감일</th>
                </tr>
              </thead>
              <tbody>
                {campaignList.map((campaign) => (
                  <tr
                    key={campaign.campaignNo}
                    className={
                      selectedCampaign?.campaignNo === campaign.campaignNo
                        ? styles.active_row
                        : ""
                    }
                    onClick={() => {
                      setSelectedCampaign(campaign);
                    }}
                  >
                    <td>{campaign.campaignNo}</td>
                    <td>{campaign.memberId}</td>
                    <td>{campaign.campaignTitle}</td>
                    <td>{campaign.campaignGoalMember}명</td>
                    <td>{campaign.campaignExpireDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.detail_wrap}>
            <div className={styles.detail_header}>승인 요청 상세</div>
            {selectedCampaign ? (
              <>
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>캠페인 번호</span>
                  <span className={styles.detail_value}>
                    {selectedCampaign.campaignNo}
                  </span>
                </div>
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>신청자</span>
                  <span className={styles.detail_value}>
                    {selectedCampaign.memberId}
                  </span>
                </div>
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>캠페인 제목</span>
                  <span className={styles.detail_value}>
                    {selectedCampaign.campaignTitle}
                  </span>
                </div>
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>목표 인원</span>
                  <span className={styles.detail_value}>
                    {selectedCampaign.campaignGoalMember}명
                  </span>
                </div>
                <div className={styles.detail_item}>
                  <span className={styles.detail_label}>종료일</span>
                  <span className={styles.detail_value}>
                    {selectedCampaign.campaignExpireDate}
                  </span>
                </div>
                <div className={styles.detail_item_column}>
                  <span className={styles.detail_label}>설명문</span>
                  <div className={styles.detail_box}>
                    {selectedCampaign.campaignExplanation}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.approve_btn}
                  disabled={loading}
                  onClick={() => {
                    approveCampaign(selectedCampaign.campaignNo);
                  }}
                >
                  {loading ? "처리중..." : "승인하기"}
                </button>
              </>
            ) : (
              <div className={styles.empty_detail}>
                승인할 캠페인을 왼쪽 목록에서 선택하세요.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminCampaign;
