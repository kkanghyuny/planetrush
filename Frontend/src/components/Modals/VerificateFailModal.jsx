import { useNavigate } from "react-router-dom";

const VerificateFailModal = ({ closeModal }) => {
  const navigate = useNavigate();

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>인증을 다시 시도해주세요!</h4>
        <button onClick={closeModal}>다시 인증하기</button>
      </div>
    </div>
  );
};

export default VerificateFailModal;
