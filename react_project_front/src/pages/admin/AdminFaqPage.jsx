import { useEffect, useState } from "react";
import AdminFaq from "../../components/admin/AdminFaq";
import styles from "./AdminFaqPage.module.css";
import axios from "axios";
import Swal from "sweetalert2";

const AdminFaqPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [faq, setFaq] = useState({
    faqNo: null,
    faqTitle: "",
    faqContent: "",
    faqCategory: 0,
  });
  const changeFaq = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFaq({ ...faq, [name]: value });
  };

  const [faqList, setFaqList] = useState([]);

  const insertFaq = (e) => {
    e.preventDefault();
    if (isEdit) {
      Swal.fire({
        title: "FAQ 수정",
        text: "수정하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "수정",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .patch(`${import.meta.env.VITE_BACKSERVER}/admins/faq`, faq)
            .then((res) => {
              console.log(res);
              if (res.data === 1) {
                selectFaqList();
                Swal.fire({
                  title: "수정완료",
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
        title: "FAQ 등록",
        text: "등록하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "취소",
        confirmButtonText: "등록",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`${import.meta.env.VITE_BACKSERVER}/admins/faq`, faq)
            .then((res) => {
              console.log(res);
              if (res.data === 1) {
                selectFaqList();
                Swal.fire({
                  title: "등록되었습니다.",
                  icon: "success",
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }
  };

  const selectFaqList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/faq`)
      .then((res) => {
        console.log(res);
        setFaqList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    selectFaqList();
  }, []);

  return (
    <AdminFaq
      faq={faq}
      changeFaq={changeFaq}
      isEdit={isEdit}
      insertFaq={insertFaq}
      faqList={faqList}
      setIsEdit={setIsEdit}
      setFaq={setFaq}
    />
  );
};

export default AdminFaqPage;
