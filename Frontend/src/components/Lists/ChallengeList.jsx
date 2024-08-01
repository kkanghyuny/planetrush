import React from "react";
import { useNavigate } from "react-router-dom"; // useHistory 대신 useNavigate를 사용

import "../../styles/SearchPlanet.css";

// SearchPlanet.jsx 페이지의 리스트 컴포넌트를 따로 분리시켰다.
const ChallengeList = ({ challenges, displayedChallenges }) => {
  const navigate = useNavigate();

  // 현재 행성 그림이 안 나와서 그냥 리스트 클릭만 해도 상세 페이지로 넘어가게 설정함
  const handleItemClick = (id) => {
    navigate(`/planet/${id}`, { state: { displayedChallenges } }); // 상태 전달
  };

  return (
    <ul className="results-list">
      {challenges.map((challenge) => (
        <div
          className="challenge-list"
          key={challenge.planetId}
          onClick={() => handleItemClick(challenge.planetId)}
        >
          <div className="challenge-img-area">
            <img
              className="challenge-img"
              src={challenge.planetImg || ""}
              alt={challenge.name}
            />
            <div className="participants-number">
              {challenge.currentParticipants} / {challenge.maxParticipants}
            </div>
          </div>
          <div className="challenge-exp">
            <div className="name-box">
              <div className="challenge-cate">{challenge.category}</div>
              <div className="challenge-name">{challenge.name}</div>
            </div>
            <div className="challenge-content">{challenge.content}</div>
            <div className="challenge-date">
              {challenge.startDate} ~ {challenge.endDate}
            </div>
          </div>
        </div>
      ))}
    </ul>
  );
};

export default ChallengeList;
