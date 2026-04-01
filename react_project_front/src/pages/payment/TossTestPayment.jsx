// 토스 테스트 결제를 시작하는 페이지입니다.
// storeDetail에서 전달한 상품명/금액으로 결제창을 띄웁니다.
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./payment.module.css";

const TOSS_TEST_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

const loadTossScript = () => {
	if (window.TossPayments) return Promise.resolve();

	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://js.tosspayments.com/v2/standard";
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("토스 SDK 로드 실패"));
		document.body.appendChild(script);
	});
};

const TossTestPayment = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [widgets, setWidgets] = useState(null);
	const [widgetReady, setWidgetReady] = useState(false);

	const orderName = location.state?.orderName || "테스트 상품";
	const amount = Number(location.state?.amount || 0);

	useEffect(() => {
		let isCancelled = false;

		const initWidgets = async () => {
			if (!TOSS_TEST_CLIENT_KEY || amount <= 0) return;

			try {
				await loadTossScript();
				const tossPayments = window.TossPayments(TOSS_TEST_CLIENT_KEY);
				const widgetInstance = tossPayments.widgets({
					customerKey: `guest-${location.state?.itemId || Date.now()}`,
				});

				await widgetInstance.setAmount({
					currency: "KRW",
					value: amount,
				});

				const methodElement = document.getElementById("payment-method");
				const agreementElement = document.getElementById("agreement");
				if (!methodElement || !agreementElement) return;

				methodElement.innerHTML = "";
				agreementElement.innerHTML = "";

				await widgetInstance.renderPaymentMethods({
					selector: "#payment-method",
					variantKey: "DEFAULT",
				});

				await widgetInstance.renderAgreement({
					selector: "#agreement",
					variantKey: "AGREEMENT",
				});

				if (!isCancelled) {
					setWidgets(widgetInstance);
					setWidgetReady(true);
				}
			} catch (error) {
				if (isCancelled) return;
				Swal.fire({
					icon: "error",
					title: "위젯 초기화 실패",
					text: error?.message || "결제 위젯을 불러오지 못했습니다.",
					confirmButtonColor: "#464d3e",
				});
			}
		};

		initWidgets();

		return () => {
			isCancelled = true;
		};
	}, [amount, location.state?.itemId]);

	const handleRequestPayment = async () => {
		if (!TOSS_TEST_CLIENT_KEY) {
			Swal.fire({
				icon: "warning",
				title: "테스트 키 필요",
				text: "VITE_TOSS_CLIENT_KEY를 .env에 추가해주세요.",
				confirmButtonColor: "#464d3e",
			});
			return;
		}

		if (amount <= 0) {
			Swal.fire({
				icon: "error",
				title: "금액 오류",
				text: "결제 금액이 올바르지 않습니다.",
				confirmButtonColor: "#464d3e",
			});
			return;
		}

		if (!widgets || !widgetReady) {
			Swal.fire({
				icon: "warning",
				title: "결제 위젯 준비 중",
				text: "잠시 후 다시 시도해주세요.",
				confirmButtonColor: "#464d3e",
			});
			return;
		}

		try {
			await widgets.requestPayment({
				orderId: `ORDER-${Date.now()}`,
				orderName,
				customerName: "테스트구매자",
				successUrl: `${window.location.origin}/payment/success`,
				failUrl: `${window.location.origin}/payment/fail`,
			});
		} catch (error) {
			const errorMessage = error?.message || "토스 결제창을 여는 중 문제가 발생했습니다.";
			Swal.fire({
				icon: "error",
				title: "결제창 실행 실패",
				text: errorMessage,
				confirmButtonColor: "#464d3e",
			});
		}
	};

	return (
		<section className={styles.payment_wrap}>
			<h1>테스트 결제 페이지</h1>
			<div className={styles.info_box}>
				<p>상품명 : {orderName}</p>
				<p>결제금액 : {amount.toLocaleString("ko-KR")}원</p>
			</div>
			<div className={styles.widget_box}>
				<div id="payment-method" className={styles.widget_container} />
				<div id="agreement" className={styles.widget_container} />
			</div>
			<div className={styles.button_row}>
				<button type="button" onClick={handleRequestPayment} className={styles.pay_btn}>
					결제하기
				</button>
				<button type="button" onClick={() => navigate(-1)} className={styles.back_btn}>
					뒤로가기
				</button>
			</div>
		</section>
	);
};

export default TossTestPayment;
