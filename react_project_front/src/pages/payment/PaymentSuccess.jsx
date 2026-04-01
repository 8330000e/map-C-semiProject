// 토스 결제 성공 후 리다이렉트되는 테스트 완료 페이지입니다.
import { Link, useLocation } from "react-router-dom";
import styles from "./payment.module.css";

const PaymentSuccess = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const paymentKey = params.get("paymentKey");
	const orderId = params.get("orderId");
	const amount = params.get("amount");

	return (
		<section className={styles.payment_wrap}>
			<h1>결제 성공(테스트)</h1>
			<div className={styles.info_box}>
				<p>orderId : {orderId || "-"}</p>
				<p>amount : {amount || "-"}</p>
				<p>paymentKey : {paymentKey || "-"}</p>
			</div>
			<Link to="/store" className={styles.link_btn}>
				중고장터로 이동
			</Link>
		</section>
	);
};

export default PaymentSuccess;
