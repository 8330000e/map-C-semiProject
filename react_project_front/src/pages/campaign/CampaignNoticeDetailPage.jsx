import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";

const CampaignNoticeDetailPage = () => {
  const { campaignNoticeNo } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      <h2>캠페인 공지 상세보기</h2>
      <p>{campaignNoticeNo}</p>
      <Button
        className="btn primary sm"
        onClick={() => {
          navigate(`/campaign/notice`);
        }}
      >
        돌아가기
      </Button>
    </div>
  );
};

export default CampaignNoticeDetailPage;
