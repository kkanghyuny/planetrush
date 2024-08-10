import React from "react";
import { useNavigate } from "react-router-dom";

// 생성 성공한 모달
const CreatePlanetSuccess = ({ imageUrl, planetName }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/main");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <img src={imageUrl} alt="행성사진" />
        <h4>{planetName} 창조를 축하합니다!</h4>
        <button onClick={handleClick}>구경하기</button>
      </div>
    </div>
  );
};

export default CreatePlanetSuccess;
