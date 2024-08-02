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
      <h1>마이 페이지</h1>

      <div className="top-container">
        <div onClick={handleClick} className="arrow-circle-icon">
          <BiSolidLeftArrowCircle />
        </div>
        <LogoutButton />
      </div>
      <div>
        {view === "statistics" ? (
          <button onClick={() => setView("collection")}>Show Collection</button>
        ) : (
          <button onClick={() => setView("statistics")}>Show Statistics</button>
        )}
      </div>
      <NicknameEditModal
        className="logout"
        nickname={nickname}
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        saveNickname={handleSaveNickname}
      />
      <p className="nickname">
        닉네임: {nickname}
        <BiSolidPencil className="pencil-icon" onClick={handleOpenModal} />
      </p>

      <div>
        {view === "statistics" && <MyStatistics />}
        {view === "collection" && <MyCollection />}
      </div>
    </>
  );
};

export default MyPage;
