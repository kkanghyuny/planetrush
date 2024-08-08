import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Canvas from "../../components/PlanetCreate/Canvas";
import ChoosePlanet from "../../components/PlanetCreate/ChoosePlanet";

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

  const getNewPlanetInfo = () => {
    const planetImg = {
      custumImg: null,
      planetImgUrl: selectedImage ? selectedImage.imgUrl : null,
    };

    if (view === "custom" && !canvasData) {
      setShowAlert(true);
      return;
    }

    if (view === "custom") {
      if (!canvasData) {
        setShowAlert(true);
        return;
      }

      planetImg.custumImg = canvasData; // canvas에서 만든 이미지 URL 사용
    } else {
      if (!selectedImage) {
        setShowAlert(true);
        return;
      }

      planetImg.planetImgUrl = selectedImage.imgUrl; // 선택된 이미지의 URL 사용
    }

    navigate("/create-foam", { state: { savedImage: planetImg } });
  };

  //view를 바꿀 수 있게함 (기본화면 - 고르기)
  const handleDefaultClick = () => {
    setView("default");
  };

  //커스텀 누르기
  const handleCustomClick = () => {
    setView("custom");
  };

  //고르기에서 이미지 선택시 선택된 이미지 뜨기
  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  //커스텀 url, file 저장
  const handleSaveImage = (url, file) => {
    setCanvasData(url);
    setCanvasFile(file);
  };

  //빈칸일때 알림
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

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
          <Canvas onSaveImage={handleSaveImage} setCanvasRef={setCanvasRef} />
        </div>
      )}
      {showAlert && <div className="alert">그림을 그려주세요!</div>}{" "}
      <button onClick={getNewPlanetInfo} className="create-button">
        생성하기
      </button>
    </div>
  );
};

export default PlanetCreateImg;
