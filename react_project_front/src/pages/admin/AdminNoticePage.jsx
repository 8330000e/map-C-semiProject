// 공지사항 관리 페이지 - 등록/수정/삭제 API 처리 담당, UI는 AdminNotice.jsx에서
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AdminNotice from "../../components/admin/AdminNotice";
import { compressImageFile } from "../../utils/compressImage";

// 폼 초기값 - 등록 완료 후 초기화할 때도 이걸로 돌아옴
const emptyNotice = {
  noticeNo: 0,
  noticeTitle: "",
  noticeContent: "",
  noticePublic: 0,
  noticeFixed: 0,
  noticeCategory: "이벤트",
  hasOldImage: false,
};

const AdminNoticePage = () => {
  const [isEdit, setIsEdit] = useState(false); // true면 수정 모드, false면 등록 모드
  const [imageFile, setImageFile] = useState(null); // 새로 선택한 이미지 파일
  const [notice, setNotice] = useState({ ...emptyNotice }); // 폼 입력값
  const [noticeList, setNoticeList] = useState([]); // 공지사항 목록

  // 폼 초기화 - 등록/수정 완료 후 호출
  const resetNoticeForm = () => {
    setNotice({ ...emptyNotice });
    setImageFile(null);
    setIsEdit(false);
  };

  // 입력값 변경 시 notice 상태 업데이트
  const changeNotice = (e) => {
    const { name, value } = e.target;
    setNotice((prev) => ({ ...prev, [name]: value }));
  };

  // 공지사항 목록 조회
  const selectNoticeList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins`)
      .then((res) => {
        setNoticeList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 공지사항 삭제 - swal로 확인받고 axios 날림
  const deleteNotice = (noticeNo) => {
    Swal.fire({
      title: "공지사항 삭제",
      text: "공지사항을 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "삭제",
    }).then((result) => {
      if (!result.isConfirmed) return;

      axios
        .delete(`${import.meta.env.VITE_BACKSERVER}/admins/notice/${noticeNo}`)
        .then((res) => {
          if (res.data === 1) {
            selectNoticeList(); // 삭제 후 목록 갱신
            Swal.fire({ title: "삭제 성공", icon: "success" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // 등록/수정 통합 함수 - isEdit 상태로 분기
  const insertNotice = (e) => {
    e.preventDefault();

    if (isEdit) {
      // 수정 모드 - PATCH 요청
      Swal.fire({
        title: "공지사항 수정",
        text: "공지사항을 수정하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "수정",
        cancelButtonText: "취소",
      }).then(async (result) => {
        if (!result.isConfirmed) return;

        // 이미지 포함 가능하니까 FormData로 전송
        const formData = new FormData();
        formData.append("noticeNo", notice.noticeNo);
        formData.append("noticeTitle", notice.noticeTitle);
        formData.append("noticeContent", notice.noticeContent);
        formData.append("noticePublic", notice.noticePublic);
        formData.append("noticeFixed", notice.noticeFixed);
        formData.append("noticeCategory", notice.noticeCategory);
        // 새 이미지 선택했을 때만 용량을 줄인 파일을 추가함
        if (imageFile) {
          const compressedImage = await compressImageFile(imageFile, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.75,
          });
          formData.append("upfile", compressedImage, compressedImage.name);
        }

        axios
          .patch(`${import.meta.env.VITE_BACKSERVER}/admins/notice`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            if (res.data === 1) {
              selectNoticeList();
              resetNoticeForm();
              Swal.fire({ title: "수정 성공", icon: "success" });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
      return;
    }

    // 등록 모드 - POST 요청
    Swal.fire({
      title: "공지사항 등록",
      text: "공지사항을 등록하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "등록",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      const formData = new FormData();
      formData.append("noticeTitle", notice.noticeTitle);
      formData.append("noticeContent", notice.noticeContent);
      formData.append("noticePublic", notice.noticePublic);
      formData.append("noticeFixed", notice.noticeFixed);
      formData.append("noticeCategory", notice.noticeCategory);
      if (imageFile) {
        const compressedImage = await compressImageFile(imageFile, {
          maxWidth: 1200,
          maxHeight: 1200,
          quality: 0.75,
        });
        formData.append("upfile", compressedImage, compressedImage.name);
      }

      axios
        .post(`${import.meta.env.VITE_BACKSERVER}/admins/notice`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          if (res.data === 1) {
            selectNoticeList();
            resetNoticeForm();
            Swal.fire({ title: "공지사항이 등록되었습니다.", icon: "success" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // 첫 렌더링 시 공지사항 목록 불러옴
  useEffect(() => {
    selectNoticeList();
  }, []);

  return (
    <AdminNotice
      notice={notice}
      changeNotice={changeNotice}
      insertNotice={insertNotice}
      noticeList={noticeList}
      isEdit={isEdit}
      setIsEdit={setIsEdit}
      setNotice={setNotice}
      deleteNotice={deleteNotice}
      setImageFile={setImageFile}
      imageFile={imageFile}
    />
  );
};

export default AdminNoticePage;
