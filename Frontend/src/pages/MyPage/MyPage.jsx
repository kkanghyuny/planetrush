import React, { useState } from "react";
import instance from "../AuthenticaitionPage/Axiosinstance";

import Cookies from "js-cookie";

import useUserStore from "../../store/userStore";
import LogoutButton from "../../components/Button/LogoutButton"; // 로그아웃 버튼 컴포넌트 임포트
import NicknameEditModal from "../../components/Modals/EditNicknameModal"; // 닉네임 수정 모달 임포트

import { BiSolidPencil } from "react-icons/bi";

const MyPage = () => {
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
      Cookies.set("nickname", newNickname, { secure: true, sameSite: "Lax" });

      // 백엔드로 닉네임 업데이트
      await instance.patch(`/members/profile`, null, {
        params: {
          nickname: newNickname,
        },
        headers: {
          Authorization: `${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      setNickname(newNickname);
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
};

export default MyPage;
