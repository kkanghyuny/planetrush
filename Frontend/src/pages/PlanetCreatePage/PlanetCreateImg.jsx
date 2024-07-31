import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Canvas from "../../components/Canvas/Canvas";
import ChoosePlanet from "../../components/Canvas/ChoosePlanet";

import { BiSolidLeftArrowCircle } from "react-icons/bi";

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
  const [canvasFile, setCanvasFile] = useState(null); // 캔버스 이미지 파일 저장할 상태 추가

  const getNewPlanetInfo = () => {
    //전달할 행성이미지
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

  const handleSaveImage = (url, file) => {
    setCanvasData(url); // 캔버스 데이터 URL 저장
    setCanvasFile(file); // 캔버스 데이터 파일 저장
  };

  //빈칸일때 알림
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="container">
      <BiSolidLeftArrowCircle
        onClick={() => navigate(-1)}
        className="back-button"
      />
      <h3>행성을 생성해주세요</h3>
      <button onClick={getNewPlanetInfo} className="create-button">
        생성하기
      </button>
      {showAlert && <div className="alert">그림을 그려주세요!</div>}{" "}
      {view === "default" ? (
        <div>
          {selectedImage && (
            <div className="image-container">
              <img
                src={selectedImage.imgUrl}
                alt="Selected Planet"
                className="selected-image"
              />
            </div>
          )}
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
