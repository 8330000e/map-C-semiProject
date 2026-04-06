import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../../store/useAuthStore";
import styles from "./productRegistration.module.css";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const ProductRegistration = () => {
    const navigate = useNavigate();
    const { memberId, memberNickname } = useAuthStore();

    const [title, setTitle] = useState("");
    const [tradeMethod, setTradeMethod] = useState("");
    const [productState, setProductState] = useState("");
    const [price, setPrice] = useState("");
    const [displayPrice, setDisplayPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageName, setImageName] = useState("");
    const [regionLabel, setRegionLabel] = useState("");
    const [region, setRegion] = useState("");
    const [regions, setRegions] = useState([]);
    const [showRegionList, setShowRegionList] = useState(false);

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

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                const response = await axios.get(`${BACKSERVER}/api/regions`);
                setRegions(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("지역 목록 조회 실패", error);
                setRegions([]);
            }
        };

        fetchRegions();
    }, []);

    const regionOptions = useMemo(
        () =>
            regions.map((regionOption) => ({
                label: `${regionOption.ctpvNm || ""} ${regionOption.sggNm || ""}`.trim(),
                id: regionOption.ctpvsggId,
            })),
        [regions],
    );

    const regionMap = useMemo(
        () => new Map(regionOptions.map((item) => [item.label, item.id])),
        [regionOptions],
    );

    const filteredRegions = useMemo(() => {
        const query = regionLabel.trim().toLowerCase();
        if (!query) return regionOptions;
        return regionOptions.filter((regionOption) => regionOption.label.toLowerCase().includes(query));
    }, [regionLabel, regionOptions]);

    const handleRegionBlur = () => {
        setTimeout(() => setShowRegionList(false), 150);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!memberId) {
            alert("로그인 후 판매글을 등록할 수 있습니다.");
            navigate("/members/login");
            return;
        }

        if (!title || !tradeMethod || !productState || !price || !region) {
            alert("필수 항목(제목, 거래방법, 상품상태, 가격, 거래지역)을 모두 입력해주세요.");
            return;
        }

        let tradeType;
        if (tradeMethod === "직거래/택배") tradeType = 0;
        else if (tradeMethod === "직거래") tradeType = 1;
        else if (tradeMethod === "택배") tradeType = 2;
        else {
            alert("거래방법을 정확히 선택해주세요.");
            return;
        }

        const payload = {
            marketTitle: title,
            marketContent: description,
            ctpvsggId: region,
            productPrice: Number(price),
            productStatus: productState,
            productThumb: imageName || "",
            tradeType: tradeType,
            memberId,
            memberNickname,
        };

        try {
            await axios.post(`${BACKSERVER}/api/store/boards`, payload);
            alert("등록이 완료되었습니다.");
            navigate("/store");
        } catch (error) {
            console.error("상품 등록 실패", error);
            const serverMessage = error?.response?.data || error?.message || "상품 등록 중 오류가 발생했습니다.";
            alert(`상품 등록 중 오류가 발생했습니다.\n${serverMessage}`);
        }
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
                                    <option value="" disabled>
                                        선택
                                    </option>
                                    <option value="직거래/택배">직거래/택배</option>
                                    <option value="직거래">직거래</option>
                                    <option value="택배">택배</option>
                                </select>
                            </div>

                            <div className={styles.meta_item}>
                                <span className={styles.meta_label}>상품상태</span>
                                <span className={styles.meta_divider}>:</span>
                                <select value={productState} onChange={(e) => setProductState(e.target.value)}>
                                    <option value="" disabled>
                                        선택
                                    </option>
                                    <option value="S">S : 미개봉(새상품)</option>
                                    <option value="A">A : 사용감 거의 없음</option>
                                    <option value="B">B : 생활 사용감 있음</option>
                                    <option value="C">C : 사용감 많음</option>
                                    <option value="D">D : 기능 이상 없음(외관 손상)</option>
                                </select>
                            </div>

                            <div className={`${styles.meta_item} ${styles.region_meta_item}`}>
                                <span className={styles.meta_label}>거래지역</span>
                                <span className={styles.meta_divider}>:</span>
                                <div className={styles.region_select_box}>
                                    <input
                                        type="text"
                                        placeholder="시/군 검색"
                                        value={regionLabel}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setRegionLabel(value);
                                            setRegion(regionMap.get(value) || "");
                                            setShowRegionList(true);
                                        }}
                                        onFocus={() => setShowRegionList(true)}
                                        onBlur={handleRegionBlur}
                                        className={styles.region_search}
                                    />
                                    {showRegionList && (
                                        <ul className={styles.region_option_list}>
                                            {filteredRegions.length > 0 ? (
                                                filteredRegions.slice(0, 8).map((regionOption) => (
                                                    <li
                                                        key={regionOption.id}
                                                        className={styles.region_option_item}
                                                        onMouseDown={() => {
                                                            setRegionLabel(regionOption.label);
                                                            setRegion(regionOption.id);
                                                            setShowRegionList(false);
                                                        }}
                                                    >
                                                        {regionOption.label}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className={styles.noRegions}>검색 결과가 없습니다.</li>
                                            )}
                                        </ul>
                                    )}
                                </div>
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
                                    />
                                    {displayPrice && <span className={styles.price_suffix}>원</span>}
                                </div>
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