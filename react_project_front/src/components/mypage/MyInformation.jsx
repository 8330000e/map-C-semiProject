import { useEffect, useState } from "react";
import styles from "./MyInformation.module.css";
import axios from "axios";

import userImg from "../../assets/image/user.png";
import useAuthStore from "../../store/useAuthStore";

const MyInformation = () => {
  const { memberId, memberGrade, memberNickname } = useAuthStore();
  const [member, setMember] = useState();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        console.log(res.data);
        setMember(res.data);
      })
      .catch((err) => {
        console.log(memberId);
        console.log(err);
      });
  }, []);

  //   const memberNickname = "민지원";
  return (
    member && (
      <div className={styles.myinformation_main_wrap}>
        <div className={styles.myinformation_img_wrap}>
          <img src={userImg} />
          <div className={styles.dag}>변경</div>
        </div>
        <div className={styles.myinformation_content_wrap}>
          <ul>
            <li>멤버 아이디{memberId}</li>
            <li>멤버이름:{member.memberName}</li>
            <li>멤버 별명{memberNickname}</li>
            <li>멤버 이메일:{member.memberEmail}</li>
            <li>멤버의 조회수:1234</li>
          </ul>
        </div>
        <div className={styles.myinformation_carbonfootprint_wrap}>
          <p>총 탄소 절약</p>
          <h3>100000kg</h3>
        </div>
      </div>
    )
  );
};
export default MyInformation;
