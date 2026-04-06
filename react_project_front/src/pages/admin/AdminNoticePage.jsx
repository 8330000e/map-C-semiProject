import { useEffect, useState } from "react";
import styles from "./AdminNoticePage.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import AdminNotice from "../../components/admin/AdminNotice";

const AdminNoticePage = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [notice, setNotice] = useState({
    noticeTitle: "",
    noticeContent: "",
    noticePublic: 0,
    noticeFixed: 0,
  });
  const [noticeList, setNoticeList] = useState([]);
  const changeNotice = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNotice({ ...notice, [name]: value });
  };

  const insertNotice = (e) => {
    e.preventDefault();
    if (isEdit) {
      axios
        .patch(`${import.meta.env.VITE_BACKSERVER}/admins/notice`, notice)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(`${import.meta.env.VITE_BACKSERVER}/admins/notice`, notice)
        .then((res) => {
          console.log(res);
          setIsEdit(false);
          if (res.data === 1) {
            selectNoticeList();
            Swal.fire({
              title: "공지사항 등록",
              text: "공지사항을 등록하시겠습니까?",
              icon: "info",
              showCancelButton: true,
              confirmButtonText: "등록",
              cancelButtonText: "취소",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire("공지사항이 등록되었습니다.");
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
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
    />
  );
};

export default AdminNoticePage;
