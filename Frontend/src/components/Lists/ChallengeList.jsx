import React from "react";
import { useNavigate } from "react-router-dom";

import ParticipantAlert from "../Foam/ParticipantAlertFoam";

import "../../styles/SearchPlanet.css";

const ChallengeList = ({ challenges, displayedChallenges }) => {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/planet/${id}`, { state: { displayedChallenges, from: '/search' } });
  };

  return (
    <ul className="results-list">
      {challenges.map((challenge) => {
        const hasParticipantAlert =
          challenge.currentParticipants === challenge.maxParticipants ||
          challenge.maxParticipants - challenge.currentParticipants === 1;

        return (
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
            <div
              className={`challenge-exp ${hasParticipantAlert ? "with-alert" : ""}`}
            >
              <ParticipantAlert
                currentParticipants={challenge.currentParticipants}
                maxParticipants={challenge.maxParticipants}
              />
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
        );
      })}
    </ul>
  );
};

export default ChallengeList;
