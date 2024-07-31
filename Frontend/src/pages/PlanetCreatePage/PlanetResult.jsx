import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import instance from "../AuthenticaitionPage/Axiosinstance";
import CreatePlanetSuccess from "../../components/Modals/CreatePlanetSuccess";

import "../../styles/PlanetResult.css";
import { BiSolidLeftArrowCircle } from "react-icons/bi";

const PlanetResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planetInfo } = location.state || {};

  const [isSuccess, setIsSuccess] = useState(null);

  console.log(planetInfo);

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
      if (planetInfo.custumImg) {
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
      console.error("There was an error!", error);
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
      <h1>행성 결과</h1>
      <div className="planet-details">
        {planetInfo.planetImg && (
          <div className="image-container">
            <img
              src={planetInfo.planetImgUrl}
              alt="행성 이미지"
              className="planet-image"
            />
          </div>
        )}
        <p>행성 이름: {planetInfo.name}</p>
        <p>챌린지명: {planetInfo.content}</p>
        <p>카테고리: {planetInfo.category}</p>
        <p>
          기간: {planetInfo.startDate}부터 {planetInfo.endDate}까지
        </p>
        <p>인원 수: {planetInfo.maxParticipants}명</p>
        <p>미션 조건: {planetInfo.authCond}</p>
        <img
          src={planetInfo.missionUrl}
          alt="미션인증사진"
          className="planet-mission"
        />
      </div>
      <p>생성 후 수정이 불가능합니다</p>
      <p>정말 새로운 행성의 개척자가 맞으신가요?</p>
      <button onClick={() => handleSumbit()}>맞습니다</button>
      {isSuccess === true && (
        <CreatePlanetSuccess imageUrl={planetInfo.planetImg} />
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
