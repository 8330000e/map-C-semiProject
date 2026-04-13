// 1:1 문의 관리 페이지 - 문의 목록 조회 + 관리자 답변 처리
import { useEffect, useState } from "react";
import AdminQna from "../../components/admin/AdminQna";
import axios from "axios";
import Swal from "sweetalert2";

const AdminQnaPage = () => {
  const [qnaList, setQnaList] = useState([]);

  const [isOpen, setIsOpen] = useState(false); // 답변 모달 열림 여부
  const [selectedQna, setSelectedQna] = useState(null); // 모달에서 보여줄 문의 항목

  const [answer, setAnswer] = useState(""); // 답변 입력값
  const [imageFile, setImageFile] = useState(null); // 답변에 첨부할 이미지

  // 페이지네이션
  const [page, setPage] = useState(0);
  const size = 10; // 한 페이지당 10개 고정
  const [totalPage, setTotalPage] = useState(null);

  const [previewImage, setPreviewImage] = useState(null); // 이미지 클릭 시 크게보기용

  // 답변 등록 - swal 확인 후 FormData로 PATCH 요청
  const qnaAnswer = () => {
    Swal.fire({
      title: "1:1 문의 답변 등록",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "등록",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("qnaNo", selectedQna.qnaNo);
        formData.append("qnaAnswer", answer);
        // 이미지 첨부했을 때만 파일 추가
        if (imageFile) {
          formData.append("upfile", imageFile);
        }
        axios
          .patch(`${import.meta.env.VITE_BACKSERVER}/admins/qna`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              Swal.fire({
                title: "답변 등록성공",
                icon: "success",
              }).then(() => {
                setIsOpen(false);
                selectQnaList(); // 답변 완료 후 목록 갱신
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: "err",
              icon: "error",
            });
          });
      }
    });
  };

  // 문의 목록 조회 - 페이지/사이즈 파라미터로 페이지네이션
  const selectQnaList = () => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/admins/qna?page=${page}&size=${size}`,
      )
      .then((res) => {
        console.log(res);
        setQnaList(res.data.items);
        setTotalPage(res.data.totalPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 페이지 바뀔 때마다 목록 다시 불러옴
  useEffect(() => {
    selectQnaList();
  }, [page]);

  return (
    <AdminQna
      qnaList={qnaList}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      selectedQna={selectedQna}
      setSelectedQna={setSelectedQna}
      answer={answer}
      setAnswer={setAnswer}
      qnaAnswer={qnaAnswer}
      setImageFile={setImageFile}
      page={page}
      setPage={setPage}
      totalPage={totalPage}
      imageFile={imageFile}
      setPreviewImage={setPreviewImage}
      previewImage={previewImage}
    />
  );
};

export default AdminQnaPage;
