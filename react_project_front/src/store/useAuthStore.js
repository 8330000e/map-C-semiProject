import axios from "axios";
import Swal from "sweetalert2";
import { create } from "zustand";
//middleware: 새로고침을 해도 로그인 상태 유지하게 해주는 기능
import { persist, createJSONStorage } from "zustand/middleware";

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

      // 안전한 로그인 함수
      //서버로부터 불려온 값을 업데이트 하여 저장.
      //1.로그인 시작
      login: ({
        memberId,
        memberGrade,
        memberThumb,
        token,
        endTime,
        memberNickname,
      }) => {
        set({
          memberId,
          memberGrade,
          memberThumb,
          token,
          endTime,
          memberNickname,
        });
        //타이머 예약 실행
        get().startLoginTimer(endTime);
      },

      //2. 로그아웃
      logout: () => {
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

      //3. 자동 로그아웃 타이머 로직
      startLoginTimer: (endTime) => {
        if (!endTime) return;

        const currentTime = new Date().getTime();
        const remainingTime = endTime - currentTime;

        if (remainingTime > 0) {
          // 이미 실행 중인 타이머가 있을 수 있으므로 클리어는 하지 않더라도,
          // 브라우저가 살아있는 동안 딱 한 번만 실행되게 함
          setTimeout(() => {
            get().logout();
            Swal.fire({
              title: "로그인 시간이 지났습니다",
              text: "세션이 만료되어 자동 로그아웃 되었습니다.",
              icon: "warning",
            });
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
          //새로고침 후 토큰이 있다면 axios 헤더 재설정 밎 타이머 재가동
          axios.defaults.headers.common["Authorization"] =
            `Bearer ${state.token}`;
          //타이머 재설정
          state.startLogoutTimer(state.endTime);
        }
      },
    },
  ),
);

export default useAuthStore;
