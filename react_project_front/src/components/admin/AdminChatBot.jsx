import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminChatBot.module.css";
import axios from "axios";

const AdminChatBot = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text:
            "안녕하세요 Map-C 관리자 Gemini 챗봇입니다. 무엇을 도와드릴까요?\n\n" +
            "💡 공지 초안 자동 작성: 메시지를 '공지: 주제'로 시작하면 제목/본문 초안을 만들어 드립니다.\n" +
            "예) 공지: 서버 정기 점검 안내",
        },
      ],
    },
  ]);

  // 메시지 영역 맨 아래로 자동 스크롤
  const messageEndRef = useRef(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 공지 초안 생성 - "공지:" 접두사 메시지 전용
  const sendNoticeDraft = (userText, topic) => {
    const userMsg = { role: "user", parts: [{ text: userText }] };
    const newMessage = [...messages, userMsg];
    setMessages(newMessage);
    setInputValue("");
    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/admins/ai/notice-draft`, {
        topic: topic,
      })
      .then((res) => {
        const { title, content } = res.data;
        const previewText =
          "공지사항 초안이 준비되었습니다.\n\n" +
          `제목: ${title}\n\n${content}`;
        // 초안 전용 메시지 플래그 (draft:true) - 렌더링 시 이동 버튼 노출
        const botMsg = {
          role: "model",
          parts: [{ text: previewText }],
          draft: { title, content },
        };
        setMessages([...newMessage, botMsg]);
      })
      .catch((err) => {
        console.log(err);
        setMessages([
          ...newMessage,
          {
            role: "model",
            parts: [
              {
                text: "공지 초안 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
              },
            ],
          },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const sendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    // "공지:" 접두사면 공지 초안 엔드포인트로 분기
    const trimmed = inputValue.trim();
    if (trimmed.startsWith("공지:")) {
      const topic = trimmed.substring("공지:".length).trim();
      if (!topic) {
        setInputValue("");
        return;
      }
      sendNoticeDraft(trimmed, topic);
      return;
    }

    const userMsg = { role: "user", parts: [{ text: inputValue }] };
    const newMessage = [...messages, userMsg];
    setMessages(newMessage);
    setInputValue("");
    setIsLoading(true);

    axios
      .post(`${import.meta.env.VITE_BACKSERVER}/admins/chat-bot`, {
        messages: newMessage,
      })
      .then((res) => {
        setMessages([...newMessage, res.data]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // 초안 이동 - 공지 등록 페이지로 state 전달 + 챗봇 닫기
  const goNoticePageWithDraft = (draft) => {
    navigate("/admin/support/notice", { state: { draft } });
    setIsOpen(false);
  };

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
                  <div className={styles.bubble_text}>{m.parts[0].text}</div>
                  {m.draft && (
                    <button
                      type="button"
                      className={styles.draft_btn}
                      onClick={() => goNoticePageWithDraft(m.draft)}
                    >
                      공지 등록 페이지로 이동
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                className={`${styles.message_row} ${styles.message_row_bot}`}
              >
                <div className={styles.bubble_bot}>
                  <span className={styles.typing_dot}></span>
                  <span className={styles.typing_dot}></span>
                  <span className={styles.typing_dot}></span>
                </div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <div className={styles.input_area}>
            <input
              type="text"
              placeholder="메시지 입력 (공지 초안은 '공지: 주제' 형식)"
              className={styles.chat_input}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              disabled={isLoading}
            />
            <button
              className={styles.send_btn}
              onClick={sendMessage}
              disabled={isLoading}
            >
              전송
            </button>
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
