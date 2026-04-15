import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Community.module.css";
import axios from "axios";
import TextEditor from "./TextEditor";
import BoardListBox from "./BoardListBox";
import useAuthStore from "../../../store/useAuthStore";
import { normalizeImageUrl } from "../../../utils/getImageUrl";
import { compressImageFile } from "../../../utils/compressImage";
import Swal from "sweetalert2";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { REGION_DATA } from "./regionData";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const getBoardNo = (board) =>
  board?.boardNo ?? board?.boardId ?? board?.id ?? null;

// 이미지 src는 서버에서 여러 형태로 내려올 수 있습니다.
// 예: 이미지 전체 URL, /upload/ 경로, /board/editor/ 경로, 파일명만 전달되는 경우.
// 여기서 브라우저가 바로 요청 가능한 URL로 변환해 줍니다.
// 로컬 경로는 이제 백엔드 정적 서빙 대신 Firebase URL로 바꾸는 것을 우선함.
const getBoardImageUrl = normalizeImageUrl;

const getMemberImageUrl = (thumb) => normalizeImageUrl(thumb, "member/thumb");

const Community = ({
  addr,
  lnglat,
  ctpvsgg,
  setAddr,
  setLnglat,
  setCtpvsgg,
  boxaddr,
  setBoxaddr,
}) => {
  const { memberId, memberNickname } = useAuthStore();
  const isLogin = !!memberId;
  const mapDivRef = useRef(null);

  const [mode, setMode] = useState("list");

  const [boardList, setBoardList] = useState([]);
  const [expandedBoardNo, setExpandedBoardNo] = useState(null);

  const [type, setType] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [highlightBoardNo, setHighlightBoardNo] = useState(null);

  const [searchType, setSearchType] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedBoard, setSelectedBoard] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [attachedFiles, setAttachedFiles] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const [missionType, setMissionType] = useState(null);
  const [sortType, setSortType] = useState("popular");

  const sigunguOptions = sido ? REGION_DATA[sido] || [] : [];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeParam = params.get("mode");
    const missionParam = params.get("mission");
    const boardNoParam = params.get("boardNo");

    if (modeParam === "write") {
      setMode("write");
    } else {
      setMode("list");
    }

    setMissionType(missionParam || null);
    setHighlightBoardNo(boardNoParam ? String(boardNoParam) : null);
  }, [location.search]);

  const [selectAddr, setSelectAddr] = useState("선택된 위치 없음");
  const [selectLnglat, setSelectLnglat] = useState({
    lat: 0,
    lng: 0,
  });
  const [selectCtpvSgg, setSelectCtpvSgg] = useState({
    ctpv: "",
    sgg: "",
  });

  // 게시글 목록 메타 로드 기능임.
  // 댓글 개수와 좋아요 상태를 게시글 목록에 채워서 화면에 보여줌.
  //  - 댓글 개수는 /boards/{boardNo}/comments API에서 가져옴.
  //  - 좋아요 상태는 /boards/{boardNo}/likes/{memberId} API로 확인함.
  const loadBoardMeta = async (boards) => {
    if (!boards || boards.length === 0) return boards;

    try {
      const results = await Promise.all(
        boards.map(async (board) => {
          if (!board?.boardNo) return board;

          const commentRequest = axios.get(
            `${BACKSERVER}/boards/${board.boardNo}/comments`,
          );

          const likeRequest = memberId
            ? axios.get(
                `${BACKSERVER}/boards/${board.boardNo}/likes/${memberId}`,
              )
            : Promise.resolve({ data: false });

          const [commentRes, likeRes] = await Promise.all([
            commentRequest,
            likeRequest,
          ]);

          const comments = Array.isArray(commentRes.data)
            ? commentRes.data
            : [];
          const isLiked = likeRes?.data === true;

          return {
            ...board,
            commentCount: comments.length,
            liked: isLiked,
          };
        }),
      );
      return results;
    } catch (err) {
      console.error("게시글 메타 로드 실패:", err);
      return boards;
    }
  };

  useEffect(() => {
    axios
      .get(`${BACKSERVER}/boards`, {
        params: {
          status: 0,
          searchType,
          searchKeyword,
          sido,
          sigungu,
          sortType,
        },
      })
      .then(async (res) => {
        console.log("게시글 목록 응답:", res.data);
        const items = Array.isArray(res.data.items)
          ? res.data.items
          : Array.isArray(res.data)
            ? res.data
            : [];
        // 목록 데이터를 불러온 후, 댓글 개수와 좋아요 상태를 채워서 화면에 반영함.
        const itemsWithMeta = await loadBoardMeta(items);
        setBoardList(itemsWithMeta);
      })
      .catch((err) => {
        console.error("게시글 조회 실패:", err);
        setBoardList([]);
      });
  }, [searchType, searchKeyword, sido, sigungu, sortType, memberId]);

  useEffect(() => {
    if (!highlightBoardNo || !boardList.length) return;

    const targetBoard = boardList.find(
      (board) => String(getBoardNo(board)) === String(highlightBoardNo),
    );
    if (!targetBoard) return;

    if (String(expandedBoardNo) === String(highlightBoardNo)) return;

    setSelectedBoard(targetBoard);

    axios
      .get(`${BACKSERVER}/boards/${highlightBoardNo}/read`)
      .then(() => {
        setBoardList((prev) =>
          prev.map((item) =>
            String(item.boardNo) === String(highlightBoardNo)
              ? { ...item, readCount: (item.readCount ?? 0) + 1 }
              : item,
          ),
        );
      })
      .catch((err) => {
        console.error("게시글 상세 이동 시 조회수 업데이트 실패", err);
      });

    setExpandedBoardNo(String(highlightBoardNo));
    setHighlightBoardNo(null);
  }, [boardList, highlightBoardNo]);

  useEffect(() => {
    if (!expandedBoardNo) {
      setSelectedBoard(null);
      setDetailLoading(false);
      return;
    }

    setDetailLoading(true);
    axios
      .get(`${BACKSERVER}/boards/${expandedBoardNo}`)
      .then((res) => {
        if (res.data) {
          setSelectedBoard(res.data);
        }
      })
      .catch((err) => {
        console.error("게시글 상세 정보 로드 실패", err);
      })
      .finally(() => {
        setDetailLoading(false);
      });
  }, [expandedBoardNo]);

  useEffect(() => {
    if (!mapDivRef.current || !window.naver) {
      return;
    }
    const map = new naver.maps.Map(mapDivRef.current, {
      center: new window.naver.maps.LatLng(`${lnglat.lat}`, `${lnglat.lng}`),
      zoom: 15,
    });

    const defaultMarker = new naver.maps.Marker({
      position: new window.naver.maps.LatLng(`${lnglat.lat}`, `${lnglat.lng}`),
      map: map,
      icon: {
        content:
          '<img loading="lazy" decoding="async" src="src/assets/img/marker.png" style="width: 30px; margin: 0px; padding: 0px; border: 0px solid transparent; display: block; min-width: 30px; min-height: none; -webkit-user-select: none; position: absolute; left: 0px; top: 0px;">',
        size: new naver.maps.Size(22, 35),
        anchor: new naver.maps.Point(11, 35),
      },
    });

    defaultMarker.setTitle("Default Marker");
    defaultMarker.setDraggable(true);

    naver.maps.Event.addListener(map, "click", function (e) {
      defaultMarker.setPosition(e.coord);
      naver.maps.Service.reverseGeocode(
        {
          location: e.coord,
        },
        (status, response) => {
          if (status != naver.maps.Service.Status.OK) {
            alert("주소를 찾을 수 없습니다.");
            return;
          }
          setAddr(response.result.items[0].address);
          setLnglat({
            lat: e.coord.lat(),
            lng: e.coord.lng(),
          });
          setCtpvsgg({
            ctpv: response.result.items[0].addrdetail.sido,
            sgg: response.result.items[0].addrdetail.sigugun,
          });
        },
      );
    });
  }, [mode, addr, lnglat, ctpvsgg]);

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchType(type);
    setSearchKeyword(keyword);
  };
  const extractFirstImageSrc = (html) => {
    if (!html) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const firstImg = doc.querySelector("img");

    return firstImg ? firstImg.getAttribute("src") : null;
  };

  // 게시글 작성 기능임. 내용을 서버에 보내고 첨부파일이 있으면 파일도 함께 업로드함.
  //  - 먼저 제목/내용 유효성 검사 수행함.
  //  - /boards로 POST하여 게시글을 저장함.
  //  - 게시글 저장 성공 후 /boards/{boardNo}/files로 첨부파일 업로드함.
  const submitWrite = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "제목을 입력하세요",
      });
      return;
    }

    if (!content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "내용을 입력하세요",
      });
      return;
    }

    try {
      const thumbnailUrl = extractFirstImageSrc(content);
      const requestData = {
        writerId: memberId,
        memberNickname: memberNickname,
        boardTitle: title,
        boardContent: content,
        boardThumb: thumbnailUrl,
        boardStatus: 0,
        boardLat: lnglat.lat,
        boardLng: lnglat.lng,
        ctpv: ctpvsgg.ctpv,
        sgg: ctpvsgg.sgg,
        addr: addr,
      };

      const res = await axios.post(`${BACKSERVER}/boards`, requestData);
      const savedBoard = res.data;
      const boardNo = savedBoard.boardNo;
      const pointAwarded = savedBoard.pointAwarded;

      if (boardNo > 0) {
        if (attachedFiles.length > 0) {
          const formData = new FormData();

          // 첨부 파일 중 이미지인 경우 업로드 전에 압축함
          for (const file of attachedFiles) {
            const fileToUpload = file.type.startsWith("image/")
              ? await compressImageFile(file, {
                  maxWidth: 1200,
                  maxHeight: 1200,
                  quality: 0.75,
                })
              : file;
            formData.append("files", fileToUpload, fileToUpload.name);
          }

          formData.append("memberId", memberId);

          await axios.post(`${BACKSERVER}/boards/${boardNo}/files`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        // ⭐ 추가 (핵심)
        const pointAwarded = savedBoard.pointAwarded;

        if (pointAwarded) {
          await Swal.fire({
            icon: "success",
            title: "게시글 등록 완료",
            text: "게시글이 등록되었고, 5포인트가 지급되었습니다.",
            confirmButtonText: "확인",
          });
        } else {
          await Swal.fire({
            icon: "success",
            title: "게시글이 등록되었습니다!",
            text: "작성한 게시글이 정상적으로 등록되었습니다.",
            confirmButtonText: "확인",
          });
        }

        // 초기화
        setTitle("");
        setContent("");
        setAttachedFiles([]);
        //다시 미션목록으로
        if (location.state?.fromMission && missionType === "board-write") {
          navigate("/mission", { replace: true });
          return;
        }

        // 리스트로 이동
        setMode("list");

        // 목록 다시 불러오기
        const listRes = await axios.get(`${BACKSERVER}/boards`, {
          params: {
            status: 0,
            searchType,
            searchKeyword,
            sido,
            sigungu,
            sortType,
          },
        });

        const items = Array.isArray(listRes.data.items)
          ? listRes.data.items
          : Array.isArray(listRes.data)
            ? listRes.data
            : [];
        setBoardList(await loadBoardMeta(items));
      } else {
        Swal.fire({
          icon: "error",
          title: "등록 실패",
          text: "게시글 등록에 실패했습니다.",
        });
      }
    } catch (err) {
      console.error(err);

      Swal.fire({
        icon: "error",
        title: "서버 오류",
        text: "게시글 등록 중 오류가 발생했습니다.",
      });
    }
  };
  const startEdit = (board) => {
    setSelectedBoard(board);
    setTitle(board.boardTitle || "");
    setContent(board.boardContent || "");
    setMode("edit");
  };
  const submitEdit = async () => {
    if (!title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "제목을 입력하세요",
      });
      return;
    }

    if (!content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "내용을 입력하세요",
      });
      return;
    }

    try {
      const thumbnailUrl = extractFirstImageSrc(content);

      const requestData = {
        boardTitle: title,
        boardContent: content,
        boardThumb: thumbnailUrl,
        addr: selectAddr,
      };

      const res = await axios.patch(
        `${BACKSERVER}/boards/${selectedBoard.boardNo}`,
        requestData,
        { params: { memberId } },
      );

      if (res.data > 0) {
        await Swal.fire({
          icon: "success",
          title: "게시글이 수정되었습니다!",
          confirmButtonText: "확인",
        });

        setSelectedBoard(null);
        setTitle("");
        setContent("");
        setMode("list");

        const listRes = await axios.get(`${BACKSERVER}/boards`, {
          params: {
            status: 0,
            searchType,
            searchKeyword,
            sido,
            sigungu,
          },
        });

        const items = Array.isArray(listRes.data.items)
          ? listRes.data.items
          : Array.isArray(listRes.data)
            ? listRes.data
            : [];
        setBoardList(await loadBoardMeta(items));
      } else {
        Swal.fire({
          icon: "error",
          title: "수정 실패",
          text: "게시글 수정에 실패했습니다.",
        });
      }
    } catch (err) {
      console.error(err.response?.data);

      Swal.fire({
        icon: "error",
        title: "서버 오류",
        text: "게시글 수정 중 오류가 발생했습니다.",
      });
    }
  };
  // 게시글 삭제 확인 처리
  // 이전에는 삭제 확인창이 없거나 버튼 순서가 뒤집혀 있을 수 있었습니다.
  // 지금은 삭제 버튼이 왼쪽에, 취소 버튼이 오른쪽에 표시됩니다.
  const deleteBoard = async (boardNo) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "게시글을 삭제하시겠습니까?",
      text: "삭제된 게시글은 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const res = await axios.delete(`${BACKSERVER}/boards/${boardNo}`, {
        timeout: 5000,
        params: { memberId },
      });

      if (res.data > 0) {
        setBoardList((prev) =>
          prev.filter((board) => board.boardNo !== boardNo),
        );

        await Swal.fire({
          icon: "success",
          title: "삭제 완료",
          text: "게시글이 삭제되었습니다.",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "삭제 실패",
          text: "게시글 삭제에 실패했습니다.",
        });
      }
    } catch (err) {
      console.error("삭제 에러", err);
      Swal.fire({
        icon: "error",
        title: "서버 오류",
        text: "삭제 중 오류가 발생했습니다.",
      });
    }
  };
  const insertSpot = () => {
    setSelectLnglat({
      lat: lnglat.lat,
      lng: lnglat.lng,
    });
    setSelectAddr(addr);
    setSelectCtpvSgg({
      ctpv: ctpvsgg.ctpv,
      sgg: ctpvsgg.sgg,
    });
  };

  return (
    <section className={styles.mapCommunityWrap}>
      <div className={styles.mapCommunityInner}>
        <div className={styles.mapCommunityRight}>
          {mode === "list" ? (
            <>
              <div className={styles.mapCommunityFilterRow}>
                <select
                  className={styles.mapCommunitySelect}
                  value={sido}
                  onChange={(e) => {
                    setSido(e.target.value);
                    setSigungu("");
                  }}
                >
                  <option value="">시/도 선택</option>
                  {Object.keys(REGION_DATA).map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.mapCommunitySelect}
                  value={sigungu}
                  onChange={(e) => {
                    setSigungu(e.target.value);
                  }}
                  disabled={!sido}
                >
                  <option value="">시/군/구 선택</option>
                  {sigunguOptions.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.mapCommunitySelect}
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                >
                  <option value="popular">인기순</option>
                  <option value="latest">최신순</option>
                </select>
              </div>

              <div className={styles.mapCommunityTop}>
                <form
                  className={styles.mapCommunitySearchWrap}
                  onSubmit={submitSearch}
                >
                  <select
                    className={`${styles.mapCommunitySelect} ${styles.searchTypeSelect}`}
                    value={type}
                    onChange={(e) => {
                      setType(Number(e.target.value));
                    }}
                  >
                    <option value={1}>제목</option>
                    <option value={2}>작성자</option>
                  </select>

                  <input
                    type="text"
                    className={styles.mapCommunityInput}
                    placeholder="검색어를 입력하세요..."
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />

                  <button type="submit" className={styles.mapCommunityBtn}>
                    검색
                  </button>
                </form>

                <div className={styles.mapCommunityAction}>
                  {isLogin && (
                    <button
                      type="button"
                      className={`${styles.mapCommunityBtn} ${styles.writeBtn}`}
                      onClick={() => {
                        setMode("write");
                        {
                          addr == "" || addr == "선택된 위치 없음"
                            ? setAddr("선택된 위치 없음")
                            : setAddr(addr);
                        }
                        setSelectLnglat({
                          lat: 0,
                          lng: 0,
                        });
                        setCtpvsgg({
                          ctpv: "",
                          sgg: "",
                        });
                        setSelectAddr("");
                        setSelectLnglat({
                          lat: 0,
                          lng: 0,
                        });
                        setSelectCtpvSgg({
                          ctpv: "",
                          sgg: "",
                        });
                      }}
                    >
                      게시글 작성
                    </button>
                  )}
                </div>
              </div>

              <BoardListBox
                boardList={boardList}
                expandedBoardNo={expandedBoardNo}
                selectedBoard={selectedBoard}
                setExpandedBoardNo={setExpandedBoardNo}
                setSelectedBoard={setSelectedBoard}
                setBoardList={setBoardList}
                startEdit={startEdit}
                deleteBoard={deleteBoard}
                getImageUrl={getBoardImageUrl}
                getAvatarUrl={getMemberImageUrl}
                detailLoading={detailLoading}
              />
            </>
          ) : (
            <div className={styles.boardWriteWrap}>
              <div className={styles.boardWriteHeader}>
                <button
                  type="button"
                  className={styles.boardBackBtn}
                  onClick={() => {
                    setMode("list");
                    setTitle("");
                    setContent("");
                    setAttachedFiles([]);
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
                <h3>{mode === "edit" ? "게시글 수정" : "게시글 작성"}</h3>
              </div>

              <div className={styles.boardWriteScroll}>
                <div className={styles.boardWriteGroup}>
                  <label>제목</label>
                  <input
                    type="text"
                    className={styles.boardWriteInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className={styles.boardWriteGroup}>
                  <label>내용</label>
                  <TextEditor
                    data={content}
                    setData={setContent}
                    attachedFiles={attachedFiles}
                    setAttachedFiles={setAttachedFiles}
                  />
                </div>

                <div className={styles.boardWriteGroup}>
                  <label>오늘의 내 탄소배출량은?</label>
                  {/* 탄소계산 기능 들어갈 자리*/}
                  <div className={styles.carbonBox}>탄소계산 ⊞</div>
                </div>

                <div className={styles.boardWriteGroup}>
                  <label>장소</label>
                  <div className={styles.map_div}>
                    <div className={styles.spot_box}>
                      <p>선택된 위치</p>
                      <p>{addr}</p>
                    </div>
                    <div
                      className={`${styles.spotSelectBtn} ${addr === selectAddr ? styles.selectedBtn : ""}`}
                      onClick={insertSpot}
                    >
                      {addr === selectAddr ? "선택완료" : "장소선택"}
                    </div>
                    <div className={styles.lnglat}>
                      <p>lng: {lnglat.lat}</p>
                      <p>lat: {lnglat.lng}</p>
                    </div>
                    <div
                      id="map"
                      className={styles.writeMapBox}
                      ref={mapDivRef}
                    ></div>
                  </div>
                </div>

                <div className={styles.boardWriteNotice}>
                  <p>
                    탄소커넥트는 누구나 기분 좋게 참여할 수 있는 커뮤니티를
                    만들기 위해 커뮤니티 이용규칙을 제정하여 운영하고 있습니다.
                  </p>

                  <p>
                    위반 시 게시물이 삭제되고 서비스 이용이 일정 기간 제한될 수
                    있습니다.
                  </p>

                  <p>
                    아래는 핵심 요약 사항이며, 게시물 작성 전 반드시
                    확인해주세요.
                  </p>

                  <ul>
                    <li>
                      <strong>정치/사회 관련 행위 금지</strong>
                      <br />
                      국가기관, 정치단체, 언론, 시민단체 관련 언급 및 의견 표현
                      금지
                    </li>

                    <li>
                      <strong>홍보 및 판매 금지</strong>
                      <br />
                      영리 여부와 관계없이 사업체/개인 홍보, 바이럴 행위 금지
                    </li>

                    <li>
                      <strong>불법 촬영물 금지</strong>
                      <br />
                      관련 법률에 따라 삭제 및 이용 제한 가능
                    </li>

                    <li>
                      <strong>기타 금지 행위</strong>
                      <br />
                      욕설, 혐오, 차별, 폭력, 음란물, 공포/속임 콘텐츠 등
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className={styles.boardSubmitBtn}
                  onClick={mode === "edit" ? submitEdit : submitWrite}
                >
                  {mode === "edit" ? "수정 완료" : "작성 완료"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Community;
