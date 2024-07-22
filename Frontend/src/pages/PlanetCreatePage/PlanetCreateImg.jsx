import React, { useState } from "react";
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

  const getNewPlanetInfo = () => {
    navigate("/create-foam", { state: { savedImage } });
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

  const handleSaveImage = (image) => {
    setSavedImage(image);
  };

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="back-button">
        뒤로가기버튼
      </button>
      <h3>행성을 생성해주세요</h3>
      <button onClick={getNewPlanetInfo} className="create-button">
        생성하기
      </button>
      <div className="image-container">
        <img
          src={selectedImage}
          alt="Selected Planet"
          className="selected-image"
        />
      </div>
      {view === "default" ? (
        <div>
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
          <Canvas selectedImage={selectedImage} onSaveImage={handleSaveImage} />
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
