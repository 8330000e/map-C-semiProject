import { useEffect, useState } from "react";
import AdminFaq from "../../components/admin/AdminFaq";
import styles from "./AdminFaqPage.module.css";
import axios from "axios";

const AdminFaqPage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const changeFaq = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFaq({ ...faq, [name]: value });
  };
  const [faq, setFaq] = useState({
    faqTitle: "",
    faqContent: "",
    faqCategory: "",
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/faq`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return <AdminFaq faq={faq} changeFaq={changeFaq} isEdit={isEdit} />;
};

export default AdminFaqPage;
