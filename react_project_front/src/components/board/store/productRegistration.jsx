// 중고장터 상품 등록 페이지 컴포넌트입니다.
// 제목/거래방법/상품상태/가격/설명을 입력받아 등록 화면을 구성합니다.
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./productRegistration.module.css";

const ProductRegistration = () => {
	const navigate = useNavigate();

	const [title, setTitle] = useState("");
	const [tradeMethod, setTradeMethod] = useState("");
	const [productState, setProductState] = useState("");
	const [price, setPrice] = useState("");
	const [displayPrice, setDisplayPrice] = useState("");
	const [description, setDescription] = useState("");
	const [imageName, setImageName] = useState("");

	const handlePriceChange = (e) => {
		const raw = e.target.value.replace(/[^0-9]/g, "");
		setPrice(raw);
		setDisplayPrice(raw ? Number(raw).toLocaleString("ko-KR") : "");
	};

	const descriptionPlaceholder = `- 상품명(브랜드)
- 구매 시기 (년, 월, 일)
- 사용 기간
- 하자 여부
* 실제 촬영한 사진과 함께 상세 정보를 입력해주세요.`;

	const handleImageUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImageName(file.name);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		navigate("/store");
	};

	return (
		<section className={styles.register_wrap}>
			<h1>중고장터</h1>

			<form className={styles.register_form} onSubmit={handleSubmit}>
				<div className={styles.title_row}>
					<input
						type="text"
						placeholder="제목"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>

				<div className={styles.content_grid}>
					<div className={styles.left_panel}>
						<div className={styles.image_box}>{imageName || "이미지"}</div>
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

					<div className={styles.right_panel}>
						<div className={styles.meta_row}>
							<div className={styles.meta_item}>
								<span className={styles.meta_label}>거래방법</span>
								<span className={styles.meta_divider}>:</span>
								<select value={tradeMethod} onChange={(e) => setTradeMethod(e.target.value)}>
									<option value="" disabled>선택</option>
									<option value="직거래">직거래</option>
									<option value="택배">택배</option>
								</select>
							</div>
							<div className={styles.meta_item}>
								<span className={styles.meta_label}>상품상태</span>
								<span className={styles.meta_divider}>:</span>
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
								<span className={styles.meta_label}>가격</span>
								<span className={styles.meta_divider}>:</span>
								<div className={styles.price_wrapper}>
									<span className={styles.price_prefix}>₩</span>
									<input
									type="text"
									inputMode="numeric"
									placeholder="판매가격"
									value={displayPrice}
									onChange={handlePriceChange}
									/>								{displayPrice && <span className={styles.price_suffix}>원</span>}								</div>
							</div>
						</div>

						<textarea
							placeholder={descriptionPlaceholder}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>

				<div className={styles.bottom_actions}>
					<button type="submit" className={styles.primary_btn}>
						등록하기
					</button>
					<button type="button" className={styles.primary_btn} onClick={() => navigate(-1)}>
						뒤로가기
					</button>
				</div>
			</form>
		</section>
	);
};

export default ProductRegistration;
