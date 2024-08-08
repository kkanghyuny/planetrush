import { useNavigate } from "react-router-dom";

const VerificateSuccessModal = () => {
  const navigate = useNavigate();

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>인증되었습니다! 화이팅!</h4>
        <button onClick={() => navigate("/main")}>다른 행성 가기</button>
      </div>
    </div>
  );
};

export default VerificateSuccessModal;
