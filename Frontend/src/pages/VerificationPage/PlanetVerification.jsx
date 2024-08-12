import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

import VerificateSuccessModal from "../../components/Modals/VerificateSuccessModal";
import VerificateFailModal from "../../components/Modals/VerificateFailModal";
<<<<<<< HEAD
import VerificateErrorModal from "../../components/Modals/VerificateErrorModal";
=======
>>>>>>> e74d78f1b3864b2ef261447073ffc350599126ba

import { BiSolidImageAlt } from "react-icons/bi";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import "../../styles/PlanetVerification.css";

const PlanetVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    content,
    id: planetId,
    standardVerificationImg: standardVerificationImg,
  } = location.state;

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
<<<<<<< HEAD
  const [isError, setIsError] = useState(false); // 에러 상태 추가
=======
>>>>>>> e74d78f1b3864b2ef261447073ffc350599126ba

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImageFile(file);
      setSelectedImageUrl(imageUrl);
    }
  };

  const handleVerification = async () => {
    const verifyImg = new FormData();
    verifyImg.append("verificationImg", selectedImageFile);

    try {
      const response = await instance.post(
        `/verify/planets/${planetId}`,
        verifyImg,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data.data;

      if (data.isVerified) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setIsError(true); // 에러 발생 시 상태 업데이트
    }

    setModalIsOpen(true); //다 하고 나서 띄운다!
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsError(false); // 에러 상태 초기화
  };

  return (
    <div>
      <div>
        <div className="back-button">
          <BiSolidLeftArrowCircle onClick={() => navigate(-1)} />
        </div>
        <div className="verificate-screen">
          <h3>{content}</h3>
          <div className="upload-foam">
            {!selectedImageUrl ? (
              <label htmlFor="upload-input" className="upload-label">
                <BiSolidImageAlt size={50} />
                <span>인증 기준 사진 올리기</span>
                <input
                  id="upload-input"
                  type="file"
                  accept=".jpg, .png, .jpeg"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="upload-input"
                />
              </label>
            ) : (
              <img
                src={selectedImageUrl}
                alt="Uploaded"
                className="uploaded-image"
              />
            )}
          </div>

          <div className="verification-standard-image">
            <p>인증 기준 사진과 같은 구도로 찍어주세요</p>
            <img
              src={standardVerificationImg}
              alt="Verification Standard"
              className="verification-standard-img"
            />
          </div>

          {selectedImageUrl && (
            <div className="buttons">
              <button
                className="verificate-upload-button"
                onClick={handleVerification}
              >
                인증하기
              </button>
              <button
                className="verificate-upload-button"
                onClick={() => setSelectedImageUrl(null)}
              >
                다시 찍기
              </button>
            </div>
          )}
        </div>
      </div>
      {modalIsOpen &&
        !isError &&
        (isSuccess ? (
          <VerificateSuccessModal />
        ) : (
          <VerificateFailModal closeModal={closeModal} />
        ))}
      {modalIsOpen && isError && (
        <VerificateErrorModal closeModal={closeModal} />
      )}
    </div>
  );
};

export default PlanetVerification;
