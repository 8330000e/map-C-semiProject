// 중고장터 목록 페이지 컴포넌트입니다.
// 목데이터를 불러와 검색/페이징하고, 상품 카드를 리스트로 보여줍니다.
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HelpIcon from "@mui/icons-material/Help";
import styles from "./store.module.css";
import { storeDummyData } from "../../mock/dummyData";

const STORE_STATUS_KEY = "storeSaleStatusMap";

const getSaleStatusMap = () => {
	try {
		const raw = localStorage.getItem(STORE_STATUS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const getSaleStatusById = (id, map) => map[id] || "판매중";

const Store = () => {
	// 현재 페이지 / 페이지당 노출 개수
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 16;

	// 검색 조건
	const [searchType, setSearchType] = useState("title");
	const [searchQuery, setSearchQuery] = useState("");
	const [activeSearch, setActiveSearch] = useState("");
	const [saleStatusMap, setSaleStatusMap] = useState(() => getSaleStatusMap());

	useEffect(() => {
		const syncSaleStatus = () => setSaleStatusMap(getSaleStatusMap());
		window.addEventListener("storage", syncSaleStatus);
		window.addEventListener("store-status-updated", syncSaleStatus);

		return () => {
			window.removeEventListener("storage", syncSaleStatus);
			window.removeEventListener("store-status-updated", syncSaleStatus);
		};
	}, []);

	// 데이터 준비 (75개로 제한)
	const goods = useMemo(() => {
		const shuffled = [...storeDummyData].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 75);
	}, []);

	// 검색 필터
	const searchedGoods = useMemo(() => {
		const q = activeSearch.trim().toLowerCase();
		if (!q) return goods;

		return goods.filter((item) =>
			String(item[searchType] ?? "")
				.toLowerCase()
				.includes(q),
		);
	}, [goods, searchType, activeSearch]);

	const displayGoods = useMemo(
		() =>
			searchedGoods.map((item) => {
				const status = getSaleStatusById(item.id, saleStatusMap);
				return {
					...item,
					displayTitle: `[${status}] ${item.title}`,
				};
			}),
		[searchedGoods, saleStatusMap],
	);

	// 페이지 계산
	const pageCount = Math.max(1, Math.ceil(displayGoods.length / itemsPerPage));
	const startIndex = (currentPage - 1) * itemsPerPage;
	const visibleGoods = displayGoods.slice(startIndex, startIndex + itemsPerPage);

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
			<aside className={styles.menu_panel}>
				<div className={styles.menu_title}>메뉴</div>
				<ul className={styles.menu_list}>
					<li>
						<a href="#">맵 커뮤니티</a>
					</li>
					<li>
						<a href="#">회원끼리 캠페인</a>
					</li>
					<li>
						<Link to="/store">중고거래</Link>
					</li>
					<li>
						<a href="#">미션</a>
					</li>
					<li>
						<a href="#">나무 키우기</a>
					</li>
					<li>
						<span>
							<hr />
						</span>
					</li>
					<li>
						<a href="#">공지사항</a>
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

			<section className={styles.store_wrap}>
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
						/>

						<button type="button" onClick={updateSearch}>
							검색
						</button>
					</div>

					<Link to="/store/register" className={styles.sell_button}>
						판매글 등록
					</Link>
				</div>

				<div className={styles.grid_box}>
					{visibleGoods.map((item) => (
						<Link key={item.id} to={`/store/${item.id}`} className={styles.cardLink}>
							<article className={styles.card}>
								<div className={styles.image}>이미지</div>
								<h3>{item.displayTitle}</h3>
								<p className={styles.price}>{item.price}</p>
								<div className={styles.metaRow}>
									<span className={styles.author}>{item.author}</span>
									<span className={styles.metaDivider}>|</span>
									<span className={styles.commentCount}>💬 {item.comments}</span>
									<span className={styles.metaDivider}>|</span>
									<span className={styles.dateLine}>{item.date}</span>
								</div>
								<p className={styles.viewCount}>👀 조회수 {item.viewCount}</p>
							</article>
						</Link>
					))}
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

					<button
						type="button"
						onClick={() => goToPage(currentPage + 1)}
						disabled={currentPage === pageCount}
					>
						&gt;
					</button>
				</div>
			</section>
		</div>
	);
};

export default Store;
