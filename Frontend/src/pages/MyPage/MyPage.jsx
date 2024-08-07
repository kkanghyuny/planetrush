import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";

import useUserStore from "../../store/userStore";
import LogoutButton from "../../components/Button/LogoutButton";
import NicknameEditModal from "../../components/Modals/EditNicknameModal";
import MyCollection from "../../components/Foam/MyCollectionFoam";
import MyStatistics from "../../components/Foam/MyStatisticsFoam";

import { BiSolidPencil, BiSolidLeftArrowCircle } from "react-icons/bi";
import "../../styles/Mypage.css";

const MyPage = () => {
  const navigate = useNavigate();
  const { nickname, setNickname } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("statistics");

  const handleClick = () => {
    navigate("/main");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveNickname = async (newNickname) => {
    try {
      // 백엔드로 닉네임 업데이트
      await instance.patch(`/members/profile`, null, {
        params: {
          nickname: newNickname,
        },
      });

      setNickname(newNickname);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <div className="top-container">
        <div onClick={handleClick} className="arrow-circle-icon">
          <BiSolidLeftArrowCircle />
        </div>
        <LogoutButton />
      </div>
      <div className="my-info">
        {view === "statistics" ? (
          <button className="info-button" onClick={() => setView("collection")}>
            내 콜렉션 보기
          </button>
        ) : (
          <button className="info-button" onClick={() => setView("statistics")}>
            내 통계 보기
          </button>
        )}
      </div>
      <NicknameEditModal
        className="logout"
        nickname={nickname}
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        saveNickname={handleSaveNickname}
      />
      <h2 className="nickname">
        {nickname}
        <BiSolidPencil className="pencil-icon" onClick={handleOpenModal} />
      </h2>

      <div className="my-page">
        {view === "statistics" && <MyStatistics />}
        {view === "collection" && <MyCollection />}
      </div>
    </>
  );
};

export default MyPage;
