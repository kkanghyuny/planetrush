import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import JoinSuccessModal from '../../components/Modals/JoinSuccessModal';
import JoinFailModal from '../../components/Modals/JoinFailModal';
import ExitModal from '../../components/Modals/ExitModal';
import '../../styles/Modal.css';
import challenges from '../SearchPage/challengesData';

// 모집 중인 행성의 세부 정보를 표시하고 관리하는 메인 컴포넌트
function PlanetDetailRecruiting() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  // 모달 3세트: 가입 성공, 가입 탈퇴, 가입 불가
  const [isJoinSuccessModalOpen, setIsJoinSuccessModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isJoinFailModalOpen, setIsJoinFailModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [currentParticipants, setCurrentParticipants] = useState(null);

  // navigate(`/planet/${id}`, { state: { displayedChallenges } }); 
  // 리스트 컴포넌트에서 이거 받아온 거라고 생각하면 된다.
  const { displayedChallenges } = location.state || {};

  const planet = displayedChallenges?.find((challenge) => challenge.planetId === parseInt(id));

  // 현재 참여 인원에 따라 modal을 띄울 경우를 나누었다.
  useEffect(() => {
    if (planet && currentParticipants === null) {
      setCurrentParticipants(planet.currentParticipants);
    }
  }, [planet, currentParticipants]);

  // 행성이 없는 경우
  if (!planet) {
    return <div>행성을 찾을 수 없습니다.</div>;
  }

  const handleButtonClick = () => {
    setImageUrl(planet.planetImg);

    // 1. 가입 인원이 전부 찬 경우
    if (currentParticipants === planet.maxParticipants && !isJoined) {
      setIsJoinFailModalOpen(true);
      return;
    }

    // 2. 이미 가입한 경우 / 가입을 아직 안 한 경우
    if (isJoined) {
      setIsJoined(false);
      setIsExitModalOpen(true);
      setCurrentParticipants(currentParticipants - 1);
    } else {
      setIsJoined(true);
      setIsJoinSuccessModalOpen(true);
      setCurrentParticipants(currentParticipants + 1);
    }
  };

  // displayChallenges를 기준으로 받아왔기 때문에 이미 기준에 의해 필터링된 데이터들이 객체로 묶여있을거다.
  // 그래서 주소를 planet/:id로 해도 prev / next 실행 시 객체 내 다음 배열로 넘어가게 할 수 있었던 것
  const navigateToPlanet = (direction) => {
    // url 매개변수 id를 정수형으로 변환하여 비교하려고 parseInt 사용
    const currentIndex = displayedChallenges.findIndex((challenge) => challenge.planetId === parseInt(id));
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : displayedChallenges.length - 1;
    } else if (direction === 'next') {
      newIndex = currentIndex < displayedChallenges.length - 1 ? currentIndex + 1 : 0;
    }

    const newPlanetId = displayedChallenges[newIndex].planetId;
    navigate(`/planet/${newPlanetId}`, { state: { displayedChallenges } });
  };

  return (
    <>
      <div>
        <div>{planet.category}</div>
        <div>{`${planet.startDate} ~ ${planet.endDate}`}</div>
      </div>
      <div>{planet.content}</div>
      <div>{currentParticipants}</div>
      <div>{planet.maxParticipants}</div>
      <img src={planet.planetImg} alt="행성사진" />
      <div>
        <button onClick={() => navigateToPlanet('prev')}> ← </button>
        <div>{planet.name}</div>
        <button onClick={() => navigateToPlanet('next')}> → </button>
      </div>
      <div>
        <button onClick={handleButtonClick}>{isJoined ? '떠나기' : '가입하기'}</button>
        <div>공유버튼</div>
      </div>
      {isJoinSuccessModalOpen && <JoinSuccessModal setIsJoinSuccessModalOpen={setIsJoinSuccessModalOpen} imageUrl={imageUrl} />}
      {isJoinFailModalOpen && <JoinFailModal setIsJoinFailModalOpen={setIsJoinFailModalOpen} imageUrl={imageUrl} />}
      {isExitModalOpen && <ExitModal setIsExitModalOpen={setIsExitModalOpen} imageUrl={imageUrl} />}
    </>
  );
}

export default PlanetDetailRecruiting;
