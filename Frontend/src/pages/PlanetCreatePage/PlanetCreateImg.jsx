import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Canvas from "../../components/Canvas/Canvas";
import ChoosePlanet from "../../components/Canvas/ChoosePlanet";
import "../../styles/PlanetCreateImg.css"; // CSS 파일 import

function PlanetCreateImg() {
  const navigate = useNavigate();
  const [view, setView] = useState("default");
  const [selectedImage, setSelectedImage] = useState(
    "https://placehold.co/150x150"
  );
  const [savedImage, setSavedImage] = useState(null);

  //이미지를 props해서 받아오기 위함
  const [canvasRef, setCanvasRef] = useState(null);

  const [showAlert, setShowAlert] = useState(false); // 알림 상태 추가
  const [canvasData, setCanvasData] = useState(null); // 캔버스 데이터를 저장할 상태 추가

  const getNewPlanetInfo = () => {
    if (view === "custom" && !canvasData) {
      setShowAlert(true);
      return;
    }

    let imageToSend;

    if (view === "custom" && canvasRef) {
      // Canvas에서 그린 이미지 가져오기
      imageToSend = canvasRef.getCurrentCanvasImage();
    } else {
      // 선택된 기본 이미지 사용
      imageToSend = selectedImage;
    }
    navigate("/create-foam", { state: { savedImage: imageToSend } });
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
    setSavedImage(image);
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
        뒤로가기버튼
      </button>
      <h3>행성을 생성해주세요</h3>
      <button onClick={getNewPlanetInfo} className="create-button">
        생성하기
      </button>
      {showAlert && <div className="alert">그림을 그려주세요!</div>}{" "}
      {/* 알림 추가 */}
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
