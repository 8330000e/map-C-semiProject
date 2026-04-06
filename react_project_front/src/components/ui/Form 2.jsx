import styles from "./Form.module.css";

const Input = (props) => {
  return <input className={styles.input} {...props}></input>;
};
const TextArea = (props) => {
  return <textarea className={styles.textarea} {...props}></textarea>;
};
export { Input, TextArea };
