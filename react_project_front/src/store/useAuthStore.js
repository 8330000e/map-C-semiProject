import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      memberId: null,

      memberGrade: null,
      memberThumb: null,
      token: null,
      endTime: null,
      isReady: false,
      memberNickname: null,

      // 안전한 로그인 함수
      //서버로부터 불려온 값을 업데이트 하여 저장.
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
      },

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
      partialize: (state) => {
        return {
          memberId: state.memberId,
          memberGrade: state.memberGrade,
          memberThumb: state.memberThumb,
          token: state.token,
          endTime: state.endTime,
          memberNickname: state.memberNickname,
        };
      },
    },
  ),
);

export default useAuthStore;
