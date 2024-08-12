const VerificateErrorModal = ({ closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h4>서버가 불안합니다! 다시 시도해주세요</h4>
        <button onClick={closeModal}>다시하기</button>
      </div>
    </div>
  );
};

export default VerificateErrorModal;
