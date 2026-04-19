import { useState } from "react";
import styles from "./AdminChatBot.module.css";

const AdminChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "user", content: "오늘 신고 몇 건이야?" },
    { role: "bot", content: "총 12건, 미처리 5건입니다." },
    { role: "user", content: "미처리만 보여줘" },
  ]);

  return (
    <>
      {isOpen ? (
        <div className={styles.panel}>
          <div className={styles.panel_header}>
            <div className={styles.panel_title}>
              <span className={styles.panel_dot} />
              AI 관리자 도우미
            </div>
            <button
              className={styles.close_btn}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className={styles.message_area}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? `${styles.message_row} ${styles.message_row_user}`
                    : `${styles.message_row} ${styles.message_row_bot}`
                }
              >
                <div
                  className={
                    m.role === "user" ? styles.bubble_user : styles.bubble_bot
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.input_area}>
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              className={styles.chat_input}
            />
            <button className={styles.send_btn}>전송</button>
          </div>
        </div>
      ) : (
        <button className={styles.floating_btn} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </>
  );
};

export default AdminChatBot;
