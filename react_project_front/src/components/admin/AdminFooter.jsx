// 관리자 페이지 푸터 - 약관 링크, 서비스 정보 표시
import styles from "./AdminCommons.module.css";

const Footer = () => {
  return (
    <>
      <div className={styles.admin_footer}>
        <div className={styles.admin_footer_wrap}>
          <div className={styles.admin_footer_guide}>
            <ul>
              <li>광고 및 제휴 안내</li>
              <li>이용약관</li>
              <li>개인정보처리방침</li>
              <li>저작권 규약</li>
            </ul>
          </div>
          <div className={styles.admin_footer_info}>
            <p>
              탄소커넥트(Carbon Connect) | 서울특별시 강남구 테헤란로 123 |
              제작발표일 2026년 04월 22일
            </p>
            <p>
              Copyright Herald KH정보교육원 종로 Students. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
