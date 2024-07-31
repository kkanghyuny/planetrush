import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/PlanetCreateForm.css";

const PlanetCreateForm = () => {
  const navigate = useNavigate();

  //이미지 받아옴
  const location = useLocation();
  const { savedImage } = location.state || {};

  //행성 정보 받을 위치
  const [planetInfo, setPlanetInfo] = useState({
    name: "",
    content: "",
    category: "",
    startDate: "",
    endDate: "",
    maxParticipants: 2,
    authCond: "",
    missionFile: null,
    missionUrl: "",
    planetImgUrl: savedImage ? savedImage.planetImgUrl : "",
    planetImg: savedImage ? savedImage.custumImg : null,
  });

  //에러출력
  const [errors, setErrors] = useState({
    name: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    if (savedImage) {
      setPlanetInfo((prevState) => ({
        ...prevState,
        planetImgUrl: savedImage.planetImgUrl || "",
        planetImg: savedImage.custumImg || null,
      }));
    }
  }, [savedImage]);

  const handleInputChange = (e) => {
    const { key, value } = e.target;

    setPlanetInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    //이름 설정시
    if (key === "name" && value.length > 10) {
      setErrors((prevState) => ({
        ...prevState,
        key: "10자 이하로 적어주세요",
      }));
    } else if (key === "name") {
      setErrors((prevState) => ({
        ...prevState,
        key: "",
      }));
    }

    //챌린지명 설정시
    if (key === "content" && value.length > 20) {
      setErrors((prevState) => ({
        ...prevState,
        content: "20자 이하로 적어주세요",
      }));
    } else if (key === "content") {
      setErrors((prevState) => ({
        ...prevState,
        content: "",
      }));
    }
  };

  //인원수 체크
  const handlePeopleCountChange = (increment) => {
    setPlanetInfo((prevState) => ({
      ...prevState,
      maxParticipants: Math.min(
        Math.max(prevState.maxParticipants + increment, 2),
        10
      ),
    }));
  };

  //인증 사진 파일 업로드
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const missionUrl = URL.createObjectURL(file);

      setPlanetInfo((prevState) => ({
        ...prevState,
        missionFile: file,
        missionUrl: missionUrl,
      }));
    }
  };

  //인증 업로드 누르기 - 파일 업로드 창 띄우기
  const handleUploadButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  //유효 기간 체크
  const validateDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today || end < today) {
      setErrors((prevState) => ({
        ...prevState,
        date: "시작일과 종료일은 현재 날짜 이후여야 합니다.",
      }));

      return false;
    } else if (end - start < 5 * 24 * 60 * 60 * 1000) {
      setErrors((prevState) => ({
        ...prevState,
        date: "기간은 최소 5일 이상이어야 합니다.",
      }));

      return false;
    } else if (end - start > 10 * 24 * 60 * 60 * 1000) {
      setErrors((prevState) => ({
        ...prevState,
        date: "기간은 최대 10일이어야 합니다.",
      }));

      return false;
    } else {
      setErrors((prevState) => ({
        ...prevState,
        date: "",
      }));

      return true;
    }
  };

  const handleDateChange = (e) => {
    const { key, value } = e.target;

    setPlanetInfo((prevState) => ({
      ...prevState,
      [key]: value,
    }));

    if (key === "startDate" || key === "endDate") {
      validateDate(
        key === "startDate" ? value : planetInfo.startDate,
        key === "endDate" ? value : planetInfo.endDate
      );
    }
  };

  //제출하기 누르면
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!planetInfo.missionFile) {
      alert("인증 사진을 업로드해주세요.");
      return;
    }

    submitResult();
  };

  //최종제출
  const submitResult = () => {
    navigate("/result", { state: { planetInfo } });
  };

  return (
    <div className="planet-create-container">
      <h1>행성을 창조해주세요</h1>
      <form onSubmit={handleSubmit} className="planet-form">
        <div className="form-group">
          <label>행성 이름</label>
          <input
            type="text"
            name="name"
            value={planetInfo.name}
            onChange={handleInputChange}
            placeholder="10자 이내로 작성해주세요"
            maxLength={10}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label>챌린지명</label>
          <input
            type="text"
            name="content"
            value={planetInfo.content}
            onChange={handleInputChange}
            placeholder="20자 이내로 작성해주세요"
            maxLength={20}
          />
          {errors.content && <p className="error">{errors.content}</p>}
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <div id="category">
            <label>
              <input
                type="radio"
                name="category"
                value="EXERCISE"
                checked={planetInfo.category === "EXERCISE"}
                onChange={handleInputChange}
              />
              운동
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="LIFE"
                checked={planetInfo.category === "LIFE"}
                onChange={handleInputChange}
              />
              생활
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="BEAUTY"
                checked={planetInfo.category === "BEAUTY"}
                onChange={handleInputChange}
              />
              미용
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="STUDY"
                checked={planetInfo.category === "STUDY"}
                onChange={handleInputChange}
              />
              학습
            </label>
            <label>
              <input
                type="radio"
                name="category"
                value="ETC"
                checked={planetInfo.category === "ETC"}
                onChange={handleInputChange}
              />
              기타
            </label>
          </div>
        </div>
        <div className="form-group date-group">
          <label>기간</label>
          <div className="date-inputs">
            <input
              type="date"
              name="startDate"
              value={planetInfo.startDate}
              onChange={handleDateChange}
            />
            부터
            <input
              type="date"
              name="endDate"
              value={planetInfo.endDate}
              onChange={handleDateChange}
            />
            까지
          </div>
          {errors.date && <p className="error">{errors.date}</p>}
        </div>
        <div className="form-group people-count">
          <label>인원 수</label>
          <div className="count-control">
            <button type="button" onClick={() => handlePeopleCountChange(-1)}>
              -
            </button>
            <input
              type="number"
              name="peopleCount"
              value={planetInfo.maxParticipants}
              readOnly
            />
            <button type="button" onClick={() => handlePeopleCountChange(1)}>
              +
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>미션 조건</label>
          <input
            type="text"
            name="authCond"
            value={planetInfo.authCond}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>인증 사진 업로드</label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="upload-button"
            onClick={handleUploadButtonClick}
          >
            사진 찍으러가기
          </button>
          {planetInfo.missionUrl && (
            <img
              src={planetInfo.missionUrl}
              alt="선택된 사진"
              className="image-preview"
            />
          )}
        </div>
        <button type="submit" className="submit-button" onClick={submitResult}>
          창조하기
        </button>
      </form>
    </div>
  );
};

export default PlanetCreateForm;
