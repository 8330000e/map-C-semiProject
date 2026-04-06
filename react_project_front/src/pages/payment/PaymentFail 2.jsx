// 토스 결제 실패 후 리다이렉트되는 테스트 실패 페이지입니다.
import { Link, useLocation } from "react-router-dom";
import styles from "./payment.module.css";

const PaymentFail = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const code = params.get("code");
	const message = params.get("message");

	return (
		<section className={styles.payment_wrap}>
			<h1>결제 실패(테스트)</h1>
			<div className={styles.info_box}>
				<p>code : {code || "-"}</p>
				<p>message : {message || "-"}</p>
			</div>
			<Link to="/store" className={styles.link_btn}>
				중고장터로 이동
			</Link>
		</section>
	);
};

export default PaymentFail;
