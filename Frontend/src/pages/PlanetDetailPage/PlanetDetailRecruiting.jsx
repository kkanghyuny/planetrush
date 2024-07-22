import React, { useState } from 'react';
import JoinSuccessModal from '../../components/Modals/JoinSuccessModal';
import JoinFailModal from '../../components/Modals/JoinFailModal';
import '../../styles/Modal.css';

function PlanetDetailRecruiting() {
  const [isJoinSuccessModalOpen, setIsJoinSuccessModalOpen] = useState(false);
  const [isJoinFailModalOpen, setIsJoinFailModalOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState('');

  const planet = {
    name: "뿌꾸뿌꾸",
    content: "1일 1요가하기",
    categoryName: "BEAUTY",
    startDate: "2024-07-18",
    endDate: "2024-07-25",
    maxParticipants: 10,
    authCond: "요가 매트가 보이게 손가락을 브이해서 찍어주세요",
    isBasic: true,
    defaultPlanetImg: 2,
    imageUrl: "https://example.com/image.jpg" // 임의 이미지 URL
  };

  const handleButtonClick = () => {
    setImageUrl(planet.imageUrl);
    const canJoin = Math.random() > 0.5; // 예시: 50% 확률로 가입 가능

    if (canJoin) {
      setIsJoinSuccessModalOpen(true);
    } else {
      setIsJoinFailModalOpen(true);
    }
  };

  return (
    <>
      <div>
        <div>{planet.categoryName}</div>
        <div>{`${planet.startDate} ~ ${planet.endDate}`}</div>
      </div>
      <div>{planet.content}</div>
      <div>{planet.maxParticipants}</div>
      <img src={planet.imageUrl} alt="행성사진" />
      <div>
        <button> ← </button>
        <div>{planet.name}</div>
        <button> → </button>
      </div>
      <div>
        <button onClick={handleButtonClick}>가입하기</button>
        <div>공유버튼</div>
      </div>
      {isJoinSuccessModalOpen && <JoinSuccessModal setIsJoinSuccessModalOpen={setIsJoinSuccessModalOpen} imageUrl={imageUrl} />}
      {isJoinFailModalOpen && <JoinFailModal setIsJoinFailModalOpen={setIsJoinFailModalOpen} imageUrl={imageUrl} />}
    </>
  );
}

export default PlanetDetailRecruiting;
