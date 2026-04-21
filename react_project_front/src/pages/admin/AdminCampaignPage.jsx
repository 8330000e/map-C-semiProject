// 캠페인 승인 페이지 - 데이터/API 처리 담당, UI는 AdminCampaign.jsx에서
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminCampaign from "../../components/admin/AdminCampaign";

const AdminCampaignPage = () => {
  // 승인 대기 캠페인 목록 + 선택된 캠페인 상세 패널용
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // 승인 처리 중 중복 클릭 방지
  const [loading, setLoading] = useState(false);

  // 승인 대기 캠페인 목록 조회
  const selectPendingCampaignList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/campaign`)
      .then((res) => {
        setCampaignList(res.data);
        if (res.data.length === 0) {
          setSelectedCampaign(null);
        } else if (!selectedCampaign) {
          setSelectedCampaign(res.data[0]);
        } else {
          const currentCampaign = res.data.find(
            (campaign) => campaign.campaignNo === selectedCampaign.campaignNo,
          );
          setSelectedCampaign(currentCampaign || res.data[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 캠페인 승인 처리
  const approveCampaign = (campaignNo) => {
    if (loading) return;
    setLoading(true);
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/admins/campaign/${campaignNo}/approve`,
      )
      .then((res) => {
        if (res.data === 1) {
          Swal.fire({
            icon: "success",
            title: "캠페인을 승인했습니다.",
            text: "이제 메인 캠페인 목록에서 노출됩니다.",
          });
          selectPendingCampaignList();
        } else {
          Swal.fire({
            icon: "warning",
            title: "승인 처리에 실패했습니다.",
            text: "이미 승인되었거나 상태가 변경되었을 수 있습니다.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "승인 처리 중 오류가 발생했습니다.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 승인 대기 현황판 데이터
  const campaignStats = useMemo(() => {
    const total = campaignList.length;
    const goalMemberSum = campaignList.reduce((sum, campaign) => {
      return sum + (campaign.campaignGoalMember || 0);
    }, 0);
    const averageGoalMember =
      total === 0 ? 0 : Math.round(goalMemberSum / total);
    return { total, goalMemberSum, averageGoalMember };
  }, [campaignList]);

  useEffect(() => {
    selectPendingCampaignList();
  }, []);

  return (
    <AdminCampaign
      campaignList={campaignList}
      selectedCampaign={selectedCampaign}
      setSelectedCampaign={setSelectedCampaign}
      approveCampaign={approveCampaign}
      campaignStats={campaignStats}
      loading={loading}
    />
  );
};

export default AdminCampaignPage;
