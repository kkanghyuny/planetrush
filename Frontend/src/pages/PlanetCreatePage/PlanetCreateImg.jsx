import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Canvas from "../../components/Canvas/Canvas";
import ChoosePlanet from "../../components/Canvas/ChoosePlanet";
import "../../styles/PlanetCreateImg.css"; // CSS 파일 import

function PlanetCreateImg() {
  const navigate = useNavigate();
  const [view, setView] = useState("default");

  //선택된 이미지
  const [selectedImage, setSelectedImage] = useState(null);

  //이미지를 props해서 받아오기 위함
  const [canvasRef, setCanvasRef] = useState(null);

  const [showAlert, setShowAlert] = useState(false); // 알림 상태 추가
  const [canvasData, setCanvasData] = useState(null); // 캔버스 데이터를 저장할 상태 추가

  const getNewPlanetInfo = () => {
    const planetImg = {
      imageToSend: null,
      defaultImgId: 1,
    };

    if (view === "custom" && !canvasData) {
      setShowAlert(true);
      return;
    }

    if (view === "custom") {
      planetImg.imageToSend = canvasData;
    } else {
      planetImg.imageToSend = selectedImage.url;
      planetImg.defaultImgId = selectedImage.id;
    }

    if (!planetImg.imageToSend) {
      setShowAlert(true);
      return;
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

  const handleSaveImage = (image) => {
    setCanvasData(image); // 캔버스 데이터 저장
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="back-button">
        뒤로가기
      </button>
      <h3>행성을 생성해주세요</h3>
      <button onClick={getNewPlanetInfo} className="create-button">
        생성하기
      </button>
      {showAlert && <div className="alert">그림을 그려주세요!</div>}{" "}
      {view === "default" ? (
        <div>
          <div className="image-container">
            <img
              src={selectedImage}
              alt="Selected Planet"
              className="selected-image"
            />
          </div>
          <div className="button-container">
            <button onClick={handleDefaultClick} className="tab-button">
              고르기
            </button>
            <button onClick={handleCustomClick} className="tab-button">
              커스텀
            </button>
          </div>
          <ChoosePlanet onSelectImage={handleImageSelect} />
        </div>
      ) : (
        <div>
          <Canvas onSaveImage={handleSaveImage} setCanvasRef={setCanvasRef} />
          <div className="button-container">
            <button onClick={handleDefaultClick} className="tab-button">
              고르기
            </button>
            <button onClick={handleCustomClick} className="tab-button">
              커스텀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanetCreateImg;
