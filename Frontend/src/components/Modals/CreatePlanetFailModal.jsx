import React from "react";
import { useNavigate } from "react-router-dom";

// 생성 오류난 모달
const CreatePlanetSuccess = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/main");
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>행성 생성 중 오류가 발생했습니다!</h4>
        <button onClick={handleClick}>닫기</button>
      </div>
    </div>
  );
};

export default CreatePlanetSuccess;
