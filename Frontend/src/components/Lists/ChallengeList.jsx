import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate를 사용
import "../../styles/SearchPlanet.css";
import '../../App.css';

// SearchPlanet.jsx 페이지의 리스트 컴포넌트를 따로 분리시켰다.
const ChallengeList = ({ challenges, displayedChallenges }) => {
  const navigate = useNavigate();

  // 현재 행성 그림이 안 나와서 그냥 리스트 클릭만 해도 상세 페이지로 넘어가게 설정함
  const handleItemClick = (id) => {
    navigate(`/planet/${id}`, { state: { displayedChallenges } }); // 상태 전달
  };

  return (
    <ul className="resultsList">
      {challenges.map((challenge) => (
        <div className = 'challengeList' key={challenge.planetId} onClick={() => handleItemClick(challenge.planetId)}>
          <div className = 'challengeImgArea'>
            <img
            className = 'challengeImg'
            src={challenge.planetImg || ''}
            alt={challenge.name}
            />
            <div className = 'participantsNumber'>
              {challenge.currentParticipants} / {challenge.maxParticipants}
            </div>
          </div>
          <div className='challengeExp'>
            <div className = 'nameBox'>
              <div className = "challengeCate">{challenge.category}</div>
              <div className = "challengeName">{challenge.name}</div>
            </div>
            <div className = "challengeContent">{challenge.content}</div>
            <div className = "challengeDate">{challenge.startDate} ~ {challenge.endDate}</div>
          </div>
        </div>
      ))}
    </ul>
  );
};

// Typescript 안 써서 propTypes로 타입 검사를 진행하였다.
ChallengeList.propTypes = {
  challenges: PropTypes.arrayOf(PropTypes.shape({
    planetId: PropTypes.number.isRequired,
    planetImg: PropTypes.string,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    currentParticipants: PropTypes.number.isRequired,
    maxParticipants: PropTypes.number.isRequired,
  })).isRequired,
  displayedChallenges: PropTypes.arrayOf(PropTypes.object).isRequired, // 추가된 propType
};

export default ChallengeList;
