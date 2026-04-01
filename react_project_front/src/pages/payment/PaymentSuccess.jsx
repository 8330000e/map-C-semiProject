// 토스 결제 성공 후 리다이렉트되는 테스트 완료 페이지입니다.
// 결제 완료 시 구매한 상품을 자동으로 "판매완료" 상태로 처리합니다.
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./payment.module.css";

const STORE_STATUS_KEY = "storeSaleStatusMap";

const updateProductStatus = (itemId) => {
	try {
		const raw = localStorage.getItem(STORE_STATUS_KEY);
		const statusMap = raw ? JSON.parse(raw) : {};
		statusMap[itemId] = "판매완료";
		localStorage.setItem(STORE_STATUS_KEY, JSON.stringify(statusMap));
		window.dispatchEvent(new Event("store-status-updated"));
	} catch (error) {
		console.error("상품 상태 업데이트 실패:", error);
	}
};

const PaymentSuccess = () => {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const paymentKey = params.get("paymentKey");
	const orderId = params.get("orderId");
	const amount = params.get("amount");
	const itemId = Number(params.get("itemId")) || null;

	useEffect(() => {
		if (itemId) {
			updateProductStatus(itemId);
		}
	}, [itemId]);

	return (
		<section className={styles.payment_wrap}>
			<h1>결제 성공(테스트)</h1>
			<div className={styles.info_box}>
				<p>주문번호 : {orderId || "-"}</p>
				<p>결제금액 : {amount ? `${Number(amount).toLocaleString("ko-KR")}원` : "-"}</p>
			</div>
			<Link to="/store" className={styles.link_btn}>
				중고장터로 이동
			</Link>
		</section>
	);
};

export default PaymentSuccess;
