import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import instance from "../AuthenticaitionPage/Axiosinstance";
import CreatePlanetSuccess from "../../components/Modals/CreatePlanetSuccessModal";

import "../../styles/PlanetResult.css";
import { BiSolidLeftArrowCircle } from "react-icons/bi";

const PlanetResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planetInfo } = location.state || {};

  const [isSuccess, setIsSuccess] = useState(null);

  //생성하기 axios
  const handleSumbit = async () => {
    try {
      const formdata = new FormData();

      const request = {
        name: planetInfo.name,
        content: planetInfo.content,
        category: planetInfo.category,
        startDate: planetInfo.startDate,
        endDate: planetInfo.endDate,
        maxParticipants: planetInfo.maxParticipants,
        authCond: planetInfo.authCond,
        planetImgUrl: planetInfo.planetImgUrl,
      };

      formdata.append(
        "req",
        new Blob([JSON.stringify(request)], {
          type: "application/json",
        })
      );

      //미션인증사진
      if (planetInfo.missionFile) {
        formdata.append("stdVerificationImg", planetInfo.missionFile);
      }

      //커스텀행성이면 넣어줘
      if (planetInfo.planetImg) {
        formdata.append("customPlanetImg", planetInfo.planetImg);
      }

      const response = await instance.post(`/planets`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 5000,
      });

      if (response.status === 200) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
    }
  };

  if (!planetInfo) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <div className="planet-result-container">
      <BiSolidLeftArrowCircle
        onClick={() => navigate(-1)}
        className="back-button"
      />
      <h3>행성을 확인해주세요</h3>
      <div className="planet-details">
        {(planetInfo.planetImg || planetInfo.planetImgUrl) && (
          <img
            src={
              planetInfo.planetImg
                ? URL.createObjectURL(planetInfo.planetImg)
                : planetInfo.planetImgUrl
            }
            alt="행성 이미지"
            className="planet-image"
          />
        )}
        <p className="planet-info-title">{planetInfo.name} 행성</p>
        <p className="planet-info-title">"{planetInfo.content}"를 도전합니다</p>
        <p className="planet-info">
          {planetInfo.startDate}부터 {planetInfo.endDate}까지
        </p>
        <p className="planet-info">최대 {planetInfo.maxParticipants}명</p>
        <div className="mission-container">
          <p className="planet-info">{planetInfo.authCond}</p>
          <img
            src={planetInfo.missionUrl}
            alt="미션인증사진"
            className="planet-mission"
          />
        </div>
      </div>
      <p className="warning-cyan">생성 후 수정이 불가능합니다</p>
      <p className="warning-white">정말 새로운 행성의 개척자가 맞으신가요?</p>
      <button className="create-planet-yes" onClick={() => handleSumbit()}>
        맞습니다
      </button>
      {isSuccess === true && (
        <CreatePlanetSuccess imageUrl={planetInfo.planetImgUrl} />
      )}
      {isSuccess === false && (
        <CreatePlanetFail
          imageUrl={planetInfo.planetImgUrl}
          planetName={planetInfo.name}
          onClose={() => setIsSuccess(null)}
        />
      )}
    </div>
  );
};

export default PlanetResult;
