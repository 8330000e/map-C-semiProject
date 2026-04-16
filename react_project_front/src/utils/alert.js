import { color } from "chart.js/helpers";
import Swal from "sweetalert2";

// --- 애니메이션 효과를 위한 인라인 스타일 추가 ---
//부모컴포넌트는 아니지만 여기서 해야 전체적으로 다양한 스타일을 줄 수 있음
const style = document.createElement("style");
style.innerHTML = `
/* 팝업 창 전체 보더 레디어스 */
.my-rounded-popup {
    border-radius: 20px !important;
}
    /* 버튼도 조금 더 둥글게 하고 싶다면 */
  .my-rounded-button {
    border-radius: 10px !important;
  }
  @keyframes iconPop {
    0% { transform: scale(0.7); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  .custom-icon-animate {
    animation: iconPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;
document.head.appendChild(style);

//공용 알림창 구조 component

const baseConfig = {
  background: "#f9fbf8",
  backgroundColor: color("#2f5d3a").alpha(0.2).rgbString(),
  confirmButtonColor: "#2f5b3a",
  // 여기서 클래스를 지정하면 모든 알림창에 적용됨
  customClass: {
    popup: "my-rounded-popup",
    confirmButton: "my-rounded-button",
  },
};

// ------------------------------------------

// 1. 공통으로 사용할 로고 HTML (유지보수를 위해 변수화 추천)
// 이렇게 공용 함수를 만들지 않으면 로고 사이트 네임이 나오지 않음.
const brandLogoName = `
  <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 5px;">
    <img src="/favicon.svg" style="width: 60px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" />
    <span style="font-size: 50px; font-weight: bold; color: #2f5b3a;">탄소커넥트</span>
  </div>
`;

// 2. 오류 알림 함수 (이미지 속 오류 팝업 수정용)
export const errorAlert = async (title, text) => {
  await Swal.fire({
    ...baseConfig,
    title: brandLogoName, // 여기에 로고 HTML을 넣습니다.
    html: `
      <div style="text-align: center; padding: 10px 0;">
        <div class="custom-icon-animate" style="color: #f27474; font-size: 50px; width: 75px; height: 75px; 
                    border: 3px solid #f27474; border-radius: 50%; display: flex; 
                    align-items: center; justify-content: center; margin: 0 auto 20px auto;
                    box-shadow: 0 4px 15px rgba(242, 116, 116, 0.15);">
          &times;
        </div>
        <b style="font-size: 19px; color: #333; display: block; margin-bottom: 8px;">${title}</b>
        <span style="color: #666; font-size: 15px; line-height: 1.5;">${text ?? ""}</span>
      </div>
    `,
    // icon: "error", // 직접 구현했으므로 기본 아이콘은 주석 처리
    confirmButtonColor: "#2D5A27",
    showClass: { popup: "animate__animated animate__fadeIn animate__faster" },
  });
};

// 3. 성공 알림 함수 (기존 코드 유지 및 정렬 확인)
export const successAlert = async (title, text) => {
  await Swal.fire({
    ...baseConfig,
    title: brandLogoName,
    html: `
      <div style="text-align: center; padding: 10px 0;">
        <div class="custom-icon-animate" style="color: #a5dc86; font-size: 40px; width: 75px; height: 75px; 
                    border: 3px solid #a5dc86; border-radius: 50%; display: flex; 
                    align-items: center; justify-content: center; margin: 0 auto 20px auto;
                    box-shadow: 0 4px 15px rgba(165, 220, 134, 0.15);">
          ✓
        </div>
        <b style="font-size: 19px; color: #333; display: block; margin-bottom: 8px;">${title}</b>
        <span style="color: #666; font-size: 15px; line-height: 1.5;">${text ?? ""}</span>
      </div>
    `,
    // icon: "success", // 직접 구현했으므로 기본 아이콘은 주석 처리
    confirmButtonColor: "#2D5A27",
    showClass: { popup: "animate__animated animate__fadeIn animate__faster" },
  });
};
