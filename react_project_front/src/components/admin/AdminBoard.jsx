import styles from "./AdminBoard.module.css";

const AdminBoard = ({ boardList }) => {
  return (
    <>
      <section className={styles.board_wrap}>
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>작성자</th>
              <th>제목</th>
              <th>작성일시</th>
              <th>감지 키워드</th>
              <th>위험도</th>
              <th>신고수</th>
              <th>상세보기</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board) => (
              <tr key={board.boardNo}>
                <td>{board.boardNo}</td>
                <td>{board.writerId}</td>
                <td>{board.boardTitle}</td>
                <td>{board.boardDate}</td>
                <td>
                  {board.detectedKeyword === ""
                    ? "없음"
                    : board.detectedKeyword}
                </td>
                <td>
                  {board.detectedKeyword !== "" && board.reportCount > 0
                    ? "높음"
                    : "낮음"}
                </td>
                <td>{board.reportCount}</td>
                <td>icon</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminBoard;
