import styles from "./commons.module.css";

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.footer_wrap}>
          <div className={styles.footer_guide}>
            <ul>
              <li>광고 및 제휴 안내</li>
              <li>이용약관</li>
              <li>개인정보처리방침</li>
              <li>저작권 규약</li>
            </ul>
          </div>
          <div className={styles.footer_info}>
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
