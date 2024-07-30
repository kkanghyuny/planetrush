import React, { useState } from "react";
import ChallengeList from "../../components/Lists/ChallengeList"; // ChallengeList 컴포넌트 임포트
import challenges from "../SearchPage/challengesData"; // challenges 데이터 임포트
import LogoutButton from "../../components/Button/LogoutButton"; // 로그아웃 버튼 컴포넌트 임포트
import useUserStore from "../../store/userStore";
import { BiSolidPencil } from "react-icons/bi";
import NicknameEditModal from "../../components/Modals/EditNicknameModal"; // 닉네임 수정 모달 임포트
import Cookies from "js-cookie";
import axios from "axios";
import instance from "../AuthenticaitionPage/Axiosinstance";

function MyPage() {
  const { nickname, setNickname } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accessToken = Cookies.get("access-token");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveNickname = async (newNickname) => {
    try {
      console.log(accessToken);
      Cookies.set("nickname", newNickname, { secure: true, sameSite: 'Lax' });
      // 백엔드로 닉네임 업데이트
      await instance.patch(
        `/members/profile`, null, 
        {
          params: {
            'nickname': newNickname, // 쿼리 파라미터로 닉네임 전송
          },
          headers: {
            'Authorization': `${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      // 닉네임이 성공적으로 업데이트되면 상태 업데이트
      setNickname(newNickname);
      console.log("success: " + newNickname);
    } catch (error) {
      console.error("Error updating nickname:", error);
    }
  };

  return (
    <>
      <h1>마이 페이지</h1>
      <LogoutButton />
      <h3>행성 몇 개나 있을까?</h3>
      <p>
        닉네임: {nickname}
        <BiSolidPencil
          style={{ cursor: "pointer" }}
          onClick={handleOpenModal}
        />
      </p>
      <NicknameEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNickname}
      />
    </>
  );
}

export default MyPage;
