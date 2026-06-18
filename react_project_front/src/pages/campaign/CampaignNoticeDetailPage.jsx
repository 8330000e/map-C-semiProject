import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import styles from "./CampaignNoticeDetailPage.module.css";
import { Input, TextArea } from "../../components/ui/Form";
import Swal from "sweetalert2";

const CampaignNoticeDetailPage = () => {
  const { memberId } = useAuthStore();
  const { campaignNoticeNo } = useParams(); //파라미터로 들어온 공지사항 시퀀스 번호
  const navigate = useNavigate();
  const [noticeDetail, setNoticeDetail] = useState(); //공지사항 정보 담는 state
  const [readComplete, setReadComplete] = useState(false); //axios 읽고 return부분 작성하라고 정의한 state
  const [ifUpdate, setIfUpdate] = useState(true);
  const [updateNotice, setUpdateNotice] = useState({
    campaignNoticeNo: campaignNoticeNo,
    campaignNoticeTitle: "",
    campaignNoticeContent: "",
  });
  const [updateComplete, setUpdateComplete] = useState(false);
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
  }, [updateComplete]); //캠페인 컨트롤러 마지막 부분에 적혀 있음
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
              <small className={styles.notice_no}> #{campaignNoticeNo}</small>
              <Input
                value={
                  ifUpdate
                    ? noticeDetail.campaignNoticeTitle
                    : updateNotice.campaignNoticeTitle
                }
                name="campaignNoticeTitle"
                disabled={ifUpdate}
                placeholder={ifUpdate ? "" : "수정할 제목"}
                onChange={(e) => {
                  setUpdateNotice({
                    ...updateNotice,
                    [e.target.name]: e.target.value,
                  });
                }}
              />
            </div>

            {/* 2. 작성자 */}
            <div className={styles.notice_info}>
              <span className={styles.label_box}>
                작성자:{noticeDetail.campaignNoticeWriter}
              </span>
            </div>

            {/* 3. 본문 내용 (이미지 중앙 흰색 큰 박스) */}
            <TextArea
              value={
                ifUpdate
                  ? noticeDetail.campaignNoticeContent
                  : updateNotice.campaignNoticeContent
              }
              disabled={ifUpdate}
              name="campaignNoticeContent"
              placeholder={ifUpdate ? "" : "수정할 내용"}
              onChange={(e) => {
                setUpdateNotice({
                  ...updateNotice,
                  [e.target.name]: e.target.value,
                });
              }}
            ></TextArea>

            {/* 4. 날짜 및 캠페인 제목 (이미지 왼쪽 하단) */}
            <div className={styles.notice_footer}>
              <div className={styles.label_box}>
                작성일:
                {new Date(noticeDetail.campaignNoticeDate).toLocaleDateString(
                  "kr-KR",
                )}
              </div>
              {/* 5. 캠페인 제목 (필요시 추가 노출) */}
              <div className={styles.notice_footer2}>
                {noticeDetail.campaignTitle && (
                  <div className={styles.campaign_ref}>
                    대상 캠페인: {noticeDetail.campaignTitle}
                  </div>
                )}
                <div className={styles.update_btn_wrap}>
                  <button
                    disabled={ifUpdate}
                    style={
                      ifUpdate ? { display: "none" } : { display: "block" }
                    }
                    onClick={() => {
                      axios
                        .patch(
                          `${import.meta.env.VITE_BACKSERVER}/campaigns/updateDetailNotice`,
                          updateNotice,
                        )
                        .then((res) => {
                          console.log(res.data);
                          if (res.data === 1) {
                            setUpdateComplete(!updateComplete);
                            Swal.fire({
                              title: "수정완료",
                              text: "공지사항 수정을 완료했습니다.",
                              icon: "success",
                            }).then(() => {
                              setIfUpdate(true);
                              {
                                console.log(updateComplete);
                              }
                            });
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    수정확인
                  </button>
                  <button
                    disabled={ifUpdate}
                    style={
                      ifUpdate ? { display: "none" } : { display: "block" }
                    }
                    onClick={() => {
                      setIfUpdate(true);
                    }}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 닫기 버튼 영역 */}
          <div className={styles.action_wrap}>
            {memberId === noticeDetail.campaignNoticeWriter && (
              <div className={styles.notice_detail_change_btn}>
                <Button
                  className="btn primary sm"
                  disabled={!ifUpdate}
                  onClick={() => {
                    setIfUpdate(false);
                  }}
                >
                  수정
                </Button>
                <Button
                  className="btn primary sm"
                  onClick={() => {
                    Swal.fire({
                      text: "공자사항 삭제",
                      text: "정말로 공지사항을 삭제하시겠습니까?",
                      icon: "question",
                      showCancelButton: true,
                      cancelButtonText: "아니요",
                      confirmButtonText: "예",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        axios
                          .delete(
                            `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNoticeNo}/deleteDetailNotice`,
                          )
                          .then((res) => {
                            console.log(res.data);
                            if (res.data === 1) {
                              Swal.fire({
                                title: "삭제완료",
                                text: "공지사항 삭제를 완료했습니다.",
                                icon: "success",
                              }).then(() => {
                                navigate("/campaign/notice");
                              });
                            }
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    });
                  }}
                >
                  삭제
                </Button>
              </div>
            )}
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
