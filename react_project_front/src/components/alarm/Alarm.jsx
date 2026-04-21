import { useEffect, useState } from "react";
import styles from "./Alarm.module.css";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Alarm = () => {
  const { memberId } = useAuthStore();
  const [alarmList, setAlarmList] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/alarms/${memberId}`)
      .then((res) => {
        console.log(res);
        setAlarmList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const alarmDel = (alarmNo) => {
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/alarms/alarmdel/${memberId}?alarmNo=${alarmNo}`,
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const updatedAlarms = alarmList.filter(
            (alarm) => alarm.alarmNo !== alarmNo,
          );
          setAlarmList(updatedAlarms);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const alarmAllDel = () => {
    axios
      .patch(
        `${import.meta.env.VITE_BACKSERVER}/alarms/alarmalldel/${memberId}`,
        {},
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setAlarmList([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getRelativeTime = (dateString) => {
    const now = new Date(); // 현재 시간
    const past = new Date(dateString); // DB에서 가져온 시간
    const diffInMs = now - past; // 밀리초 단위 차이

    // 초, 분, 시간, 일 단위 계산
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds}초 전`;
    } else if (minutes < 60) {
      return `${minutes}분 전`;
    } else if (hours < 24) {
      return `${hours}시간 전`;
    } else {
      return `${days}일 전`;
    }
  };

  return (
    <div className={styles.alarm_wrap}>
      <ul className={styles.ul}>
        {alarmList && alarmList.length > 0 ? (
          alarmList.map((alarm, i) => (
            <li className={styles.alarm_content_wrap} key={`alarm_` + i}>
              <div>
                <div
                  className={alarm.alarmCheck == 1 ? styles.alarm_checked : ""}
                >
                  {alarm.alarmContent}
                </div>
                <div>
                  <CloseOutlinedIcon
                    sx={{ fontSize: "18px", cursor: "pointer" }}
                    onClick={() => {
                      alarmDel(alarm.alarmNo);
                    }}
                  />
                </div>
              </div>
              <div>{getRelativeTime(alarm.alarmTime)}</div>
            </li>
          ))
        ) : (
          <p>알람이 없습니다.</p>
        )}
      </ul>
      <div>
        <button onClick={alarmAllDel}>전체 지우기</button>
      </div>
    </div>
  );
};

export default Alarm;
