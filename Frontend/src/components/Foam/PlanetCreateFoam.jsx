import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PlanetCreateForm.css";

function PlanetCreateForm() {
  const navigate = useNavigate();
  const [planetInfo, setPlanetInfo] = useState({
    name: "",
    challenge: "",
    category: "",
    startDate: "",
    endDate: "",
    peopleCount: 2,
    missionCondition: "",
    imageFile: null,
    imageUrl: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    challenge: "",
    date: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "name" && value.length > 10) {
      setErrors((prevState) => ({
        ...prevState,
        name: "10자 이하로 적어주세요",
      }));
    } else if (name === "name") {
      setErrors((prevState) => ({
        ...prevState,
        name: "",
      }));
    }

    if (name === "challenge" && value.length > 20) {
      setErrors((prevState) => ({
        ...prevState,
        challenge: "20자 이하로 적어주세요",
      }));
    } else if (name === "challenge") {
      setErrors((prevState) => ({
        ...prevState,
        challenge: "",
      }));
    }
  };

  const handlePeopleCountChange = (increment) => {
    setPlanetInfo((prevState) => ({
      ...prevState,
      peopleCount: Math.min(Math.max(prevState.peopleCount + increment, 2), 10),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPlanetInfo((prevState) => ({
        ...prevState,
        imageFile: file,
        imageUrl: imageUrl,
      }));
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log(planetInfo);
    // Navigate to next page or show success message
  };

  const validateDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const minDate = new Date();
    const maxDate = new Date();
    minDate.setDate(today.getDate() + 5);
    maxDate.setDate(today.getDate() + 10);

    if (start < today || end < today) {
      setErrors((prevState) => ({
        ...prevState,
        date: "시작일과 종료일은 현재 날짜 이후여야 합니다.",
      }));
      return false;
    } else if (end - start < 4 * 24 * 60 * 60 * 1000) {
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
    const { name, value } = e.target;
    setPlanetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "startDate" || name === "endDate") {
      validateDate(planetInfo.startDate, planetInfo.endDate);
    }
  };

  const submitResult = () => {
    navigate("/result");
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
            name="challenge"
            value={planetInfo.challenge}
            onChange={handleInputChange}
            placeholder="20자 이내로 작성해주세요"
            maxLength={20}
          />
          {errors.challenge && <p className="error">{errors.challenge}</p>}
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
            <input
              type="date"
              name="endDate"
              value={planetInfo.endDate}
              onChange={handleDateChange}
            />
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
              value={planetInfo.peopleCount}
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
            name="missionCondition"
            value={planetInfo.missionCondition}
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
          {planetInfo.imageUrl && (
            <img src={planetInfo.imageUrl} alt="선택된 사진" />
          )}
        </div>
        <button type="submit" className="submit-button" onClick={submitResult}>
          창조하기
        </button>
      </form>
    </div>
  );
}

export default PlanetCreateForm;
