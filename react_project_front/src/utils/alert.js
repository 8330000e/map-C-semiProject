import { color } from "chart.js/helpers";
import Swal from "sweetalert2";

const baseConfig = {
  background: "#f9fbf8",
  backgroundColor: color("#2f5d3a").alpha(0.2).rgbString(),
  confirmButtonColor: "#2f5b3a",
};

// 1. 공통으로 사용할 로고 HTML (유지보수를 위해 변수화 추천)
//이렇게 공용 함수를 만들지 않으면 로고 사이트 네임이 나오지 않음.
const brandLogoName = `
  <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
    <img src="/favicon.svg" style="width: 40px;" />
    <span style="font-size: 24px; font-weight: bold; color: #333;">탄소커넥트</span>
  </div>
`;

// 2. 오류 알림 함수 (이미지 속 오류 팝업 수정용)
export const errorAlert = async (title, text) => {
  await Swal.fire({
    ...baseConfig,
    title: brandLogoName, // 여기에 로고 HTML을 넣습니다.
    html: `
      <div style="text-align: center;">
        <b style="font-size: 18px; color: #d33;">${title}</b><br/>
        <span style="color: #666;">${text ?? ""}</span>
      </div>
    `,
    icon: "error",
    confirmButtonColor: "#2D5A27",
  });
};

// 3. 성공 알림 함수 (기존 코드 유지 및 정렬 확인)
export const successAlert = async (title, text) => {
  await Swal.fire({
    ...baseConfig,
    title: brandLogoName,
    html: `
      <div style="text-align: center;">
        <b style="font-size: 18px;">${title}</b><br/>
        <span style="color: #666;">${text ?? ""}</span>
      </div>
    `,
    icon: "success",
    confirmButtonColor: "#2D5A27",
  });
};
