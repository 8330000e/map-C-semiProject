import { useEffect, useState } from "react";
import styles from "./Alarm.module.css";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";

const Alarm = () => {
  const {memberId} = useAuthStore();
  const [alarmList, setAlarmList] = useState([]);
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKSERVER}/alarms/${memberId}`)
    .then((res)=>{console.log(res);
      setAlarmList(res.data);
    })
    .catch((err)=>{console.log(err);});
  },[]);

  return (
    <div className={styles.alarm_wrap}>
      <div>{alarmList.map((alarm)=>{
        return 
      })}</div>
    </div>
  );
};

export default Alarm;
