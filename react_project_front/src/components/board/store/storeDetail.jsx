// 중고장터 상품 상세 페이지 컴포넌트입니다.
// 상품 정보, 판매 상태 변경, 댓글 작성/수정/삭제 기능을 제공합니다.
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { storeDummyData } from "../../mock/dummyData";
import Swal from "sweetalert2";
import styles from "./storeDetail.module.css";

const STORE_STATUS_KEY = "storeSaleStatusMap";

const getSaleStatusMap = () => {
	try {
		const raw = localStorage.getItem(STORE_STATUS_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		return {};
	}
};

const getSaleStatusById = (id) => {
	const map = getSaleStatusMap();
	return map[id] || "판매중";
};

const setSaleStatusById = (id, status) => {
	const map = getSaleStatusMap();
	map[id] = status;
	localStorage.setItem(STORE_STATUS_KEY, JSON.stringify(map));
	window.dispatchEvent(new Event("store-status-updated"));
};

const StoreDetail = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const itemId = Number(id);

	const parsePriceToNumber = (value) => Number(String(value || "").replace(/[^0-9]/g, "")) || 0;

	// URL id에 해당하는 상품 1개 조회
	const item = useMemo(
		() => storeDummyData.find((product) => product.id === itemId),
		[itemId],
	);

	// 댓글 초기값
	const [comments, setComments] = useState([
		{
			id: 1,
			user: "구매희망자1",
			text: "구매 가능할까요? 직거래 희망합니다.",
			date: "5분 전",
			isPrivate: false,
		},
		{
			id: 2,
			user: "구매희망자2",
			text: "구성품 포함 여부 궁금합니다.",
			date: "2분 전",
			isPrivate: true,
		},
	]);

	const [newComment, setNewComment] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editingText, setEditingText] = useState("");
	// 상품 판매 상태 (기본값: 판매중)
	const [saleStatus, setSaleStatus] = useState(() => getSaleStatusById(itemId));

	const handleAddComment = () => {
		const text = newComment.trim();
		if (!text) return;

		setComments((prev) => [
			...prev,
			{
				id: Date.now(),
				user: "로그인유저",
				text,
				date: "방금 전",
				isPrivate,
			},
		]);

		setNewComment("");
		setIsPrivate(false);
	};

	const handleDeleteComment = (commentId) => {
		setComments((prev) => prev.filter((comment) => comment.id !== commentId));
	};

	const startEditComment = (comment) => {
		setEditingId(comment.id);
		setEditingText(comment.text);
	};

	const saveEditComment = () => {
		const text = editingText.trim();
		if (!text || editingId === null) return;

		setComments((prev) =>
			prev.map((comment) =>
				comment.id === editingId ? { ...comment, text, date: "방금 수정됨" } : comment,
			),
		);

		setEditingId(null);
		setEditingText("");
	};

	if (!item) {
		return (
			<section className={styles.detail_wrap}>
				<h1>중고장터</h1>
				<p>해당 상품을 찾을 수 없습니다.</p>
				<Link to="/store" className={styles.back_link}>
					← 목록으로 돌아가기
				</Link>
			</section>
		);
	}

	// 같은 제목 상품 우선, 없으면 상위 6개 대체
	const sameProducts = storeDummyData.filter(
		(product) => product.title === item.title && product.id !== item.id,
	);
	const displaySame = sameProducts.length > 0 ? sameProducts.slice(0, 6) : storeDummyData.slice(0, 6);
	const displayTitle = `[${saleStatus}] ${item.title}`;

	const handleChangeSaleStatus = async (status) => {
		const isCancelAction = saleStatus === status;
		const nextStatus = isCancelAction ? "판매중" : status;
		const confirmText = isCancelAction
			? `[${status}] 상태를 해제하고 [판매중]으로 변경하시겠습니까?`
			: `[${status}] 상태로 변경하시겠습니까?`;

		const result = await Swal.fire({
			icon: "question",
			title: "상태 변경",
			text: confirmText,
			showCancelButton: true,
			confirmButtonText: "확인",
			cancelButtonText: "취소",
			confirmButtonColor: "#464d3e",
			cancelButtonColor: "#8c9482",
		});

		if (!result.isConfirmed) return;

		setSaleStatus(nextStatus);
		setSaleStatusById(itemId, nextStatus);

		Swal.fire({
			icon: "success",
			title: "변경 완료",
			text: `[${nextStatus}] 상태로 변경되었습니다.`,
			confirmButtonColor: "#464d3e",
		});
	};

	const handleGoToPayment = () => {
		navigate("/payment/order", {
			state: {
				itemId,
				orderName: item.title,
				amount: parsePriceToNumber(item.price),
			},
		});
	};

	return (
		<section className={styles.detail_wrap}>
			<div className={styles.detail_header}>
				<h1>{displayTitle}</h1>
				<Link to="/store" className={styles.back_link}>
					← 목록으로 돌아가기
				</Link>
			</div>

			<div className={styles.detail_top}>
				<div className={styles.detail_image_box}>
					<div className={styles.image}>상품 이미지</div>
				</div>

				<div className={styles.detail_summary}>
					<p className={styles.price}>{item.price}</p>
					<p>작성자 : {item.author}</p>
					<p>조회수 : {item.viewCount}</p>
					<p>댓글 : {item.comments}</p>

					<div className={styles.info_box}>배송비 : 5,000원 / 거래방법 : 직거래 · 택배</div>
					<div className={styles.info_box}>상품 상태 : 중고, 구성품 없음</div>

					<div className={styles.action_row}>
						<button
							type="button"
							className={`${styles.statusButton} ${saleStatus === "예약중" ? styles.statusButtonActive : ""}`}
							onClick={() => handleChangeSaleStatus("예약중")}
						>
							예약중
						</button>
						<button
							type="button"
							className={`${styles.statusButton} ${saleStatus === "판매완료" ? styles.statusButtonActive : ""}`}
							onClick={() => handleChangeSaleStatus("판매완료")}
						>
							판매완료
						</button>
					</div>
					<button type="button" className={styles.buy_button} onClick={handleGoToPayment}>
						구매하기
					</button>
				</div>
			</div>

			<div className={styles.section_box}>
				<h3>상품정보</h3>
				<p>
					{item.title} 상품 상세 안내입니다. 현재는 목데이터 기반 화면이며, 추후 실데이터 연동 시 상세 설명이
					표시됩니다.
				</p>
			</div>

			<div className={styles.section_box}>
				<h3>가게 정보</h3>
				<p>상점명 : {item.author} 상점</p>
				<p>신뢰지수 : 624</p>
				<p>거래후기 : 1</p>
			</div>

			<div className={styles.same_items_section}>
				<h3>같은 상품 더보기</h3>
				<div className={styles.same_items_wrapper}>
					{displaySame.map((same) => (
						<Link key={same.id} to={`/store/${same.id}`} className={styles.same_item}>
							<div className={styles.image}>이미지</div>
							<div className={styles.same_item_title}>{same.title}</div>
							<div className={styles.same_item_price}>{same.price}</div>
						</Link>
					))}
				</div>
			</div>

			<div className={styles.comment_section}>
				<h3>댓글</h3>

				<div className={styles.comment_list}>
					{comments.map((comment) => (
						<div key={comment.id} className={styles.comment_item}>
							<p className={styles.comment_meta}>
								[프로필이미지] {comment.user} | 절약점수 : 00 | {comment.date}
							</p>

							{editingId === comment.id ? (
								<div className={styles.comment_edit_wrap}>
									<input
										value={editingText}
										onChange={(e) => setEditingText(e.target.value)}
										className={styles.comment_input}
									/>
									<button type="button" onClick={saveEditComment}>
										저장
									</button>
								</div>
							) : (
								<p className={styles.comment_text}>
									{comment.isPrivate ? "[비공개] " : ""}
									{comment.text}
								</p>
							)}

							<div className={styles.comment_actions}>
								<button type="button" onClick={() => startEditComment(comment)}>
									수정
								</button>
								<button type="button" onClick={() => handleDeleteComment(comment.id)}>
									삭제
								</button>
							</div>
						</div>
					))}
				</div>

				<div className={styles.comment_form}>
					<p className={styles.comment_meta}>[프로필이미지] 닉네임 | 절약점수 : 00</p>
					<div className={styles.comment_form_row}>
						<input
							className={styles.comment_input}
							placeholder="댓글을 입력하세요..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
						/>

						<label className={styles.private_check}>
							<input
								type="checkbox"
								checked={isPrivate}
								onChange={(e) => setIsPrivate(e.target.checked)}
							/>
							비공개
						</label>

						<button type="button" onClick={handleAddComment}>
							등록
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default StoreDetail;
