import { useState } from "react";
import styles from "./PointForGoodPage.module.css";

//부모 컴포넌트 , props로 isOpen, onClose를 설정.
//->여기서 알아야 할 아주 중요한 점 한가지. 컴포넌트로 분할 할 떄
//-> 부모컴포넌트를 아주 최상위로 올려놓아야 한다.
//-> 왜냐하면 랜더링 될 떄마다 팝업창은 계속 새로운 애가 태어나고 리세되서 기존내용이
//샹력된다. 따라서 한 번 팝업창이 켜지면 그 한번으로 끝내기 위해서는
//-> 팝업창이 뜨게 하는 로직을 제일 맨위로 올려야 한다.
const DonationPage = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.donation_overlay}>
      <div className={styles.donation_page_content}>
        <div className={styles.content_body}>
          <h3>신청 정보 확인</h3>
        </div>
        <button onClick={onClose} className={styles.donation_page_btn}>
          닫기
        </button>
      </div>
    </div>
  );
};

const PointForGoodPage = () => {
  /*
  const [member, setMember] = useState({
    memberId: "",
  });
  */
  //기부 버튼을 눌렀을 때 팝업창이 열리고 닫히는 걸 조정하기 위한 상태 설정
  const [isOpen, setIsOpen] = useState(false);

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
              <a>현재 당신의 포인트는?</a>
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
        ></DonationPage>
      </div>
    </div>
  );
};
export default PointForGoodPage;
