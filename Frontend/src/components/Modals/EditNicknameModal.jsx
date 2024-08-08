import React, { useState } from "react";

const NicknameEditModal = ({ nickname, isOpen, closeModal, saveNickname }) => {
  const [newNickname, setNewNickname] = useState("");

  const handleSave = () => {
    saveNickname(newNickname);
    closeModal();
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
      </div>
    </div>
  );
};

export default NicknameEditModal;
