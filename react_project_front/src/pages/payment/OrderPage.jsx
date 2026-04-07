// 결제 전 주문정보(수령인/연락처/주소)를 입력받는 페이지입니다.
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./payment.module.css";

/**
 * Daum 주소검색 API 스크립트를 동적으로 로드하는 함수
 * 이미 로드된 경우 즉시 반환, 미로드 시 스크립트 태그를 생성해 body에 추가
 */
const loadDaumPostcodeScript = () => {
    // 이미 Daum Postcode API가 로드되었으면 Promise.resolve() 반환
    if (window?.daum?.Postcode) return Promise.resolve();

    return new Promise((resolve, reject) => {
        // 이미 추가된 스크립트가 있는지 확인
        const existedScript = document.querySelector('script[src*="postcode.v2.js"]');
        if (existedScript) {
            existedScript.addEventListener("load", () => resolve());
            existedScript.addEventListener("error", () => reject(new Error("주소검색 스크립트 로드 실패")));
            return;
        }

        // 스크립트 태그 생성 및 추가
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("주소검색 스크립트 로드 실패"));
        document.body.appendChild(script);
    });
};

const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // storeDetail에서 전달받은 상품 정보
    const orderName = location.state?.orderName || "테스트 상품";
    const passedAmount = Number(location.state?.amount || 0);
    const baseAmount = Number(location.state?.baseAmount || passedAmount);
    const deliveryFee = Number(location.state?.deliveryFee || 0);
    const amount = passedAmount > 0 ? passedAmount : baseAmount + deliveryFee;
    const itemId = location.state?.itemId;
    const marketNo = location.state?.marketNo || itemId;
    const deliveryMethod = location.state?.deliveryMethod || "delivery";
    const sellerId = location.state?.sellerId || null;
    const sellerNickname = location.state?.sellerNickname || sellerId;
    const tradeType = location.state?.tradeType ?? null;

    // 주문 정보 입력 필드 상태
    const [receiverName, setReceiverName] = useState(""); // 수령인 이름
    const [phone, setPhone] = useState(""); // 연락처
    const [zipCode, setZipCode] = useState(""); // 우편번호 (주소검색으로만 자동 입력)
    const [address, setAddress] = useState(""); // 기본주소 (주소검색으로만 자동 입력)
    const [addressDetail, setAddressDetail] = useState(""); // 상세주소 (사용자 입력)
    const [deliveryMemo, setDeliveryMemo] = useState(""); // 배송 메모

    /**
     * 필드별 에러 상태 관리
     * 필수 필드: receiverName, phone, zipCode, address
     */
    const [errors, setErrors] = useState({
        receiverName: false,
        phone: false,
        zipCode: false,
        address: false,
    });
    const [phoneHelperText, setPhoneHelperText] = useState("");

    /**
     * 전화번호 형식 검사 함수
     * 01012345678 or 010-1234-5678 등을 허용
     */
    const isValidPhone = (value) => {
        const cleaned = (value || "").replace(/[^0-9]/g, "");
        return /^(01[016789])(?:\d{7}|\d{8})$/.test(cleaned);
    };

    /**
     * 폼 유효성 검사 함수
     * 필수 필드가 모두 입력되었는지 확인하고 에러 상태 업데이트
     * 직거래는 주소 정보 불필요
     */
    const validateForm = () => {
        const phoneIsInvalid = !phone.trim() || !isValidPhone(phone.trim());
        const newErrors = {
            receiverName: !receiverName.trim(),
            phone: phoneIsInvalid,
            zipCode: deliveryMethod === "delivery" ? !zipCode.trim() : false,
            address: deliveryMethod === "delivery" ? !address.trim() : false,
        };
        setErrors(newErrors);
        setPhoneHelperText(
            !phone.trim()
                ? "전화번호를 입력해주세요."
                : phoneIsInvalid
                    ? "010-0000-0000 또는 01000000000 형식으로 입력해주세요."
                    : ""
        );
        // 에러가 하나도 없으면 true 반환
        return !Object.values(newErrors).some((err) => err);
    };

    /**
     * Daum 주소검색 팝업을 열어 주소를 선택하게 함
     * 선택된 주소는 자동으로 zipCode와 address에 입력됨
     */
    const handleSearchAddress = async () => {
        try {
            // Daum API 스크립트 로드
            await loadDaumPostcodeScript();

            // 주소검색 팝업 생성 및 열기
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // 팝업에서 주소 선택 시 호출되는 콜백
                    setZipCode(data.zonecode || "");
                    setAddress(data.roadAddress || data.jibunAddress || ""); // 도로명 또는 지번 주소
                    // 주소 선택 후 에러 상태 초기화
                    setErrors((prev) => ({ ...prev, zipCode: false, address: false }));
                },
            }).open();
        } catch (error) {
            // 스크립트 로드 실패 시 에러 메시지 표시
            Swal.fire({
                icon: "error",
                title: "주소검색 오류",
                text: error?.message || "주소검색을 불러오지 못했습니다.",
                confirmButtonColor: "#464d3e",
            });
        }
    };

    /**
     * 결제 페이지로 이동하기 전에 폼 검증
     * 유효하면 입력된 정보를 state로 전달하며 /payment/test 페이지로 이동
     */
    const handleGoPayment = () => {
        // 폼 유효성 검사 (에러 표시)
        if (!validateForm()) {
            return;
        }

        // 검증 통과 시 결제 페이지로 이동
        navigate("/payment/test", {
            state: {
                itemId,
                marketNo,
                orderName,
                amount,
                sellerId,
                sellerNickname,
                tradeType,
                // 입력된 주문 정보를 정리하여 전달
                orderInfo: {
                    receiverName: receiverName.trim(),
                    phone: phone.trim(),
                    zipCode: zipCode.trim(),
                    address: address.trim(),
                    addressDetail: addressDetail.trim(),
                    deliveryMemo: deliveryMemo.trim(),
                },
            },
        });
    };

    return (
        <section className={styles.payment_wrap}>
            <h1>주문 페이지</h1>

            {/* 상품 정보 표시 영역 */}
            <div className={styles.info_box}>
                <p>상품명 : {orderName}</p>
                <p>상품가격 : {baseAmount.toLocaleString("ko-KR")}원</p>
                {deliveryFee > 0 && <p>배송비 : {deliveryFee.toLocaleString("ko-KR")}원</p>}
                <p style={{ fontWeight: 700, borderTop: "1px solid #bcc6b2", paddingTop: "8px", marginTop: "8px" }}>
                    결제금액 : {amount.toLocaleString("ko-KR")}원
                </p>
            </div>

            {/* 주문 정보 입력 폼 */}
            <div className={styles.order_form}>
                {/* 수령인 필드 - 필수 입력 */}
                <label>
                    수령인 <span className={styles.required}>*</span>
                    <input
                        value={receiverName}
                        onChange={(e) => {
                            setReceiverName(e.target.value);
                            // 입력 중 에러 상태 자동 해제
                            if (e.target.value.trim()) {
                                setErrors((prev) => ({ ...prev, receiverName: false }));
                            }
                        }}
                        className={errors.receiverName ? styles.input_error : ""}
                    />
                    {/* 필수 입력 오류 표시 */}
                    {errors.receiverName && <span className={styles.error_text}>수령인을 입력해주세요</span>}
                </label>

                {/* 연락처 필드 - 필수 입력 */}
                <label>
                    연락처 <span className={styles.required}>*</span>
                    <input
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value;
                            setPhone(value);
                            const isInvalid = value.trim() && !isValidPhone(value);
                            setErrors((prev) => ({ ...prev, phone: isInvalid }));
                            setPhoneHelperText(
                                isInvalid ? "010-0000-0000 또는 01000000000 형식으로 입력해주세요." : ""
                            );
                        }}
                        placeholder="010-0000-0000"
                        className={errors.phone ? styles.input_error : ""}
                    />
                    {/* 필수 입력 및 형식 오류 표시 */}
                    {errors.phone && (
                        <span className={styles.error_text}>{phoneHelperText || "유효한 연락처를 입력해주세요 (예: 010-1234-5678)"}</span>
                    )}
                </label>

                {/* 배송 방법이 택배인 경우만 주소 정보 표시 */}
                {deliveryMethod === "delivery" && (
                    <>
                        {/* 우편번호 및 주소검색 버튼 */}
                        <div className={styles.address_search_row}>
                            <label>
                                우편번호 <span className={styles.required}>*</span>
                                <input
                                    value={zipCode}
                                    readOnly
                                    placeholder="주소검색으로 자동 입력"
                                    className={errors.zipCode ? styles.input_error : ""}
                                />
                                {/* 주소검색 미실행 오류 표시 */}
                                {errors.zipCode && <span className={styles.error_text}>주소검색을 해주세요</span>}
                            </label>
                            {/* 주소검색 팝업을 띄우는 버튼 */}
                            <button type="button" className={styles.search_addr_btn} onClick={handleSearchAddress}>
                                주소검색
                            </button>
                        </div>

                        {/* 기본주소 필드 - 필수 입력 (주소검색으로만 자동 입력) */}
                        <label>
                            기본주소 <span className={styles.required}>*</span>
                            <input
                                value={address}
                                readOnly
                                placeholder="주소검색으로 자동 입력"
                                className={errors.address ? styles.input_error : ""}
                            />
                            {/* 주소검색 미실행 오류 표시 */}
                            {errors.address && <span className={styles.error_text}>주소검색을 해주세요</span>}
                        </label>

                        {/* 상세주소 필드 - 선택 입력 (사용자가 직접 입력) */}
                        <label>
                            상세주소
                            <input
                                value={addressDetail}
                                onChange={(e) => setAddressDetail(e.target.value)}
                                placeholder="상세주소만 입력"
                            />
                        </label>

                        {/* 배송메모 필드 - 선택 입력 */}
                        <label>
                            배송메모
                            <input value={deliveryMemo} onChange={(e) => setDeliveryMemo(e.target.value)} />
                        </label>
                    </>
                )}

                {/* 직거래의 경우 주의 메시지 */}
                {deliveryMethod === "direct" && (
                    <div className={styles.info_message}>
                        📍 직거래 상품입니다. 판매자와 거래 시간 및 장소를 사전협의후 진행바랍니다.
                    </div>
                )}
            </div>

            {/* 액션 버튼 영역 */}
            <div className={styles.button_row}>
                {/* 결제 페이지로 이동 (폼 검증 후 이동) */}
                <button type="button" onClick={handleGoPayment} className={styles.pay_btn}>
                    결제 페이지로 이동
                </button>
                {/* 이전 페이지로 돌아가기 */}
                <button type="button" onClick={() => navigate(-1)} className={styles.back_btn}>
                    뒤로가기
                </button>
            </div>
        </section>
    );
};

export default OrderPage;