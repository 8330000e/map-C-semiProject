// FAQ 관리 페이지 - FAQ 등록/수정/삭제 API 처리, UI는 AdminFaq.jsx에서
import { useEffect, useState } from "react";
import AdminFaq from "../../components/admin/AdminFaq";
import axios from "axios";
import Swal from "sweetalert2";

const AdminFaqPage = () => {
  const [isEdit, setIsEdit] = useState(false); // true면 수정 모드
  const [faq, setFaq] = useState({
    faqNo: null,
    faqTitle: "",
    faqContent: "",
    faqCategory: "회원·계정", // 기본 카테고리
  });

  // 입력값 변경 시 faq 상태 업데이트
  const changeFaq = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFaq({ ...faq, [name]: value });
  };

  const [faqList, setFaqList] = useState([]);

  // FAQ 삭제 - swal 확인 후 axios 삭제 요청
  const deleteFaq = (faqNo) => {
    Swal.fire({
      title: "FAQ 삭제",
      text: "삭제하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "삭제",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${import.meta.env.VITE_BACKSERVER}/admins/faq/${faqNo}`)
          .then((res) => {
            if (res.data === 1) {
              selectFaqList(); // 삭제 후 목록 갱신
              Swal.fire({
                title: "삭제 완료",
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

  // 등록/수정 통합 함수 - isEdit 상태로 분기
  const insertFaq = (e) => {
    e.preventDefault();
    if (isEdit) {
      // 수정 모드 - PATCH 요청
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
      // 등록 모드 - POST 요청
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

  // FAQ 목록 조회
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

  // 첫 렌더링 시 목록 불러옴
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
      deleteFaq={deleteFaq}
    />
  );
};

export default AdminFaqPage;
