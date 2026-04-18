// AdminReport.jsx
// UI 렌더링만 담당, 로직/상태/API는 모두 AdminReportPage.jsx에서 처리
// 모든 데이터와 함수는 props로 받아서 사용

import { Fragment, useRef, useState } from "react";
import CommunityDetail from "../board/Community/CommunityDetail";
import styles from "./AdminReport.module.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"; // 상세보기 아이콘

const AdminReport = ({
  reportList,
  selectedReport,
  setSelectedReport,
  boardDetail,
  groupList,
  openedKey,
  setOpenedKey,
  isModalOpen,
  showDetail,
  setShowDetail,
  adminLog,
  logReason,
  setLogReason,
  reportFilter,
  changeReportFilter,
  toggleCountSort,
  toggleDateSort,
  reportAction,
  changeReportAction,
  detailRef,
  resetModal,
  selectDetail,
  selectReportGroup,
  selectAdminLog,
  handleSubmit,
  handleRelease,
  reportStats,
}) => {
  // 닫는 중인 그룹 키 (닫기 애니메이션 동안만 유지)
  const [closingKey, setClosingKey] = useState(null);
  // 닫기 setTimeout 참조 (새 클릭 시 취소하려고 보관)
  const closeTimerRef = useRef(null);
  const CLOSE_DURATION = 450;

  return (
    <>
      <div className={styles.report_wrap}>
        {/* 현황판 - 전체/미처리/처리완료 수 + 처리율 스택 바 */}
        <div className={styles.report_header}>
          <h3>신고 현황판</h3>
          <div className={styles.stat_item}>
            <span className={styles.stat_label}>전체</span>
            <span className={styles.stat_value}>{reportStats.total}건</span>
          </div>
          <div className={styles.stat_item}>
            <span className={`${styles.stat_dot} ${styles.dot_pending}`} />
            <span className={styles.stat_label}>미처리</span>
            <span className={`${styles.stat_value} ${styles.value_pending}`}>
              {reportStats.pending}건
            </span>
          </div>
          <div className={styles.stat_item}>
            <span className={`${styles.stat_dot} ${styles.dot_done}`} />
            <span className={styles.stat_label}>처리완료</span>
            <span className={`${styles.stat_value} ${styles.value_done}`}>
              {reportStats.done}건
            </span>
          </div>

          {/* 스택 바 - 미처리/처리완료 비율 */}
          <div className={styles.stack_bar_wrap}>
            <div className={styles.stack_bar}>
              {reportStats.pendingRate > 0 && (
                <div
                  className={`${styles.stack_seg} ${styles.seg_pending}`}
                  style={{ width: `${reportStats.pendingRate}%` }}
                  title={`미처리 ${reportStats.pending}건 (${reportStats.pendingRate.toFixed(1)}%)`}
                >
                  {reportStats.pendingRate >= 12
                    ? `${reportStats.pendingRate.toFixed(0)}%`
                    : ""}
                </div>
              )}
              {reportStats.doneRate > 0 && (
                <div
                  className={`${styles.stack_seg} ${styles.seg_done}`}
                  style={{ width: `${reportStats.doneRate}%` }}
                  title={`처리완료 ${reportStats.done}건 (${reportStats.doneRate.toFixed(1)}%)`}
                >
                  {reportStats.doneRate >= 12
                    ? `${reportStats.doneRate.toFixed(0)}%`
                    : ""}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 신고 목록 테이블 */}
        <div className={styles.report_table}>
          <table>
            <thead>
              <tr>
                <th>신고번호</th>
                <th>신고대상 아이디</th>
                <th>
                  <select
                    value={reportFilter.type}
                    onChange={changeReportFilter}
                    name="type"
                  >
                    <option value={"all"}>유형</option>
                    <option value={"board"}>게시글</option>
                    <option value={"comment"}>댓글</option>
                  </select>
                </th>
                <th>
                  <select
                    value={reportFilter.category}
                    onChange={changeReportFilter}
                    name="category"
                  >
                    <option value={"all"}>신고 카테고리</option>
                    <option value={"스팸/광고"}>스팸/광고</option>
                    <option value={"욕설/비방"}>욕설/비방</option>
                    <option value={"허위정보"}>허위정보</option>
                    <option value={"부적절한 댓글"}>부적절한 댓글</option>
                    <option value={"기타"}>기타</option>
                  </select>
                </th>
                <th onClick={toggleCountSort} className={styles.sort_th}>
                  신고수
                  <span className={styles.sort_arrow}>
                    {reportFilter.sortBy === "reportCount"
                      ? reportFilter.sortOrder === "desc"
                        ? "▼"
                        : "▲"
                      : ""}
                  </span>
                </th>
                <th onClick={toggleDateSort} className={styles.sort_th}>
                  신고일
                  <span className={styles.sort_arrow}>
                    {reportFilter.sortBy === "reportDate"
                      ? reportFilter.sortOrder === "desc"
                        ? "▼"
                        : "▲"
                      : ""}
                  </span>
                </th>
                <th>처리여부</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {reportList.map((report) => {
                const thisKey = `${report.targetNo}_${report.targetType}`;
                const isOpened = openedKey === thisKey;
                const isClosing = closingKey === thisKey;
                return (
                  <Fragment key={report.reportNo}>
                    <tr
                      onClick={(e) => {
                        e.stopPropagation();
                        // 기존 닫기 타이머 취소 (중간에 다시 클릭한 경우)
                        if (closeTimerRef.current) {
                          clearTimeout(closeTimerRef.current);
                          closeTimerRef.current = null;
                        }
                        if (openedKey === thisKey) {
                          // 닫기: 먼저 closingKey 세팅 → 애니메이션 끝나면 실제로 제거
                          setClosingKey(thisKey);
                          closeTimerRef.current = setTimeout(() => {
                            setOpenedKey(null);
                            setClosingKey(null);
                            closeTimerRef.current = null;
                          }, CLOSE_DURATION);
                        } else {
                          // 열기
                          setClosingKey(null);
                          setOpenedKey(thisKey);
                          selectReportGroup(
                            report.targetNo,
                            report.targetType,
                            report.reportNo,
                          );
                        }
                      }}
                    >
                      <td>{report.reportNo}</td>
                      <td>{report.targetId}</td>
                      <td>
                        {report.targetType === "board" ? "게시글" : "댓글"}
                      </td>
                      <td>{report.reportCategory}</td>
                      <td>{report.reportCount}</td>
                      <td>{report.reportDate}</td>
                      <td>
                        {report.reportStatus === 0 ? "미처리" : "처리완료"}
                      </td>
                      <td
                        onClick={() => {
                          selectDetail(report.boardNo);
                          setSelectedReport(report);
                          if (report.reportStatus === 1) {
                            selectAdminLog(report.reportNo);
                          }
                        }}
                      >
                        <OpenInNewIcon />
                      </td>
                    </tr>

                    {(isOpened || isClosing) &&
                      groupList.map((group) => (
                        <tr
                          key={group.reportNo}
                          className={`${styles.detail_row_sub} ${isClosing ? styles.detail_row_closing : ""}`}
                        >
                          <td>{group.reportNo}</td>
                          <td>{group.targetId}</td>
                          <td>
                            {group.targetType === "board" ? "게시글" : "댓글"}
                          </td>
                          <td>{group.reportCategory}</td>
                          <td>{group.reportCount}</td>
                          <td>{group.reportDate}</td>
                          <td>
                            {group.reportStatus === 0 ? "미처리" : "처리완료"}
                          </td>
                          <td
                            onClick={() => {
                              selectDetail(group.boardNo);
                              setSelectedReport(group);
                              if (group.reportStatus === 1) {
                                selectAdminLog(group.reportNo);
                              }
                            }}
                          >
                            <OpenInNewIcon />
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal_bg} onClick={() => resetModal()}>
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()} // 모달 안 클릭이 배경까지 전파되지 않도록 막음
          >
            <div className={styles.detail_section}>
              <h4>신고 상세</h4>
              <div className={styles.detail_row}>
                <span className={styles.detail_label}>신고 대상 아이디</span>
                {/* ?.: selectedReport가 null이면 접근하지 않음 (옵셔널 체이닝) */}
                <span className={styles.detail_value}>
                  {selectedReport?.targetId}
                </span>
              </div>
              <div className={styles.detail_row}>
                <span className={styles.detail_label}>신고 카테고리</span>
                <span className={styles.detail_value}>
                  {selectedReport?.reportCategory}
                </span>
              </div>
              <div className={styles.detail_row}>
                <span className={styles.detail_label}>신고 내용</span>
                <span className={styles.detail_value}>
                  {selectedReport?.reportContent}
                </span>
              </div>
            </div>
            {selectedReport.reportStatus === 0 ? (
              <form onSubmit={handleSubmit}>
                <div className={styles.action_wrap}>
                  {/* 게시글 조치 라디오 - name="boardAction"으로 그룹화, 하나만 선택 가능 */}
                  {selectedReport.targetType === "board" ? (
                    <div className={styles.action_section}>
                      <h4>게시글 조치</h4>
                      <div className={styles.action_row}>
                        <span>미처리</span>
                        <input
                          type="radio"
                          name="boardAction"
                          value="미처리"
                          checked={reportAction.boardAction === "미처리"}
                          onChange={changeReportAction}
                        />
                      </div>
                      <div className={styles.action_row}>
                        <span>비공개 처리</span>
                        <input
                          type="radio"
                          name="boardAction"
                          value="비공개 처리"
                          checked={reportAction.boardAction === "비공개 처리"}
                          onChange={changeReportAction}
                        />
                      </div>
                      <div className={styles.action_row}>
                        <span>삭제 처리</span>
                        <input
                          type="radio"
                          name="boardAction"
                          value="삭제 처리"
                          checked={reportAction.boardAction === "삭제 처리"}
                          onChange={changeReportAction}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.action_section}>
                      <h4>댓글 조치</h4>
                      <div className={styles.action_row}>
                        <span>미처리</span>
                        <input
                          type="radio"
                          name="commentAction"
                          value="미처리"
                          checked={reportAction.commentAction === "미처리"}
                          onChange={changeReportAction}
                        />
                      </div>
                      <div className={styles.action_row}>
                        <span>블라인드 처리</span>
                        <input
                          type="radio"
                          name="commentAction"
                          value="블라인드 처리"
                          checked={
                            reportAction.commentAction === "블라인드 처리"
                          }
                          onChange={changeReportAction}
                        />
                      </div>
                    </div>
                  )}

                  {/* 회원 조치 라디오 - name="memberAction"으로 그룹화, 하나만 선택 가능 */}
                  <div className={styles.action_section}>
                    <h4>회원 조치</h4>
                    <div className={styles.action_row}>
                      <span>미처리</span>
                      <input
                        type="radio"
                        name="memberAction"
                        value="미처리"
                        checked={reportAction.memberAction === "미처리"}
                        onChange={changeReportAction}
                      />
                    </div>
                    <div className={styles.action_row}>
                      <span>경고 처리</span>
                      <input
                        type="radio"
                        name="memberAction"
                        value="경고 처리"
                        checked={reportAction.memberAction === "경고 처리"}
                        onChange={changeReportAction}
                      />
                    </div>
                    <div className={styles.action_row}>
                      <span>이용 정지 (1일)</span>
                      <input
                        type="radio"
                        name="memberAction"
                        value="1"
                        checked={reportAction.memberAction === "1"}
                        onChange={changeReportAction}
                      />
                    </div>
                    <div className={styles.action_row}>
                      <span>이용 정지 (3일)</span>
                      <input
                        type="radio"
                        name="memberAction"
                        value="3"
                        checked={reportAction.memberAction === "3"}
                        onChange={changeReportAction}
                      />
                    </div>
                    <div className={styles.action_row}>
                      <span>이용 정지 (7일)</span>
                      <input
                        type="radio"
                        name="memberAction"
                        value="7"
                        checked={reportAction.memberAction === "7"}
                        onChange={changeReportAction}
                      />
                    </div>
                    <div className={styles.action_row}>
                      <span>영구정지</span>
                      <input
                        type="radio"
                        name="memberAction"
                        value="영구정지"
                        checked={reportAction.memberAction === "영구정지"}
                        onChange={changeReportAction}
                      />
                    </div>
                  </div>
                </div>

                {/* 처리 사유 입력 */}
                <div className={styles.reason_section}>
                  {(reportAction.memberAction === "1" ||
                    reportAction.memberAction === "3" ||
                    reportAction.memberAction === "7" ||
                    reportAction.memberAction === "영구정지") && (
                    <textarea
                      placeholder="회원에게 보여줄 메세지"
                      name="lockReason"
                      value={reportAction.lockReason}
                      onChange={changeReportAction}
                    />
                  )}

                  <textarea
                    placeholder="게시글 및 회원에 대한 조치 사유를 자세히 작성하세요."
                    name="reason"
                    value={reportAction.reason}
                    onChange={changeReportAction}
                  />
                </div>

                {/* 버튼 영역 */}
                <div className={styles.modal_btn_wrap}>
                  <button
                    type="button"
                    className={styles.btn_cancel}
                    onClick={() => resetModal()}
                  >
                    취소
                  </button>
                  <button className={styles.btn_confirm} type="submit">
                    처리 확정
                  </button>
                  <button
                    type="button"
                    className={styles.btn_detail}
                    onClick={() => setShowDetail(true)}
                  >
                    원본
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {adminLog ? (
                  <>
                    <div className={styles.action_section}>
                      <h4>처리 내역</h4>
                      <div className={styles.detail_row}>
                        <span className={styles.detail_label}>처리 관리자</span>
                        <span className={styles.detail_value}>
                          {adminLog.adminId}
                        </span>
                      </div>
                      <div className={styles.detail_row}>
                        <span className={styles.detail_label}>
                          대상 회원아이디
                        </span>
                        <span className={styles.detail_value}>
                          {adminLog.logTargetId}
                        </span>
                      </div>
                      <div className={styles.detail_row}>
                        <span className={styles.detail_label}>조치 내용</span>
                        <span className={styles.detail_value}>
                          {adminLog.logResult}
                        </span>
                      </div>
                      <div className={styles.detail_row}>
                        <span className={styles.detail_label}>조치 사유</span>
                        <span className={styles.detail_value}>
                          {adminLog.logReason}
                        </span>
                      </div>

                      <div className={styles.detail_row}>
                        <span className={styles.detail_label}>처리 날짜</span>
                        <span className={styles.detail_value}>
                          {adminLog.logDate}
                        </span>
                      </div>
                    </div>

                    <div className={styles.reason_section}>
                      <textarea
                        placeholder="해제 사유를 입력하세요."
                        value={logReason}
                        onChange={(e) => {
                          setLogReason(e.target.value);
                        }}
                      ></textarea>
                    </div>

                    <div className={styles.modal_btn_wrap}>
                      <button
                        type="button"
                        className={styles.btn_cancel}
                        onClick={() => resetModal()}
                      >
                        닫기
                      </button>
                      <button
                        type="button"
                        className={styles.btn_release}
                        onClick={() =>
                          handleRelease(selectedReport.targetId, logReason)
                        }
                      >
                        정지 해제
                      </button>
                      <button
                        type="button"
                        className={styles.btn_detail}
                        onClick={() => setShowDetail(true)}
                      >
                        원본
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.empty_state}>
                    처리 내역을 불러오는 중...
                  </div>
                )}
              </div>
            )}

            {/* showDetail이 true일 때만 CommunityDetail 렌더링 */}
            {showDetail && (
              // ref={detailRef}: 이 div가 화면에 나타나는 순간 detailRef.current에 DOM 요소가 담김
              // Page의 useEffect에서 detailRef.current.scrollIntoView()로 스크롤
              <div ref={detailRef}>
                <CommunityDetail
                  board={boardDetail}
                  onEdit={null}
                  onDelete={null}
                  onLikeChange={null}
                  onCommentCountChange={null}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminReport;
