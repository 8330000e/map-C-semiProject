import { useEffect, useRef, useState } from "react";
import styles from "./MyInformation.module.css";
import axios from "axios";

import userImg from "../../assets/admin.png";
import useAuthStore from "../../store/useAuthStore.js";

const MyInformation = () => {
  const { memberId, memberNickname, memberThumb } = useAuthStore();
  const [member, setMember] = useState();
  const reference = useRef(null);

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

  const changeThumb = () => {
    const thumbFile = reference.current.files && reference.current.files[0]; //1번째 조건 불충족시 undefined,충족하면 그중에 [0], 즉 첫번째 파일
    if (!thumbFile) {
      return;
    }
    const data = new FormData();
    data.append("file", thumbFile);
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/members/${memberId}/thumb`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then((res) => {
        console.log(res.data);
        useAuthStore.getState().setThumb(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    member && (
      <div className={styles.myinformation_main_wrap}>
        <div className={styles.myinformation_img_wrap}>
          <img
            src={
              userImg
              // memberThumb !== null
              //   ? `${import.meta.env.VITE_BACKSERVER}/member/thumb/${memberThumb}`
              //   : userImg
            }
          />
          <div
            className={styles.dag}
            onClick={() => {
              reference.current.click();
            }}
          >
            변경
          </div>
          {/* accept="image"->이미지만 선택 가능하게 막아놓음 */}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={reference}
          style={{ display: "none" }}
          onChange={changeThumb}
        />

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
