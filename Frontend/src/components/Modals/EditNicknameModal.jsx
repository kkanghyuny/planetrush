import React, { useState, useEffect } from "react";

import Cookies from "js-cookie";

const NicknameEditModal = ({ nickname, isOpen, closeModal, saveNickname }) => {
  const [newNickname, setNewNickname] = useState("");

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
      Cookies.set('nickname', newNickname)
      closeModal();
    }
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
