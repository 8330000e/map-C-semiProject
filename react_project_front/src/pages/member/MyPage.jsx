// 마이페이지 컴포넌트 파일입니다.

import { Route, Routes } from "react-router-dom";
import UpdateMyInfo from "../../components/mypage/UpdateMyInfo";
import MyBoard from "../../components/mypage/MyBoard";
import MyLikeBoard from "../../components/mypage/MyLikeBoard";
import MemberTip from "../../components/mypage/MemberTip";
import LeaveMember from "../../components/mypage/LeaveMember";
import MyPoint from "../../components/mypage/MyPoint";
import ChangePw from "../../components/mypage/ChangePw";
import MyInformation from "../../components/mypage/MyInformation";
import styles from "./MyPage.module.css";
import useAuthStore from "../../store/useAuthStore.js";

// 현재는 비어 있으며, 추후 사용자 정보/활동 내역 화면을 구현할 예정입니다.
