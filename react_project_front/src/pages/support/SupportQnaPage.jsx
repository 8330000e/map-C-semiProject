import { useEffect, useState } from "react";
import SupportQna from "../../components/support/SupportQna";
import useAuthStore from "../../store/useAuthStore";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const SupportQnaPage = () => {
  const location = useLocation();
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState("write");
  const [qnaList, setQnaList] = useState([]);
  const { memberId } = useAuthStore();
  const [qna, setQna] = useState({
    qnaTitle: "",
    qnaContent: "",
    qnaCategory: "회원·계정",
  });
  const changeQna = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQna({ ...qna, [name]: value });
  };
  const selectQnaList = () => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/supports/qna?memberId=${memberId}`,
      )
      .then((res) => {
        console.log(res);
        setQnaList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const insertQna = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "문의등록",
      text: "1:1 문의를 등록하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "취소",
      confirmButtonText: "등록",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("memberId", memberId);
        formData.append("qnaTitle", qna.qnaTitle);
        formData.append("qnaContent", qna.qnaContent);
        formData.append("qnaCategory", qna.qnaCategory);
        if (imageFile) {
          formData.append("upfile", imageFile);
        }
        axios
          .post(`${import.meta.env.VITE_BACKSERVER}/supports/qna`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              selectQnaList();
              Swal.fire({
                title: "문의등록",
                text: "등록되었습니다.",
                icon: "success",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            Swal.fire({
              title: "문의등록 실패",
              icon: "error",
            });
          });
      }
    });
  };

  useEffect(() => {
    selectQnaList();
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);
  return (
    <>
      <SupportQna
        setImageFile={setImageFile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        qnaList={qnaList}
        qna={qna}
        changeQna={changeQna}
        insertQna={insertQna}
      />
    </>
  );
};

export default SupportQnaPage;
