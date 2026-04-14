import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import HelpIcon from "@mui/icons-material/Help";
import useAuthStore from "../../../store/useAuthStore";
import { normalizeImageUrl } from "../../../utils/getImageUrl";
import userImg from "../../../assets/user.png";
import styles from "./store.module.css";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

// 중고거래 목록 페이지임.
//  - 서버에서 판매중인 상품 목록을 받아와서 화면에 보여줌.
//  - 검색어를 입력하면 제목 또는 작성자 기준으로 상품을 필터링함.
const formatPrice = (value) =>
  `${Number(value || 0).toLocaleString("ko-KR")}원`;
const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ko-KR");
};
const getTradeTypeLabel = (tradeType) => {
  if (tradeType === 0 || tradeType === "0" || tradeType === "직거래/택배")
    return "직거래/택배";
  if (tradeType === 1 || tradeType === "1" || tradeType === "직거래")
    return "직거래";
  if (tradeType === 2 || tradeType === "2" || tradeType === "택배")
    return "택배";
  return "미정";
};
const getSaleStatusLabel = (productStatus) => {
  if (
    productStatus === "예약중" ||
    productStatus === 1 ||
    productStatus === "1"
  )
    return "예약중";
  if (
    productStatus === "판매완료" ||
    productStatus === 2 ||
    productStatus === "2"
  )
    return "판매완료";
  return "판매중";
};

const getImageUrl = (thumb) => normalizeImageUrl(thumb);

const getMemberImageUrl = (thumb) => {
  const url = normalizeImageUrl(thumb, "member/thumb");
  return url || userImg;
};

const Store = () => {
  const { memberId, memberThumb } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [goods, setGoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const fetchStoreBoards = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BACKSERVER}/api/store/boards`);
        const items = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.items)
            ? response.data.items
            : [];
        setGoods(items);
        setLoadError("");
      } catch (error) {
        console.error("중고장터 목록 조회 실패", error);
        setLoadError("중고장터 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreBoards();
  }, []);

  const searchedGoods = useMemo(() => {
    const q = activeSearch.trim().toLowerCase();
    if (!q) return goods;

    return goods.filter((item) =>
      String(searchType === "author" ? item.memberId : item.marketTitle)
        .toLowerCase()
        .includes(q),
    );
  }, [goods, searchType, activeSearch]);

  const displayGoods = useMemo(
    () =>
      searchedGoods.map((item) => {
        return {
          ...item,
          displayTitle: `[${getSaleStatusLabel(item.productStatus)}] ${item.marketTitle}`,
        };
      }),
    [searchedGoods],
  );

  const pageCount = Math.max(1, Math.ceil(displayGoods.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleGoods = displayGoods.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const goToPage = (page) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  const updateSearch = () => {
    setActiveSearch(searchQuery);
    setCurrentPage(1);
  };

  return (
        <div className={`${styles.store_layout} common_wrap`}>
            {/* 레이아웃: 왼쪽 메뉴 + 오른쪽 중고장터 컨텐츠 */}
            <aside className={styles.menu_panel}>
                {/* 메뉴 섹션 */}

                <div className={styles.menu_title}>메뉴</div>
                <ul className={styles.menu_list}>
                    <li>
                        <Link to="/map-community">맵 커뮤니티</Link>
                    </li>
                    <li>
                        <a href="#">회원끼리 캠페인</a>
                    </li>
                    <li>
                        <Link to="/store">중고거래</Link>
                    </li>
                    <li>
                        <Link to="/mission">미션(출석체크)</Link>
                    </li>
                    <li>
                        <Link to="/tree-grow" className={styles.treeGrow}>나무 키우기</Link>
                    </li>
                    <li>
                        <span>
                            <hr />
                        </span>
                    </li>
                    <li>
                        <Link to="/support/notice">공지사항</Link>
                    </li>
                </ul>

                <div className={styles.customer_box}>
                    <span className={styles.customer_head}>
                        <h3>고객센터</h3>
                        <HelpIcon sx={{ fontSize: 26, color: "#fff" }} />
                    </span>
                    <p>고객센터 운영시간</p>
                    <p>10:00 ~ 18:00</p>
                    <a href="#" className={styles.customer_link}>
                        문의하기 ▶
                    </a>
                </div>
            </aside>

            {/* 메인 상점 컨텐츠 섹션 */}
            <section className={styles.store_wrap}>
                {/* 상단: 제목 + 검색 바 + 등록 버튼 */}
                <div className={styles.header_box}>
                    <h1>중고장터</h1>

                    <div className={styles.search_box}>
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <option value="author">작성자</option>
                            <option value="title">물품명</option>
                        </select>

                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    updateSearch();
                                }
                            }}
                        />

                        <button type="button" onClick={updateSearch}>
                            검색
                        </button>
                    </div>

                    <Link to="/store/register" className={styles.sell_button}>
                        판매글 등록
                    </Link>
                </div>

                {/* 상품 카드 목록 섹션 */}
                <div className={styles.grid_box}>
                    {isLoading && <p>목록을 불러오는 중입니다.</p>}
                    {!isLoading && loadError && <p>{loadError}</p>}
                    {visibleGoods.map((item, index) => {
                        const tradeMethodLabel = getTradeTypeLabel(item.tradeType);
                        const imageUrl = getImageUrl(item.productThumb);

                        return (
                            <Link key={item.marketNo ?? item.boardNo ?? index} to={`/store/${item.marketNo}`} className={styles.cardLink}>
                                <article className={styles.card}>
                                    <div className={styles.image}>
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={item.marketTitle || "상품 이미지"} />
                                        ) : (
                                            "이미지"
                                        )}
                                    </div>
                                    <h3>{item.displayTitle}</h3>
                                    <p className={styles.price}>{formatPrice(item.productPrice)}</p>
                                    <div className={styles.region_badge}>{item.regionName || item.ctpvsggId || "지역 미등록"}</div>
                                    <p className={styles.tradeType}>거래방법 : {tradeMethodLabel}</p>

                                    <div className={styles.metaRow}>
                                        <span className={styles.authorAvatarWrapper}>
                                            <img
                                                className={styles.authorAvatar}
                                                src={getMemberImageUrl(item.memberThumb || (item.memberId === memberId ? memberThumb : null)) || userImg}
                                                alt={`${item.memberId} 프로필`}
                                                onError={(e) => {
                                                    e.currentTarget.src = userImg;
                                                }}
                                            />
                                            <span className={styles.author}>{item.memberNickname || item.memberId}</span>
                                        </span>
                                        <span className={styles.metaDivider}>|</span>
                                        <span className={styles.commentCount}>💬 {item.commentCount ?? 0}</span>
                                        <span className={styles.metaDivider}>|</span>
                                        <span className={styles.dateLine}>{formatDate(item.createdAt)}</span>
                                    </div>
                                    <p className={styles.viewCount}>👀 조회수 {Number(item.readCount ?? 0).toLocaleString("ko-KR")}</p>
                                </article>
                            </Link>
                        );
                    })}
                </div>

                <div className={styles.pagination}>
                    <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>

                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                        <button
                            type="button"
                            key={page}
                            className={currentPage === page ? styles.activePage : ""}
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount}>
                        &gt;
                    </button>
                </div>
            </section>
    </div>
  );
};

export default Store;
