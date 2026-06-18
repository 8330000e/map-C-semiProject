import axios from "axios";
import Swal from "sweetalert2";
import { create } from "zustand";
//middleware: 새로고침을 해도 로그인 상태 유지하게 해주는 기능
import { persist, createJSONStorage } from "zustand/middleware";
import { successAlert } from "../utils/alert";

// 스토어 외부에서 관리하거나 스토어 내부 변수로 관리
let alertTimer, logoutTimer;

const useAuthStore = create(
  persist(
    (set, get) => ({
      memberId: null,
      memberGrade: null,
      memberThumb: null,
      token: null,
      endTime: null,
      isReady: false,
      memberNickname: null,

      //타이머 정지 함수
      stopLoginTimer: () => {
        if (alertTimer) clearTimeout(alertTimer);
        if (logoutTimer) clearTimeout(logoutTimer);
      },

      // 안전한 로그인 함수
      // 1.로그인 시작(서버에서 준 정보를 그대로 저장)
      login: (data) => {
        set({
          memberId: data.memberId,
          memberGrade: data.memberGrade,
          memberThumb: data.memberThumb,
          token: data.token,
          endTime: data.endTime,
          memberNickname: data.memberNickname,
        });
        // data.token으로 수정 (기존 token 변수는 data 내부에 있음)
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        //타이머 예약 실행
        get().startLoginTimer(data.endTime);
      },

      // [추가] 토큰 연장 업데이트 함수
      updateToken: (newToken, newEndTime) => {
        // [중요] 기존 타이머를 먼저 멈춰야 함
        get().stopLoginTimer();

        set({
          token: newToken,
          endTime: newEndTime,
        });
        //받아온 새로운 토큰를 헤더에 넣기
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        // 새 만료 시간으로 타이머 다시 가동 (무한 연장 가능)
        get().startLoginTimer(newEndTime);
      },

      //2. 로그아웃
      logout: () => {
        get().stopLoginTimer(); // 로그아웃 시에도 타이머 정지
        // 상태 클리어 전에 현재 memberId 확보 - 모든 로그아웃 경로(수동/타이머만료/인터셉터)에서 로그 찍히게
        const currentId = get().memberId;
        if (currentId) {
          axios
            .post(
              `${import.meta.env.VITE_BACKSERVER}/members/logout/${currentId}`,
            )
            .catch(() => {}); // 토큰 만료 등 실패해도 무시 (로그용)
        }
        // 다시 초기값 상태로 되돌림
        set({
          memberId: null,
          memberGrade: null,
          memberThumb: null,
          token: null,
          endTime: null,
          memberNickname: null,
        });
        // axios 기본 인증 헤더도 제거함.
        delete axios.defaults.headers.common["Authorization"];
        // 로컬 저장소에 남아 있는 auth-key도 삭제함.
        localStorage.removeItem("auth-key");
      },

      //3. 자동 로그아웃 타이머 로직 (연장 팝업 포함)
      startLoginTimer: (endTime) => {
        if (!endTime) return;
        // [중요] 중복 실행 방지를 위해 이전 타이머 제거

        get().stopLoginTimer();

        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;

        // [핵심] 55분 시점에 팝업 실행 예약 (만료 5분 전)
        const aletTime = 5 * 60 * 1000; //5 * 60 * 1000

        // remainingTime가 5분보다 크다면, 5분 전에 팝업 실행
        if (remainingTime > aletTime) {
          const timeToAlert = remainingTime - aletTime;

          // ★ 포인트: alertTimer라는 변수에 담아주기. (번호표 보관)
          alertTimer = setTimeout(() => {
            // 사용자의 편의를 위해 알람 설정 및 예약
            //->get().token-> 토큰이 아직 현재 사용 중인지 확인-> 존재한다면 5분 남기고 알림창 뜨게 하기
            if (get().token) {
              Swal.fire({
                title: "로그인 연장",
                text: "로그아웃까지 5분 남았습니다. 연장하시겠습니까?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "연장할래요!",
                cancelButtonText: "아니오",
                confirmButtonColor: "#5b7252",
              }).then((result) => {
                if (result.isConfirmed) {
                  // 연장 버튼 누를 때만 비동기 통신 발생
                  axios
                    //members/refresh는 페이지가 아니라 백그라운드에서 조용히 데이터만 주고받는 **'API 엔드포인트(기능)
                    //-> 쉽게 말하자면 어떤 보이는게 아닌 axios가 몰래 서버에게 토큰과 만료시간을 연장해줄 것을 요청하는 통로
                    .post(
                      `${import.meta.env.VITE_BACKSERVER}/members/refresh`,
                      {
                        memberId: get().memberId, // 여기에 데이터를 넣고 괄호를 닫아야 함
                      },
                    )
                    .then((res) => {
                      // 성공 시 로직
                      get().updateToken(res.data.token, res.data.endTime);
                      successAlert("연장 완료", "연장은 완료된 상태입니다.");
                    })
                    .catch(() => get().logout());
                }
              });
            }
          }, timeToAlert); // setTimeout 닫기 위치 수정
        }

        // 만료 시 자동 로그아웃 (기존 유지)
        if (remainingTime > 0) {
          // ★ 포인트: logoutTimer라는 변수에 담아주기. (번호표 보관)
          logoutTimer = setTimeout(() => {
            // 이미 로그아웃된 상태라면 실행 방지
            if (get().token) {
              get().logout();
              Swal.fire({
                title: "로그인 시간이 지났습니다",
                text: "세션이 만료되어 자동 로그아웃 되었습니다.",
                icon: "warning",
              });
            }
          }, remainingTime);
        } else {
          //이미 시간이 지난 경우 즉시 로그아웃
          get().logout();
        }
      },
      //isReady는 로그인 상태가 초기화되는 것을 방지하기 위한 설정.
      // 로그인 상태가 유지되는 동안 isReady는 true로 설정되고, 새로고침 시 초기화되어 false로 설정됨.
      // 이를 통해 로그인 상태가 유지되는 동안 isReady는 true로 설정되고,
      //  새로고침 시 초기화되어 false로 설정됨.
      //localStorage에서 데이터를 불러오는데 시간이 살짝 걸림. -> 근데 실제로는 로그인 되어있음
      //로그인 상태인데도 로그 아웃처럼 보이는 버그 발생.
      //따라서 isReady를  사용함. -> 즉 버퍼링으로 인한 피해 최소화
      setReady: (ready) => {
        set({ isReady: ready });
      },
      setThumb: (thumb) => {
        set({ memberThumb: thumb });
      },
      setNickname: (memberNickname) => {
        set({ memberNickname });
      },
    }),

    //새로고침해도 로그인 상태 유지하게 해주는 기능
    {
      name: "auth-key",
      storage: createJSONStorage(() => localStorage),
      //새로고침해도 저장할 데이터를 선택
      //->6개 데이터중 5개만 저장하고 계속 저장하고 isReady는 새로고침시 초기화하기위한 설정
      //partialize를 설정하지 않으면 모든 정보를 브라우저에 계속 저장.

      //기존 방식은 return을 사용했지만
      //화살표 함수에서 객체를 바로 반환하는 (state) => ({ ... }) 사용
      //onRehydrateStorage: () => (state) => 이 로직이 실행가능
      //==>

      partialize: (state) => ({
        memberId: state.memberId,
        memberGrade: state.memberGrade,
        memberThumb: state.memberThumb,
        token: state.token,
        endTime: state.endTime,
        memberNickname: state.memberNickname,
      }),
      //4. 새로고침시  persist가 데이터를 복구하 후 실행되는 함수
      //partialize 괄호 밖, persist 설정 객체 안에 위치해야 한다.
      // 이로직의 특징==>
      // 로그인시에도 타이머가 돌고, 새로고침을 하더라도 onRehydrateStorage가
      //남은 시간을 계산해 다시 타이머를 맞추는 역할.
      onRehydrateStorage: () => (state) => {
        if (state) {
          //1.데이터 복구가 완료된 후, isReady를 true로 설정
          //만약 isReady가 없다면, 사용자는 새로고침할 때마다 로그인이 되어 있음에도 불구하고 아주 짧은 순간(0.01초) 동안 "로그인 버튼"이 보였다가
          // 갑자기 "로그아웃 버튼"으로 바뀌는 깜빡임 현상이 발생
          //왜냐하면 리엑트의 속도와 로컬스토리지에서 데이터를 읽어오는 과정과 차이가 있기 떄문
          state.setReady(true);
        }

        if (state.token) {
          //새로고침 후 토큰이 있다면 axios 헤더 재설정 및 타이머 재가동
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${state.token}`;
          //타이머 재설정
          state.startLoginTimer(state.endTime);
        }
      },
    },
  ),
);

export default useAuthStore;
//Zustand 같은 상태 관리 도구는 상태가 변할 때마다 함수들이 재실행되는데,
// setTimeout은 브라우저 메모리에 별도로 예약되는 녀석이라 직접 찾아서 꺼주지 않으면 절대 스스로 멈추지 않는다
