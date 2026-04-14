import { useEffect, useRef, useState } from "react";
import styles from "./MyInformation.module.css";
import axios from "axios";

import userImg from "../../assets/admin.png";
import useAuthStore from "../../store/useAuthStore.js";
import { normalizeImageUrl } from "../../utils/getImageUrl";
import { compressImageFile } from "../../utils/compressImage";
const BACKSERVER = "http://localhost:9999";

// 서버에 저장된 썸네일 경로를 실제 이미지 URL로 변환합니다.
// - 절대 URL이면 그대로 사용하고
// - 상대 경로 혹은 윈도우 드라이브 경로 등도 백엔드 서버 기준 URL로 변경합니다.
const getImageUrl = (thumb) => normalizeImageUrl(thumb, "member/thumb");

const MyInformation = () => {
  // MyPage 왼쪽 카드의 사용자 정보 섹션입니다.
  // - 로그인된 사용자의 회원 정보를 불러오고,
  // - 프로필 사진 변경 기능을 제공합니다.
  // - 사용자 아이디, 이름, 별명, 이메일을 보여줍니다.
  const { memberId, memberNickname, isReady, memberThumb, setThumb } = useAuthStore();

  // member 정보 상태
  const [member, setMember] = useState();
  const [readyMark, setReadyMark] = useState(false);

  // 숨겨진 파일 입력을 제어하기 위한 ref
  const reference = useRef(null);

  // 컴포넌트가 처음 렌더링될 때 회원 정보를 서버에서 가져옵니다.
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/members/${memberId}`)
      .then((res) => {
        console.log(res.data);
        setMember(res.data);
        if (res.data?.memberThumb && res.data.memberThumb !== memberThumb) {
          setThumb(res.data.memberThumb);
        }
      })
      .catch((err) => {
        console.log(memberId);
        console.log(err);
      });
  }, [memberId, memberThumb, setThumb]);

  // 프로필 사진 변경 버튼으로 선택한 파일을 서버에 업로드함.
  // - 파일이 없으면 아무 동작도 하지 않음.
  // - 업로드 후 상태관리(useAuthStore)에 저장된 썸네일을 갱신함.
  const changeThumb = async () => {
    const thumbFile = reference.current.files && reference.current.files[0]; //1번째 조건 불충족시 undefined,충족하면 그중에 [0], 즉 첫번째 파일
    if (!thumbFile) {
      return;
    }
    // 프로필 이미지는 업로드 전에 크기를 줄여서 서버 전송량을 줄임
    const compressedThumbFile = await compressImageFile(thumbFile, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 0.75,
    });
    const data = new FormData();
    data.append("file", compressedThumbFile, compressedThumbFile.name);
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
        {/* 프로필 이미지, 변경 버튼, 숨겨진 파일 입력 */}
        <div className={styles.myinformation_img_outer}>
          <div className={styles.myinformation_img_wrap}>
            <img
              loading="lazy"
              decoding="async"
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

        {/* 사용자 정보 텍스트 목록 */}
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
