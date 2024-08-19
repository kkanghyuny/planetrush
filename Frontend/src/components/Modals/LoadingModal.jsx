import Spinner from "../../assets/Spinner.gif";

const LoadingModal = () => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h4>잠시만 기다려 주세요.</h4>
        <img src={Spinner} alt="로딩중" width="10%" className="spinner" />
      </div>
    </div>
  );
};

export default LoadingModal;
