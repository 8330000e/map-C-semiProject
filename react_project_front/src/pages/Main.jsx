import HelpIcon from "@mui/icons-material/Help";

const Main = () => {
  return (
    <main className="main_wrap">
      <div className="main_top">
        <div className="main_nav">
          <div className="menu_bar">
            <span>메뉴</span>
          </div>
          <ul>
            <li>맵 커뮤니티</li>
            <li>회원끼리 캠페인</li>
            <li>중고거래</li>
            <li>미션</li>
            <li>나무 키우기</li>
            <li>
              <span>
                <hr />
              </span>
            </li>
            <li>공지사항</li>
          </ul>
          <div className="main_quest_wrap">
            <span>
              <p>고객센터</p>
              <p>
                <HelpIcon />
              </p>
            </span>
            <p>고객센터 운영시간</p>
            <p>10:00 ~ 18:00</p>
            <button>문의하기 ▶</button>
          </div>
        </div>
        <div className="main_map roundBorder">
          <p>Map</p>
          {/*위치설명*/}
        </div>
        <div className="main_content_one">
          <div className="best_list roundBorder">
            <p>인기게시글</p>
            {/*위치설명*/}
          </div>
          <div className="tip_list roundBorder">
            <p>팁 리스트</p>
            {/*위치설명*/}
          </div>
        </div>
        <div className="main_content_two">
          <div className="campaign_zone roundBorder">
            <p>캠페인 존</p>
            {/*위치설명*/}
          </div>
          <div className="realtime_comment roundBorder">
            <p>실시간 댓글</p>
            {/*위치설명*/}
          </div>
          <div className="rank_list roundBorder">
            <p>랭킹 리스트</p>
            {/*위치설명*/}
          </div>
        </div>
      </div>
      <div className="main_btm">
        <div className="used_list roundBorder">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Main;
