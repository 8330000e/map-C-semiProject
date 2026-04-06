import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../../store/useAuthStore";
import styles from "./productRegistration.module.css";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
const isSoldOutStatus = (productStatus) => productStatus === 2 || productStatus === "2" || productStatus === "판매완료";

const ProductRegistration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { memberId, memberNickname } = useAuthStore();

    const editItem = location.state?.editItem || null;
    const isEditMode = Boolean(editItem);
    const isSoldOutEditItem = isSoldOutStatus(editItem?.productStatus);

    const [title, setTitle] = useState("");
    const [tradeMethod, setTradeMethod] = useState("");
    const [productState, setProductState] = useState("");
    const [price, setPrice] = useState("");
    const [displayPrice, setDisplayPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageName, setImageName] = useState("");
    const [region, setRegion] = useState("");
    const [regions, setRegions] = useState([]);
    const [regionLoading, setRegionLoading] = useState(true);

    // 수정 모드일 때 기존 데이터 채우기
    useEffect(() => {
        if (!editItem) return;
        if (isSoldOutStatus(editItem.productStatus)) {
            alert("판매완료된 게시물은 수정할 수 없습니다.");
            navigate(`/store/${editItem.marketNo}`, { replace: true });
            return;
        }
        setTitle(editItem.marketTitle || "");
        setTradeMethod(editItem.tradeType || "");
        setRegion(editItem.ctpvsggId || "");
        setImageName(editItem.productThumb || "");
        const raw = Number(editItem.productPrice || 0);
        setPrice(String(raw));
        setDisplayPrice(raw ? raw.toLocaleString("ko-KR") : "");
        const contentStr = editItem.marketContent || "";
        const stateMatch = contentStr.match(/^\[상품상태:([A-Z])\]/);
        if (stateMatch) {
            setProductState(stateMatch[1]);
            setDescription(contentStr.slice(stateMatch[0].length).replace(/^\n/, ""));
        } else {
            setProductState("");
            setDescription(contentStr);
        }
    }, [editItem, navigate]);

    useEffect(() => {
        axios
            .get(`${BACKSERVER}/api/regions`)
            .then((res) => {
                setRegions(Array.isArray(res.data) ? res.data : []);
            })
            .catch((error) => {
                console.error("지역 목록 조회 실패", error);
                setRegions([]);
            })
            .finally(() => {
                setRegionLoading(false);
            });
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!memberId) {
            alert("로그인 후 판매글을 등록할 수 있습니다.");
            navigate("/members/login");
            return;
        }

        if (isEditMode && isSoldOutEditItem) {
            alert("판매완료된 게시물은 수정할 수 없습니다.");
            navigate(`/store/${editItem.marketNo}`);
            return;
        }

        const needsRegion = tradeMethod !== "택배";

        if (!title || !tradeMethod || !productState || !price || (needsRegion && !region)) {
            alert("필수 항목(제목, 거래방법, 상품상태, 가격, 거래지역)을 모두 입력해주세요.");
            return;
        }

        if (!["직거래/택배", "직거래", "택배"].includes(tradeMethod)) {
            alert("거래방법을 정확히 선택해주세요.");
            return;
        }

        const payload = {
            marketTitle: title,
            marketContent: `[상품상태:${productState}]\n${description}`,
            ctpvsggId: needsRegion ? region : null,
            productPrice: Number(price),
            productStatus: 0,
            productThumb: imageName || "",
            tradeType: tradeMethod,
            memberId,
            memberNickname,
        };

        try {
            if (isEditMode) {
                await axios.put(`${BACKSERVER}/api/store/boards/${editItem.marketNo}`, {
                    ...payload,
                    boardNo: editItem.boardNo,
                    marketNo: editItem.marketNo,
                });
                alert("수정이 완료되었습니다.");
                navigate(`/store/${editItem.marketNo}`);
            } else {
                await axios.post(`${BACKSERVER}/api/store/boards`, payload);
                alert("등록이 완료되었습니다.");
                navigate("/store");
            }
        } catch (error) {
            console.error("상품 등록 실패", error);
            const serverMessage =
                error?.response?.data && typeof error.response.data === "string"
                    ? error.response.data
                    : "상품 등록 중 오류가 발생했습니다.";
            alert(serverMessage);
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

                            <div className={styles.meta_item}>
                                <span className={styles.meta_label}>거래지역</span>
                                <span className={styles.meta_divider}>:</span>
                                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                                    <option value="" disabled>
                                        {regionLoading ? "불러오는 중" : "선택"}
                                    </option>
                                    {regions.map((r) => (
                                        <option key={r.ctpvsggId} value={r.ctpvsggId}>
                                            {`${r.ctpvNm} ${r.sggNm}`}
                                        </option>
                                    ))}
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
                        {isEditMode ? "수정하기" : "등록하기"}
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