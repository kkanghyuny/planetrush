import React from "react";
import { useNavigate } from "react-router-dom";

// 생성 성공한 모달
function CreatePlanetSuccess() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/main");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <img src={imageUrl} alt="행성사진" />
        <h4>${} 창조를 축하합니다!</h4>
        <button onClick={onClose}>다른 행성 보러가기</button>
      </div>
    </div>
  );
}

export default CreatePlanetSuccess;
