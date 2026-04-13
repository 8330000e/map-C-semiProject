import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const MyPoint = () => {
  const { memberId } = useAuthStore();
  const [point, setPoint] = useState(0);

  useEffect(() => {
    if (!memberId) return;

    axios
      .get(`${BACKSERVER}/point-give/${memberId}`)
      .then((res) => {
        console.log("포인트 응답:", res.data);
        setPoint(res.data);
      })
      .catch((err) => {
        console.error("포인트 조회 실패", err);
      });
  }, [memberId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>보유 포인트</h2>
      <p style={{ fontSize: "24px", fontWeight: "bold" }}>{point} P</p>
    </div>
  );
};

export default MyPoint;
