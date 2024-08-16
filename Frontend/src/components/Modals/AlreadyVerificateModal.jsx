import React from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Modal.css";

const AlreadyVerificateModal = () => {
  const navigate = useNavigate();

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>이미 인증을 완료하였습니다!</h4>
        <button onClick={() => navigate("/main")}>돌아가기</button>
      </div>
    </div>
  );
};

export default AlreadyVerificateModal;

