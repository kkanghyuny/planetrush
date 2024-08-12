import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";
import useStatisticsStore from "../../store/statisticsStore";

const NicknameEditModal = ({ nickname, isOpen, closeModal, saveNickname }) => {
  const [newNickname, setNewNickname] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const challengeCnt = useStatisticsStore((state) => state.challengeCnt); // challengeCnt 가져오기
  const completionCnt = useStatisticsStore((state) => state.completionCnt); // completionCnt 가져오기

  useEffect(() => {
    if (!isOpen) {
      setNewNickname("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (newNickname.length > 10) {
      alert("닉네임은 10자 이하로 입력해주세요.");
      setNewNickname("");
    } else {
      saveNickname(newNickname);
      Cookies.set('nickname', newNickname);
      closeModal();
    }
  };

  const handleUserDelete = async () => {
    try {
      const response = await instance.patch("/members/auth/exit");

      if (response.status === 200) {
        Cookies.remove('access-token');
        Cookies.remove('refresh-token');
        Cookies.remove('nickname');

        console.log('회원 탈퇴가 성공적으로 처리되었습니다.');
        closeModal(); 
      } else {
        console.log('회원 탈퇴 요청이 성공하지 않았습니다.');
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
    }
  };

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>닉네임 수정</h4>
        <input
          type="text"
          value={newNickname}
          className="nickname-input"
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder={nickname}
        />
        <button onClick={handleSave}>저장</button>
        <button onClick={closeModal}>취소</button>

        <h4>회원 탈퇴</h4>
        <p>지금까지 총 <strong>{challengeCnt}</strong>개의 챌린지에 도전했고, 그 중 <strong>{completionCnt}</strong>개를 성공하셨습니다.</p>
        <button onClick={handleOpenConfirm}>예</button>
        <button onClick={closeModal}>아니오</button>
      </div>

      {isConfirmOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>정말 탈퇴하시겠습니까?</h4>
            <button onClick={handleUserDelete}>예</button>
            <button onClick={handleCloseConfirm}>아니오</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NicknameEditModal;
