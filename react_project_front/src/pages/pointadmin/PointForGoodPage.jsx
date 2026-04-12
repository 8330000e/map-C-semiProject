import { useEffect, useState } from "react";
import styles from "./PointForGoodPage.module.css";
import Swal from "sweetalert2";
import axios from "axios";

//부모 컴포넌트 , props로 isOpen, onClose를 설정.
//->여기서 알아야 할 아주 중요한 점 한가지. 컴포넌트로 분할 할 떄
//-> 부모컴포넌트를 아주 최상위로 올려놓아야 한다.
//-> 왜냐하면 랜더링 될 떄마다 팝업창은 계속 새로운 애가 태어나고 리세되서 기존내용이
//샹력된다. 따라서 한 번 팝업창이 켜지면 그 한번으로 끝내기 위해서는
//-> 팝업창이 뜨게 하는 로직을 제일 맨위로 올려야 한다.
const DonationPage = ({
  isOpen,
  onClose,
  memberId,
  setMemberId,
  memberTotalPoint,
}) => {
  const [donatePoint, setDonatePoint] = useState("");

  if (!isOpen) return null;

  //체크박스에서 전체 기부포인트를 누르면 기부하게 하는 함수
  const handleAllGivePoint = (e) => {
    if (e.target.checked) {
      setDonatePoint(memberTotalPoint);
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
    <div className={styles.donation_overlay}>
      <div className={styles.donation_page_content}>
        <div className={styles.content_body}>
          <h3>신청 정보 확인</h3>
        </div>
        <div className={styles.input_group}>
          <label htmlFor="memberId">신청 아이디:</label>
          <input
            type="text"
            id="memberId"
            name="memberId"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="아이디를 입력하세요"
          ></input>
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
          현재 보유 포인트:<strong>{memberTotalPoint.toLocaleString()}</strong>P
        </p>
        <p className={styles.point_sub_text}>10포인트는 1000원에 해당됩니다.</p>
        <button
          className={styles.submit_btn}
          onClick={() => {
            Swal.fire({
              title: "포인트 기부완료!",
              text: "당신의 기부에 진심으로 감사합니다!",
              icon: "success",
            });
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

const PointForGoodPage = () => {
  //앞으로 쓰이지는 않는 객체에 대해서는 해결할 수 있는 방법 두가지가 있다.
  //하나는 컴포넌트 분리에 의해 형성된 로직에 집어넣는 것.
  //아니면 필요한 객체만 설정하는 것 혹은 해당 객체를 통해서 값을 가져와 저장한다면 then에다가 집어넣는것
  const [memberId, setMemberId] = useState("");
  //기부 버튼을 눌렀을 때 팝업창이 열리고 닫히는 걸 조정하기 위한 상태 설정
  const [isOpen, setIsOpen] = useState(false);
  //이미 위에 있는 donationPage에서 memberTotalPoint를 정의했는데도, 또 다시 정의를 해주는
  //이유는 pointForGoodPage가 부모컴포넌트이기 떄문이다.
  //즉 donationPage에서 정의된 상태변수를 부모에게로 올려보낼 수 가 없다.
  // 그런데 이렇게 되면 더이상 자식에게서는 상태정의를 할 필요가 없다.
  //따라서 자식컴포넌트인 donationPage에서는
  // const [memberTotalPoint, setMemberTotalPoint] = useState(0);
  //---> 이 함수가 삭제된다.

  const [memberTotalPoint, setMemberTotalPoint] = useState(0);

  //백엔드에 요청을 보내어 memberPoint데이터를 응답받아 처리할 로직
  const loadDataMemberPoint = () => {
    // memberId가 비어있을 때는 호출하지 않도록 하는 방어로직
    if (!memberId) return;

    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/point-give/${memberId}`)
      .then((res) => {
        //서버 응답 결과(res.data)를 상태에 저장
        setMemberTotalPoint(res.data);

        console.log(`${memberId}님의 데이터를 불러왔습니다.`);
      })
      .catch((err) => {
        console.log("데이터 로드 실패", err);
      });
  };
  //함수 호출은 useEffect를 통해서.
  useEffect(() => {
    loadDataMemberPoint();
  }, [memberId]); // 빈 배열[]은 페이지 로드 시 딱 한 번만 실행하라는 뜻

  const handleDonation = () => {
    //평소에 닫혀있다가 기부하기 버튼을 클릭하면
    //팝업창이 열리게 하는 설정 로직.
    setIsOpen(true);
  };

  return (
    <div className={styles.point_for_good_wrap}>
      <div className={styles.point_sidebar}>
        <div>
          <div className={styles.left_sidebar}>
            <div className={styles.grade_title}>
              <a>당신의 현재.... 기부등급은 ...</a>
            </div>
            <div className={styles.contain_point_title}>
              <a>
                현재 당신의 포인트는?
                <strong>{memberTotalPoint.toLocaleString()}P</strong>{" "}
              </a>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.right_sidebar}>
            <h2>당신의 포인트가 세상을 바꿉니다</h2>
            <div className={styles.donation_title}>
              <span>
                지금도 우리 환경을 위해 땀을 흘리고 있을 환경단체들을
                후원해주세요.
              </span>
            </div>
            <button
              type="button"
              className={styles.donation_btn}
              onClick={handleDonation}
            >
              기부하기
            </button>

            <div className={styles.buytree_title}>
              <span>나무 영양제 사기</span>
            </div>
            <button type="button" className={styles.buytree_btn}>
              구입하기
            </button>
          </div>
        </div>
        <DonationPage
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          memberId={memberId}
          setMemberId={setMemberId}
          memberTotalPoint={memberTotalPoint}
        ></DonationPage>
      </div>
    </div>
  );
};
export default PointForGoodPage;
