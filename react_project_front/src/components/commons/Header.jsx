import styles from "./commons.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";

const Header = () => {
  return (
    <>
      <header>
        <h1>탄소커넥트</h1>
        <div className={styles.header_wrap}>
          {/*로그인전*/}
          <div className={styles.login}>
            <button>로그인</button>
            <button>회원가입</button>
          </div>
          {/*로그인후*/}
          <div className={styles.profile_bar_wrap}>
            <div className={styles.profile_item}>
              <AccountCircleIcon sx={{ fontSize: 30, color: "#464d3e" }} />
              <span className={styles.profile_item}>닉네임</span>
            </div>
            <div className={styles.profile_alarm}>
              <NotificationsIcon sx={{ fontSize: 30, color: "#464d3e" }} />
            </div>
            <div className={styles.profile_messeag}>
              <MailIcon sx={{ fontSize: 30, color: "#464d3e" }} />
            </div>
            <div className={styles.profile_setting}>
              <SettingsIcon sx={{ fontSize: 30, color: "#464d3e" }} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
