import { Link } from "react-router-dom";
import "./TestHeader.css";

const TestHeader = () => {
  return (
    <div>
      <div className="header_wrap">
        <h3 className="page-title">회원가입 테스트</h3>
      </div>
      <div>
        <Link to="/join">
          <button type="button">회원가입</button>
        </Link>
      </div>
      <div>
        <Link to="/members/login">
          <button type="button">로그인</button>
        </Link>
      </div>
    </div>
  );
};
export default TestHeader;
