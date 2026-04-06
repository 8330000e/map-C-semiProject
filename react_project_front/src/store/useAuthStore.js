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
        //다시 초기값 상태로 되돌림
        set({
          memberId: null,
          memberGrade: null,
          memberThumb: null,
          token: null,
          endTime: null,
          memberNickname: null,
        });
      },

      setReady: (ready) => {
        set({ isReady: ready });
      },
      setThumb: (thumb) => {
        set({ memberThumb: thumb });
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
