import { useEffect, useRef, useState } from "react";
import styles from "./MyInformation.module.css";
import axios from "axios";

import userImg from "../../assets/admin.png";
import useAuthStore from "../../store/useAuthStore.js";
const BACKSERVER = "http://localhost:9999";

const getImageUrl = (thumb) => {
  console.log(thumb);
  if (!thumb) return null;
  if (typeof thumb !== "string") return null;
  let trimmed = thumb.trim();
  if (!trimmed) return null;

  trimmed = trimmed.replace(/\\/g, "/").replace(/\\/g, "/");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const driveMatch = trimmed.match(/^[A-Za-z]:\//);
  if (driveMatch) {
    const boardIndex = trimmed.indexOf("/board/editor/");
    if (boardIndex !== -1) {
      const suffix = trimmed.substring(boardIndex);
      return `${BACKSERVER}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
    }
    trimmed = trimmed.substring(trimmed.indexOf("/") + 1);
  }

  if (trimmed.startsWith("/")) return `${BACKSERVER}${trimmed}`;
  if (trimmed.includes("/upload/"))
    return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.includes("/board/editor/"))
    return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.match(/^.+\.(jpg|jpeg|png|gif|bmp)$/i))
    return `${BACKSERVER}/member/thumb/${trimmed.replace(/^\//, "")}`;
  return `${BACKSERVER}/member/thumb/${trimmed}`;
};

const MyInformation = () => {
  const { memberId, memberNickname, isReady, memberThumb } = useAuthStore();
  const [member, setMember] = useState();
  const [readyMark, setReadyMark] = useState(false);
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
    member &&
    memberId && (
      // isReady &&
      <div className={styles.myinformation_main_wrap}>
        <div className={styles.myinformation_img_outer}>
          <div className={styles.myinformation_img_wrap}>
            <img
              src={
                member.memberThumb !== null
                  ? getImageUrl(
                      memberThumb === null ? member.memberThumb : memberThumb,
                    )
                  : userImg
              }
            />
          </div>
          <div
            className={styles.dag}
            onClick={() => {
              reference.current.click();
            }}
          >
            변경
          </div>
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
            <li>
              <span className={styles.item_label}>아이디</span>
              <span className={styles.item_value}>{memberId}</span>
            </li>
            <li>
              <span className={styles.item_label}>이름</span>
              <span className={styles.item_value}>{member.memberName}</span>
            </li>
            <li>
              <span className={styles.item_label}>별명</span>
              <span className={styles.item_value}>{memberNickname}</span>
            </li>
            <li className={styles.email_row}>
              <span className={styles.item_label}>이메일</span>
              <span className={styles.item_value}>{member.memberEmail}</span>
            </li>
            <li>
              <span className={styles.item_label}>조회수</span>
              <span className={styles.item_value}>1234</span>
            </li>
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
