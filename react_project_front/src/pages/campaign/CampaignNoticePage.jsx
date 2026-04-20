import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import styles from "./CampaignNoticePage.module.css";
import Button from "../../components/ui/Button";
import axios from "axios";
import Pagination from "../../components/ui/Pagination";

const CampaignNotice = () => {
  const { memberId } = useAuthStore();
  const [noticeList, setNoticeList] = useState([]);
  const navigate = useNavigate();
  const [readList, setReadList] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState();
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/campaigns/notice?page=${page}&size=10`,
      )
      .then((res) => {
        console.log(res.data);
        setNoticeList([...res.data.campNo]);
        setTotalPage(res.data.totalPage);
        setReadList(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);
  return (
    readList && (
      <div className={styles.camp_notice_wrap}>
        <div className={styles.camp_notice_title}>
          <h2>캠페인 공지사항</h2>
        </div>
        <div className={styles.camp_notice_content_wrap}>
          <div className={styles.camp_notice_content_title}>
            <ul className={styles.camp_notice_list_wrap_title}>
              <li className={styles.camp_notice_list1}>공지번호</li>
              <li className={styles.camp_notice_list2}>공지제목</li>
              <li className={styles.camp_notice_list3}>캠페인제목</li>
              <li className={styles.camp_notice_list4}>게시자</li>
              <li className={styles.camp_notice_list5}>작성일</li>
            </ul>
          </div>
          {console.log(noticeList)}
          <div className={styles.camp_notice_main_content}>
            {noticeList.map((notice, index) => {
              return (
                <ul
                  className={styles.camp_notice_list_wrap}
                  key={notice.campaignNoticeTitle + index}
                  onClick={() => {
                    navigate(
                      `/campaign/noticeDetail/${notice.campaignNoticeNo}`,
                    );
                  }}
                >
                  <li className={styles.camp_notice_list1}>
                    {notice.campaignNoticeNo}
                  </li>
                  <li className={styles.camp_notice_list2}>
                    {notice.campaignNoticeTitle}
                  </li>
                  <li className={styles.camp_notice_list3}>
                    {notice.campaignTitle}
                  </li>
                  <li className={styles.camp_notice_list4}>
                    {notice.campaignNoticeWriter}
                  </li>
                  <li className={styles.camp_notice_list5}>
                    {notice.campaignNoticeDate}
                  </li>
                </ul>
              );
            })}
          </div>
        </div>
        <div className={styles.camp_notice_btn_wrap}>
          {(totalPage !== 0 || totalPage !== null) && (
            <Pagination
              page={page}
              totalPage={totalPage}
              setPage={setPage}
              naviSize={5}
            />
          )}
          <Button
            className="btn primary sm"
            onClick={() => {
              navigate("/campaign/main");
            }}
          >
            돌아가기
          </Button>
        </div>
      </div>
    )
  );
};
export default CampaignNotice;
