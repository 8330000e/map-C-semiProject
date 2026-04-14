import { useEffect, useState, useCallback } from "react";
import styles from "./PointForGoodPage.module.css";
import Swal from "sweetalert2";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import HomeBanner from "./HomeBanner";

//부모 컴포넌트 , props로 isOpen, onClose를 설정.
//->여기서 알아야 할 아주 중요한 점 한가지. 컴포넌트로 분할 할 떄
//-> 부모컴포넌트를 아주 최상위로 올려놓아야 한다.
//-> 왜냐하면 랜더링 될 떄마다 팝업창은 계속 새로운 애가 태어나고 리세되서 기존내용이
//샹력된다. 따라서 한 번 팝업창이 켜지면 그 한번으로 끝내기 위해서는
//-> 팝업창이 뜨게 하는 로직을 제일 맨위로 올려야 한다.
//-> 그래서 떄로는 부모 컴포넌트를 아래로 놓고 자식 컴포넌트를 최상위로 올려놓을 떄도 있다
const DonationPage = ({
  isOpen,
  onClose,
  handleDonateSubmit,
  totalPoint,
  selectedGroup, //부모가 넘겨준 '선택된 단체 정보'를 받음
}) => {
  const [donatePoint, setDonatePoint] = useState("");

  if (!isOpen) return null;

  //체크박스에서 전체 기부포인트를 누르면 기부하게 하는 함수
  const handleAllGivePoint = (e) => {
    if (e.target.checked) {
      setDonatePoint(totalPoint);
    } else {
      setDonatePoint("");
    }
  };

  //기부 포인트란에 포인트를 입력하면 이벤트가 발동하여
  //등록하게 하는 로직
  const handlePointChange = (e) => {
    const value = e.target.value;

    // 숫자가 아니면 입력되지 않도록 막는 로직 (정규표현식 활용)
    // 빈 문자열이거나 숫자일 때만 상태를 업데이트합니다.
    if (value === "" || /^[0-9]+$/.test(value)) {
      setDonatePoint(value);
    }
  };
  return (
    //onClick={onClose}--> 팝업창 외부를 클릭하면 화면이 닫히게 설정
    <div className={styles.donation_overlay} onClick={onClose}>
      <div
        className={styles.donation_page_content}
        //팝업 안쪽 내부를 클릭했을 때는 창이 닫히지 않게 하는 것
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.content_body}>
          <h3>신청 정보 확인</h3>
        </div>

        <div className={styles.point_header}>
          <label>기부 신청 포인트</label>
          <span className={styles.all_give_point_check}>
            <input type="checkbox" onChange={handleAllGivePoint}></input>
            {/*span에서는 문자열을 사용할 떄 span밖에서 자유롭게 쓰면된다. */}
            전포인트기부
          </span>
        </div>

        <input
          className={styles.point_input}
          type="text"
          value={donatePoint}
          onChange={handlePointChange}
          placeholder="포인트를 입력해 주세요"
        ></input>
        <p className={styles.info_point}>
          현재 보유 포인트:<strong>{totalPoint.toLocaleString()}</strong>P
        </p>
        <p className={styles.point_sub_text}>10포인트는 1000원에 해당됩니다.</p>
        <button
          className={styles.submit_btn}
          onClick={() => {
            // 1. 유효성 검사: 입력값이 비었거나 보유 포인트보다 많은지 체크
            const amount = parseInt(donatePoint);
            //통장 잔고가 없거나 혹은 입력이 되지 않았을 경우에는 경고 알림창이 뜨게 하기
            if (!amount || amount <= 0) {
              return Swal.fire(
                "오류",
                "기부할 포인트를 입력해 주세요",
                "error",
              );
            }
            if (amount > totalPoint) {
              return Swal.fire(
                "잔액 부족",
                "보유하신 포인트보다 많이 기부할 수 없습니다.",
                "warning",
              );
            }

            // 2. 부모에게 기부 요청 함수 실행 (아래 2단계에서 만들 함수)
            //-> 기부받을 단체도 추가 해서 같이 보냄
            handleDonateSubmit(amount, selectedGroup.group_id);
          }}
        >
          기부 포인트 입력 완료!
        </button>

        <button onClick={onClose} className={styles.donation_page_btn}>
          닫기
        </button>
      </div>
    </div>
  );
};

