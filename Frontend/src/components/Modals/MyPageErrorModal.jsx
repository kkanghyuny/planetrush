import { useNavigate } from "react-router-dom";

const MyPageErrorModal = ({ isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h4>서버가 불안정합니다! 잠시 후에 다시 시도해주세요</h4>
        <button onClick={() => navigate("/main")}>메인으로</button>
      </div>
    </div>
  );
};

export default MyPageErrorModal;
