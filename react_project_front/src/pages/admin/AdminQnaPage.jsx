import { useEffect, useState } from "react";
import AdminQna from "../../components/admin/AdminQna";
import axios from "axios";
import Swal from "sweetalert2";

const AdminQnaPage = () => {
  const [qnaList, setQnaList] = useState([]);

  const [isOpen, setIsOpen] = useState(false); // 모달 조건부
  const [selectedQna, setSelectedQna] = useState(null); // 모달에서 보여줄 문의

  const [answer, setAnswer] = useState("");

  const [imageFile, setImageFile] = useState(null);

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
        if (imageFile) {
          formData.append("qnaImage", imageFile);
        }
        axios
          .patch(`${import.meta.env.VITE_BACKSERVER}/admins/qna`, formData)
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              Swal.fire({
                title: "답변 등록성공",
                icon: "success",
              }).then(() => {
                setIsOpen(false);
                selectQnaList();
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const selectQnaList = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admins/qna`)
      .then((res) => {
        console.log(res);
        setQnaList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    selectQnaList();
  }, []);
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
    />
  );
};

export default AdminQnaPage;
