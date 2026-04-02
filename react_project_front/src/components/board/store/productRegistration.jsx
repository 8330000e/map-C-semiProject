// 중고장터 상품 등록 페이지 컴포넌트입니다.
// 제목/거래방법/상품상태/가격/설명을 입력받아 등록 화면을 구성합니다.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./productRegistration.module.css";

const ProductRegistration = () => {
	// React Router 페이지 이동 훅
	const navigate = useNavigate();

	// 상품 정보 상태 관리 (입력 폼 내용)
	const [title, setTitle] = useState(""); // 상품 제목
	const [tradeMethod, setTradeMethod] = useState(""); // 거래방법 (직거래/택배)
	const [productState, setProductState] = useState(""); // 상품 상태 (S/A/B/C/D)
	const [price, setPrice] = useState(""); // 가격 (숫자만 저장)
	const [displayPrice, setDisplayPrice] = useState(""); // 화면 표시용 가격 (콤마 포함)
	const [description, setDescription] = useState(""); // 상품 설명
	const [imageName, setImageName] = useState(""); // 업로드된 이미지 파일명
	const [region, setRegion] = useState(""); // 거래 가능 지역

	// 거래 가능 지역 목록
	const regions = [
		"서울 강남구",
		"서울 마포구",
		"서울 송파구",
		"서울 영등포구",
		"서울 성동구",
		"서울 용산구",
		"서울 서초구",
		"서울 동작구",
		"서울 은평구",
		"서울 강동구",
	];

	/**
	 * 가격 입력 처리 함수
	 * - 숫자만 추출하여 price에 저장
	 * - 한국어 천단위 구분기호(,)를 추가하여 displayPrice에 표시
	 */
	const handlePriceChange = (e) => {
		const raw = e.target.value.replace(/[^0-9]/g, "");
		setPrice(raw);
		setDisplayPrice(raw ? Number(raw).toLocaleString("ko-KR") : "");
	};

	// 상품 설명 입력 필드의 가이드 텍스트
	const descriptionPlaceholder = `- 상품명(브랜드)
- 구매 시기 (년, 월, 일)
- 사용 기간
- 하자 여부
* 실제 촬영한 사진과 함께 상세 정보를 입력해주세요.`;

	/**
	 * 이미지 업로드 처리 함수
	 * - 선택된 파일의 이름을 imageName에 저장
	 */
	const handleImageUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImageName(file.name);
	};

	/**
	 * 폼 제출 처리 함수
	 * - 상품 등록 후 중고장터 목록 페이지로 이동
	 */
	const handleSubmit = (e) => {
		e.preventDefault();
		navigate("/store");
	};

	return (
		<section className={styles.register_wrap}>
			{/* 페이지 제목 영역 */}
			<h1>중고장터</h1>

			<form className={styles.register_form} onSubmit={handleSubmit}>
				{/* 상품 제목 입력 영역 */}
				<div className={styles.title_row}>
					<input
						type="text"
						placeholder="제목"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div className={styles.content_grid}>
					{/* 좌측: 이미지 업로드 영역 */}
					<div className={styles.left_panel}>
						{/* 이미지 미리보기 박스 */}
						<div className={styles.image_box}>{imageName || "이미지"}</div>
						{/* 이미지 업로드/수정 버튼 */}
						<div className={styles.left_actions}>
							<label className={styles.action_btn}>
								업로드
								<input type="file" accept="image/*" onChange={handleImageUpload} hidden />
							</label>
							<button type="button" className={styles.action_btn} onClick={() => setImageName("")}>
								수정하기
							</button>
						</div>
					</div>

					{/* 우측: 상품 정보 입력 영역 */}
					<div className={styles.right_panel}>
						{/* 거래방법, 상품상태, 거래지역, 가격 정보 입력 */}
						<div className={styles.meta_row}>
							<div className={styles.meta_item}>
								<span className={styles.meta_label}>거래방법</span>
							<span className={styles.meta_divider}>:</span>
							{/* 거래방법 선택 (직거래/택배) */}
							<select value={tradeMethod} onChange={(e) => setTradeMethod(e.target.value)}>
									<option value="" disabled>선택</option>
									<option value="직거래">직거래</option>
									<option value="택배">택배</option>
								</select>
							</div>
							<div className={styles.meta_item}>
								<span className={styles.meta_label}>상품상태</span>
							<span className={styles.meta_divider}>:</span>
							{/* 상품 상태 선택 (S/A/B/C/D) */}
							<select value={productState} onChange={(e) => setProductState(e.target.value)}>
									<option value="" disabled>선택</option>
									<option value="S">S : 미개봉(새상품)</option>
									<option value="A">A : 사용감 거의 없음</option>
									<option value="B">B : 생활 사용감 있음</option>
									<option value="C">C : 사용감 많음</option>
									<option value="D">D : 기능 이상 없음(외관 손상)</option>
								</select>
							</div>
							<div className={styles.meta_item}>
							<span className={styles.meta_label}>거래지역</span>
							<span className={styles.meta_divider}>:</span>
							{/* 거래 가능 지역 선택 */}
							<select value={region} onChange={(e) => setRegion(e.target.value)}>
								<option value="" disabled>선택</option>
								{regions.map((r) => (
									<option key={r} value={r}>
										{r}
									</option>
								))}
							</select>
						</div>
						<div className={styles.meta_item}>
							<span className={styles.meta_label}>가격</span>
							<span className={styles.meta_divider}>:</span>
							{/* 가격 입력 (천단위 구분기호 포함) */}
							<div className={styles.price_wrapper}>
									<span className={styles.price_prefix}>₩</span>
									<input
									type="text"
									inputMode="numeric"
									placeholder="판매가격"
									value={displayPrice}
									onChange={handlePriceChange}
								/>
								{displayPrice && <span className={styles.price_suffix}>원</span>}
							</div>
							</div>
						</div>

						{/* 상품 상세 설명 입력 */}
						<textarea
							placeholder={descriptionPlaceholder}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>

				{/* 하단: 등록 및 뒤로가기 버튼 */}
				<div className={styles.bottom_actions}>
					{/* 상품 등록 버튼 */}
					<button type="submit" className={styles.primary_btn}>
						등록하기
					</button>
					{/* 이전 페이지로 돌아가기 버튼 */}
					<button type="button" className={styles.primary_btn} onClick={() => navigate(-1)}>
						뒤로가기
					</button>
				</div>
			</form>
		</section>
	);
};

export default ProductRegistration;
