import axios from "axios";
import Button from "../ui/Button";
import styles from "./CampaignSettings.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
const CampaignSuccession = () => {
  const { campaignNo } = useParams();
  const navigate = useNavigate();
  return (
    <div className={styles.camp_settings_content_wrap}>
      <div className={styles.camp_settings_content_title}>
        <h2>권한승계</h2>
      </div>
      <div className={styles.camp_settings_content_main_wrap}>
        <div className={styles.camp_settings_content_inherit}>
          <h2>정말로 권한을 관리자에게 넘기시겠습니까?</h2>
          <p>
            관리자에게 권한을 위임하실 경우 다시 복구하는 것은 불가능합니다.
          </p>
        </div>
        <div className={styles.camp_settings_content_btn_wrap}>
          <Button
            className="btn primary lg"
            onClick={() => {
              Swal.fire({
                title: "정말로 권한을 포기하시겠습니까?",
                icon: "warning",
              }).then((result) => {
                if (result.isConfirmed) {
                  axios
                    .patch(
                      `${import.meta.env.VITE_BACKSERVER}/campaigns/${campaignNo}/inherit`,
                    )
                    .then((res) => {
                      console.log(res.data);
                      if (res.data === 1) {
                        Swal.fire({
                          title: "권한이 관리자에게로 갔습니다.",
                          text: "권한 포기 성공",
                          icon: "success",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            navigate("/campaign/main");
                          }
                        });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              });
            }}
          >
            권한승계
          </Button>
        </div>
      </div>
    </div>
  );
};
export default CampaignSuccession;
