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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePeopleCountChange = (increment) => {
    setPlanetInfo((prevState) => ({
      ...prevState,
      peopleCount: Math.min(Math.max(prevState.peopleCount + increment, 2), 10),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log(planetInfo);
    // Navigate to next page or show success message
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
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={planetInfo.category}
            onChange={handleInputChange}
          >
            <option value="">선택하세요</option>
            <option value="health">건강</option>
            <option value="study">학습</option>
            <option value="hobby">취미</option>
          </select>
        </div>
        <div className="form-group date-group">
          <label>기간</label>
          <div className="date-inputs">
            <input
              type="date"
              name="startDate"
              value={planetInfo.startDate}
              onChange={handleInputChange}
            />
            <input
              type="date"
              name="endDate"
              value={planetInfo.endDate}
              onChange={handleInputChange}
            />
          </div>
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
          <button type="button" className="upload-button">
            사진 찍으러가기
          </button>
        </div>
        <button type="submit" className="submit-button">
          창조하기
        </button>
      </form>
    </div>
  );
}

export default PlanetCreateForm;
