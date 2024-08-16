import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Canvas from "../../components/PlanetCreate/Canvas";
import ChoosePlanet from "../../components/PlanetCreate/ChoosePlanet";
import NoMorePlanetModal from "../../components/Modals/NoMorePlanetModal";

import { BiSolidLeftArrowCircle } from "react-icons/bi";
import "../../styles/PlanetCreateImg.css";

const PlanetCreateImg = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("default");

  //선택된 이미지
  const [selectedImage, setSelectedImage] = useState(null);

  //이미지를 props해서 받아오기 위함
  const [canvasRef, setCanvasRef] = useState(null);

  //캔버스 상태변화에 따른 알림, 저장
  const [showAlert, setShowAlert] = useState(false);
  const [canvasData, setCanvasData] = useState(null);
  const [canvasFile, setCanvasFile] = useState(null);

  //캔버스 유효성 검사
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);

  const [NoMorePlanetModalOpen, setNoMorePlanetModalOpen] = useState(false);

  // 로컬 스토리지에서 challengeCount를 불러와서 모달을 열기
  useEffect(() => {
    const storedChallengeCount = localStorage.getItem("challengeCount");
    const parsedChallengeCount = storedChallengeCount ? JSON.parse(storedChallengeCount) : 0;

    if (parsedChallengeCount >= 9) {
      setNoMorePlanetModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const getNewPlanetInfo = () => {
    const planetImg = {
      custumImg: null,
      planetImgUrl: selectedImage ? selectedImage.imgUrl : null,
    };

    if (view === "custom") {
      if (isCanvasEmpty) {
        setShowAlert(true);
        return;
      }

      if (canvasData) {
        planetImg.custumImg = canvasData;
      }
    } else {
      if (!selectedImage) {
        setShowAlert(true);
        return;
      }
      planetImg.planetImgUrl = selectedImage.imgUrl;
    }

    navigate("/create-foam", { state: { savedImage: planetImg } });
  };

  const handleDefaultClick = () => {
    setView("default");
  };

  const handleCustomClick = () => {
    setView("custom");
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleSaveImage = (url, file) => {
    setCanvasData(url);
    setCanvasFile(file);
  };

  const handleCanvasStateChange = (isEmpty) => {
    setIsCanvasEmpty(isEmpty);
  };

  return (
    <div className="img-container">
      <BiSolidLeftArrowCircle
        onClick={() => navigate(-1)}
        className="back-button"
      />
      <h3>행성을 생성해주세요</h3>
      <div className="button-container">
        <p
          onClick={handleDefaultClick}
          className={`tab-button ${view === "default" ? "active" : ""}`}
        >
          기본 모드
        </p>
        <p
          onClick={handleCustomClick}
          className={`tab-button ${view === "custom" ? "active" : ""}`}
        >
          커스텀 모드
        </p>
      </div>
      {view === "default" ? (
        <div className="choose-img-container">
          {selectedImage && (
            <div className="image-container">
              <img
                src={selectedImage.imgUrl}
                alt="Selected Planet"
                className="selected-image"
              />
            </div>
          )}
          <div className="img-button-container">
            <ChoosePlanet selectImage={handleImageSelect} />
          </div>
        </div>
      ) : (
        <div>
          <Canvas
            onCanvasStateChange={handleCanvasStateChange}
            onSaveImage={handleSaveImage}
            setCanvasRef={setCanvasRef}
          />
        </div>
      )}
      {showAlert && <div className="alert">그림을 그려주세요!</div>}{" "}
      <button onClick={getNewPlanetInfo} className="create-button">
        창조하기
      </button>
      {NoMorePlanetModalOpen && (
        <NoMorePlanetModal
          setNoMorePlanetModalOpen={setNoMorePlanetModalOpen}
        />
      )}
    </div>
  );
};

export default PlanetCreateImg;
