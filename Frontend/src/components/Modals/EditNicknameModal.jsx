// components/Modals/NicknameEditModal.jsx
import React, { useState } from "react";

const NicknameEditModal = ({ isOpen, closeModal, saveNickname }) => {
  const [newNickname, setNewNickname] = useState("");

  const handleSave = () => {
    saveNickname(newNickname);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>닉네임 수정</h2>
        <input
          type="text"
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          placeholder="새 닉네임 입력"
        />
        <button onClick={handleSave}>저장</button>
        <button onClick={closeModal}>취소</button>
      </div>
    </div>
  );
};

export default NicknameEditModal;
