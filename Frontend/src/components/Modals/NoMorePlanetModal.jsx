import React from "react";

import { useNavigate } from "react-router-dom";

import "../../styles/Modal.css";

const NoMorePlanetModal = ({ setNoMorePlanetModalOpen }) => {
  const navigate = useNavigate()
  const handleCloseModal = () => {
    setNoMorePlanetModalOpen(false);
    navigate(-1)
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>은하의 최대 행성 수는 9개입니다!</h4>
        <button onClick={handleCloseModal}>확인</button>
      </div>
    </div>
  );
};

export default NoMorePlanetModal;
