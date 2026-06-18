import SupportQnaDetail from "../../components/support/SupportQnaDetail";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SupportQnaDetailPage = () => {
  const [qna, setQna] = useState({});
  const { qnaNo } = useParams();

  const selectQnaDetail = () => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/supports/qna/${qnaNo}`)
      .then((res) => {
        console.log(res);
        setQna(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    selectQnaDetail();
  }, []);
  return (
    <>
      <SupportQnaDetail qna={qna} />
    </>
  );
};

export default SupportQnaDetailPage;
