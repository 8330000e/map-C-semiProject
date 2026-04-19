import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CampaignNoticeDetailPage.module.css";

const CampaignNoticeDetailPage = () => {
  const { memberId } = useAuthStore();
  const { campaignNoticeNo } = useParams(); //파라미터로 들어온 공지사항 시퀀스 번호
  const navigate = useNavigate();
  const [noticeDetail, setNoticeDetail] = useState(); //공지사항 정보 담는 state
  const [readComplete, setReadComplete] = useState(false); //axios 읽고 return부분 작성하라고 정의한 state
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNoticeNo}/noticeDetail`,
      )
      .then((res) => {
        console.log(res.data);
        setNoticeDetail({ ...res.data });
        setReadComplete(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []); //캠페인 컨트롤러 마지막 부분에 적혀 있음
  return (
    memberId &&
    readComplete && (
      <div className={styles.campNoDe_outer_wrap}>
        <div className={styles.campNoDe_inner_wrap}>
          <div className={styles.campNoDe_title_wrap}>
            <h2>캠페인 공지사항</h2>
          </div>

          <div className={styles.campNoDe_content}>
            {/* 1. 제목 및 시퀀스 번호 (번호는 작게 표시하거나 숨김 처리 가능) */}
            <div className={styles.notice_header}>
              <span className={styles.label_box}>
                제목:{noticeDetail.campaignNoticeTitle}
                <small className={styles.notice_no}> #{campaignNoticeNo}</small>
              </span>
            </div>

            {/* 2. 작성자 */}
            <div className={styles.notice_info}>
              <span className={styles.label_box}>
                작성자:{noticeDetail.campaignNoticeWriter}
              </span>
            </div>

            {/* 3. 본문 내용 (이미지 중앙 흰색 큰 박스) */}
            <div className={styles.notice_body}>
              {noticeDetail.campaignNoticeContent}
            </div>

            {/* 4. 날짜 및 캠페인 제목 (이미지 왼쪽 하단) */}
            <div className={styles.notice_footer}>
              <div className={styles.label_box}>
                작성일:{noticeDetail.campaignNoticeDate}
              </div>
              {/* 5. 캠페인 제목 (필요시 추가 노출) */}
              {noticeDetail.campaignTitle && (
                <div className={styles.campaign_ref}>
                  대상 캠페인: {noticeDetail.campaignTitle}
                </div>
              )}
            </div>
          </div>

          {/* 닫기 버튼 영역 */}
          <div className={styles.action_wrap}>
            <button
              className={styles.close_btn}
              onClick={() => navigate(`/campaign/notice`)}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CampaignNoticeDetailPage;