//여기가 부모 컴포넌트
const PointForGoodPage = () => {
  //앞으로 쓰이지는 않는 객체에 대해서는 해결할 수 있는 방법 두가지가 있다.
  //하나는 컴포넌트 분리에 의해 형성된 로직에 집어넣는 것.
  //아니면 필요한 객체만 설정하는 것 혹은 해당 객체를 통해서 값을 가져와 저장한다면 then에다가 집어넣는것
  const { memberId: loginId } = useAuthStore();
  // 2. 초기값을 로그인된 아이디로 설정 (로그인 안 되어 있으면 "")

  //기부 버튼을 눌렀을 때 팝업창이 열리고 닫히는 걸 조정하기 위한 상태 설정
  const [isOpen, setIsOpen] = useState(false);
  //이미 위에 있는 donationPage에서 memberTotalPoint를 정의했는데도, 또 다시 정의를 해주는
  //이유는 pointForGoodPage가 부모컴포넌트이기 떄문이다.
  //즉 donationPage에서 정의된 상태변수를 부모에게로 올려보낼 수 가 없다.
  // 그런데 이렇게 되면 더이상 자식에게서는 상태정의를 할 필요가 없다.
  //따라서 자식컴포넌트인 donationPage에서는
  // const [memberTotalPoint, setMemberTotalPoint] = useState(0);
  //---> 이 함수가 삭제된다.

  const [totalPoint, setTotalPoint] = useState(0);
  // 현재 선택된 단체를 저장할 상태
  const [selectedGroup, setSelectedGroup] = useState(null);

  //백엔드에 요청을 보내어 memberPoint데이터를 응답받아 처리할 로직
  //리액트 컴포넌트는 안에 있는 상태(state)가 하나라도 바뀌면 함수 전체를 처음부터 끝까지 다시 읽는다.
  //문제는 그 과정에서 무한 랜더링이 될 수 있음
  //useCallback은 **"이 함수를 기억해뒀다가, 내가
  // 지정한 값이 바뀔 때만 새로 만들고 그전까지는 재사용해!"**라고 명령하는것

  // 포인트 나눔페이지에서 각 환경단체 이미지 카드 만들기 로직

  const donationCardList = [
    {
      group_id: "global_6k",
      title: "글로벌 6K 마라톤에 참여하고 깨끗한 물을 선물해요!",
      category: "해외사업후원",
      period: "2026-04-10 ~ 2026-04-30",
      image: "/pointimages/point1.jpg", // 실제 이미지 경로
    },
    {
      group_id: "forest",
      title: "forest: 우리 나무들을 지켜줘요!",
      category: "긴급구호사업후원",
      period: "2026-04-02 ~ 2026-06-30",
      image: "/pointimages/point2.jpg",
    },
    {
      group_id: "forest",
      title: "forest: 자연의 훼손은 나를 죽이는 일입니다.",
      category: "긴급구호사업후원",
      period: "2026-04-02 ~ 2026-06-30",
      image: "/pointimages/point3.jpg",
    },
    {
      group_id: "global_6k",
      title: "글로벌 6K 마라톤에 참여하고 깨끗한 물을 선물해요!",
      category: "해외사업후원",
      period: "2026-04-10 ~ 2026-04-30",
      image: "/images/marathon.jpg", // 실제 이미지 경로
    },
    {
      group_id: "emergency_relief",
      title: "최수영과 함께 전쟁 속 아이의 하루를 지켜주세요!",
      category: "긴급구호사업후원",
      period: "2026-04-02 ~ 2026-06-30",
      image: "/images/relief.jpg",
    },
    {
      group_id: "emergency_relief",
      title: "최수영과 함께 전쟁 속 아이의 하루를 지켜주세요!",
      category: "긴급구호사업후원",
      period: "2026-04-02 ~ 2026-06-30",
      image: "/images/relief.jpg",
    },
    {
      group_id: "global_6k",
      title: "글로벌 6K 마라톤에 참여하고 깨끗한 물을 선물해요!",
      category: "해외사업후원",
      period: "2026-04-10 ~ 2026-04-30",
      image: "/images/marathon.jpg", // 실제 이미지 경로
    },
    {
      group_id: "emergency_relief",
      title: "최수영과 함께 전쟁 속 아이의 하루를 지켜주세요!",
      category: "긴급구호사업후원",
      period: "2026-04-02 ~ 2026-06-30",
      image: "/images/relief.jpg",
    },
    {
      group_id: "emergency_relief",
      title: "최수영과 함께 전쟁 속 아이의 하루를 지켜주세요!",
      category: "긴급구호사업후원",
      period: "2026-04-02 ~ 2026-06-30",
      image: "/images/relief.jpg",
    },
    // ... 이런 식으로 총 9개를 채웁니다.
  ];

  // 로그인 했을 떄 포인트 데이터를 불러오는 함수
  const loadDataMemberPoint = useCallback(() => {
    // memberId가 비어있을 때는 호출하지 않도록 하는 방어로직
    if (!loginId) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/point-give/${loginId}`)

      .then((res) => {
        //서버 응답 결과(res.data)를 상태에 저장
        setTotalPoint(res.data);

        console.log(`${loginId}님의 데이터를 불러왔습니다.`);
      })
      .catch((err) => {
        console.log("데이터 로드 실패", err);
      });
  });
  //함수 호출은 useEffect를 통해서.
  // memberId가 셋팅되면 자동으로 포인트를 불러옴
  useEffect(() => {
    loadDataMemberPoint();
  }, [loginId]); // 빈 배열[]은 페이지 로드 시 딱 한 번만 실행하라는 뜻

  //로그인 아이디가 확인이 되면 자동으로 데이터 호출
  useEffect(() => {
    loadDataMemberPoint();
  }, [loadDataMemberPoint]);

  // PointForGoodPage 내부

  // 기부 처리 함수
  const handleDonateSubmit = async (amount, groupId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKSERVER}/donations/donate`,
        {
          memberId: loginId, //즉 사용자 아이디, 로그인한 아이디는 loginId에 저장 되어있음
          donationPoint: amount,

          groupId: groupId, //서버로 단체 아이디 보냄
        },
      );

      if (response.status === 200) {
        await Swal.fire({
          title: "기부 완료!",
          text: `${amount}P가 성공적으로 기부되었습니다.`,
          icon: "success",
        });

        setIsOpen(false); // 팝업 닫기
        loadDataMemberPoint(); // ★중요: 기부를 한후 사용자의 수정된 포인트 데이터를 불러오기, 화면 갱신!
      }
    } catch (err) {
      console.error("기부 실패:", err);
      Swal.fire("실패", "서버 오류로 기부에 실패했습니다.", "error");
    }
  };

  return (
    <div className={styles.point_for_good_wrap}>
      <HomeBanner />

      <div className={styles.campaign_container}>
        {/* 1. 캠페인 카드 그리드 */}
        <div className={styles.campaign_grid}>
          {donationCardList.map((item, index) => (
            <div
              key={`${item.group_id}-${index}`}
              className={styles.campaign_card}
            >
              {/* 이미지 영역 */}
              <div className={styles.card_image_wrap}>
                <img
                  //위에서 카드 영역에서 들어간 이미지를 여기서 꺼내어 보여주는 것
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* 정보 영역 */}
              <div className={styles.card_content}>
                <h4 className={styles.card_subject}>{item.category}</h4>
                <p className={styles.card_description}>{item.title}</p>

                <div className={styles.card_footer}>
                  <span className={styles.period}>{item.period}</span>
                </div>
              </div>

              {/* 기부 버튼 */}
              <button
                className={styles.donate_open_btn}
                onClick={() => {
                  setSelectedGroup(item);
                  setIsOpen(true);
                }}
              >
                기부하기
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 기부 팝업 컴포넌트 */}
      <DonationPage
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        totalPoint={totalPoint}
        handleDonateSubmit={handleDonateSubmit}
        selectedGroup={selectedGroup}
      />
    </div>
  );
};
export default PointForGoodPage;
