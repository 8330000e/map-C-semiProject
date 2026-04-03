import styles from "./Button.module.css";

const Button = ({ children, className, ...props }) => {
  // const children = Props.children
  const classList = className.split(" "); //받은 클래스 네임 문자열을 " " 기준으로 잘라서 배열에 리턴
  const classStyles = classList.map((cls) => {
    return styles[cls]; //객체에서 값 꺼내기
  });
  return (
    // 꺼내서 바꿀값은 직접,대부분 동일시 props에서 꺼냄
    <button className={classStyles.join(" ")} {...props}>
      {children}
    </button>
  ); //join은 " " 기준으로 하나씩 붙여서 큰 문자열로 만듬
};
export default Button;
