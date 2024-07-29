import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../styles/PlanetResult.css";
import axios from "axios";
import instance from "../AuthenticaitionPage/Axiosinstance";
import CreatePlanetSuccess from "../../components/Modals/CreatePlanetSuccess";

function PlanetResult() {
  const navigate = useNavigate();
  const location = useLocation(); //url 정보 가져오는 함수
  const { planetInfo } = location.state || {}; //받아온 정보

  //모달용 상태
  const [isSuccess, setIsSuccess] = useState(null);

  const handleSumbit = async () => {
    // JSON 데이터 전송
    try {
      const formdata = new FormData();

      formdata.append(
        "json",
        JSON.stringify({
          name: planetInfo.name,
          content: planetInfo.content,
          category: planetInfo.category,
          startDate: planetInfo.startDate,
          endDate: planetInfo.endDate,
          maxParticipants: planetInfo.maxParticipants,
          authCond: planetInfo.authCond,
          defaultImgId: planetInfo.defaultImgId,
        })
      );

      if (planetInfo.missionFile) {
        //미션인증사진
        formdata.append("verificationImage", planetInfo.missionFile);
      }
      if (planetInfo.planetImg) {
        formdata.append("planetImage", planetInfo.planetImg);
      }

      const response = await instance.post(`/planets`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      <button onClick={() => navigate(-1)} className="back-button">
        뒤로가기버튼
      </button>
      <h1>행성 결과</h1>
      <div className="planet-details">
        {planetInfo.planetImg && (
          <div className="image-container">
            <img
              src={planetInfo.planetImg}
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
      {isSuccess === true && <CreatePlanetSuccess />}
      {isSuccess === false && (
        <CreatePlanetFail onClose={() => setIsSuccess(null)} />
      )}
    </div>
  );
}

export default PlanetResult;
