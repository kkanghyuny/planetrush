import React from 'react';
import '../../styles/Modal.css';

// 사람이 꽉 차서 가입할 수 없는 경우
function JoinFailModal({ setIsJoinFailModalOpen, imageUrl }) {
  const handleCloseModal = () => {
    setIsJoinFailModalOpen(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <img src={imageUrl} alt="행성사진" />
        <h4>가입할 수 없습니다.</h4>
        <button onClick={handleCloseModal}>확인</button>
      </div>
    </div>
  );
}

export default JoinFailModal;
