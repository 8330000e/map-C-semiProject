import { useEffect, useState } from "react";
import styles from "./AdminNoticePage.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import AdminNotice from "../../components/admin/AdminNotice";

const AdminNoticePage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [notice, setNotice] = useState({
    noticeNo: 0,
    noticeTitle: "",
    noticeContent: "",
    noticePublic: 0,
    noticeFixed: 0,
    noticeCategory: "이벤트",
  });
  const [noticeList, setNoticeList] = useState([]);
  const changeNotice = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNotice({ ...notice, [name]: value });
  };

  const deleteNotice = (noticeNo) => {
    Swal.fire({
      title: "공지사항 삭제",
      text: "공지사항을 삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "삭제",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `${import.meta.env.VITE_BACKSERVER}/admins/notice/${noticeNo}`,
          )
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              selectNoticeList();
              Swal.fire({
                title: "삭제성공",
                icon: "success",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const insertNotice = (e) => {
    e.preventDefault();
    if (isEdit) {
      Swal.fire({
        title: "공지사항 수정",
        text: "공지사항을 수정하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "수정",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append("noticeNo", notice.noticeNo);
          formData.append("noticeTitle", notice.noticeTitle);
          formData.append("noticeContent", notice.noticeContent);
          formData.append("noticePublic", notice.noticePublic);
          formData.append("noticeFixed", notice.noticeFixed);
          formData.append("noticeCategory", notice.noticeCategory);
          if (imageFile) {
            formData.append("upfile", imageFile);
          }
          axios
            .patch(
              `${import.meta.env.VITE_BACKSERVER}/admins/notice`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              },
            )
            .then((res) => {
              console.log(res);
              if (res.data === 1) {
                selectNoticeList();
                Swal.fire({
                  title: "수정 성공",
                  icon: "success",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    } else {
      Swal.fire({
        title: "공지사항 등록",
        text: "공지사항을 등록하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "등록",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          formData.append("noticeTitle", notice.noticeTitle);
          formData.append("noticeContent", notice.noticeContent);
          formData.append("noticePublic", notice.noticePublic);
          formData.append("noticeFixed", notice.noticeFixed);
          formData.append("noticeCategory", notice.noticeCategory);
          if (imageFile) {
            formData.append("upfile", imageFile);
          }
          axios
            .post(
              `${import.meta.env.VITE_BACKSERVER}/admins/notice`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              },
            )
            .then((res) => {
              console.log(res);

              setIsEdit(false);
              if (res.data === 1) {
                selectNoticeList();
                setImageFile(null);
                Swal.fire("공지사항이 등록되었습니다.");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  const selectNoticeList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins`)
      .then((res) => {
        console.log(res);
        setNoticeList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
    />
  );
};

export default AdminNoticePage;
