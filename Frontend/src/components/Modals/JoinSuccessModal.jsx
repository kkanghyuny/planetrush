import React from "react";

// 가입 성공한 경우 모달
const JoinSuccessModal = ({ setIsJoinSuccessModalOpen, imageUrl }) => {
  const handleCloseModal = () => {
    setIsJoinSuccessModalOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <img src={imageUrl} alt="행성사진" />
        <h4>행성에 가입하셨습니다!</h4>
        <button onClick={handleCloseModal}>확인</button>
      </div>
    </div>
  );
};

export default JoinSuccessModal;
