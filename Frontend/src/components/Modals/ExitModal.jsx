import React from "react";

import "../../styles/Modal.css";

// 가입 탈퇴 시 등장하는 모달
const ExitModal = ({ setIsExitModalOpen, imageUrl }) => {
  // 탈퇴 모달 다시 비활성화
  const handleCloseModal = () => {
    setIsExitModalOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <img src={imageUrl} alt="행성사진" />
        <h4>가입 취소되었습니다.</h4>
        <button onClick={handleCloseModal}>확인</button>
      </div>
    </div>
  );
};

export default ExitModal;
