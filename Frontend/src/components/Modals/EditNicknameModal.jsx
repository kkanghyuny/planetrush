import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

const NicknameEditModal = ({ nickname, isOpen, closeModal, saveNickname, challengeCnt, completionCnt }) => {
  const [newNickname, setNewNickname] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // 회원 탈퇴 확인 모달 상태

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
        closeModal(); // 모달 닫기
      } else {
        console.log('회원 탈퇴 요청이 성공하지 않았습니다.');
      }
    } catch (error) {
      console.error('회원 탈퇴 중 오류가 발생했습니다:', error);
    }
  };

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true); // 회원 탈퇴 확인 모달 열기
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false); // 회원 탈퇴 확인 모달 닫기
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
        <p>탈퇴하시겠습니까?</p>
        <button onClick={handleOpenConfirm}>예</button>
        <button onClick={closeModal}>아니오</button>
      </div>

      {isConfirmOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>지금까지 총 <strong>{challengeCnt}</strong>개의 챌린지에 도전했고, 그 중 <strong>{completionCnt}</strong>개를 성공하셨습니다.</p>
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
