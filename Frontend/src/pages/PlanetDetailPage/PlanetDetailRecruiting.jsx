import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";

import JoinSuccessModal from "../../components/Modals/JoinSuccessModal";
import JoinFailModal from "../../components/Modals/JoinFailModal";
import ExitModal from "../../components/Modals/ExitModal";

import "../../styles/Modal.css";

// 모집 중인 행성의 세부 정보를 표시하고 관리하는 메인 컴포넌트
const PlanetDetailRecruiting = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);

  // 모달 3세트: 가입 성공, 가입 탈퇴, 가입 불가
  const [isJoinSuccessModalOpen, setIsJoinSuccessModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isJoinFailModalOpen, setIsJoinFailModalOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [currentParticipants, setCurrentParticipants] = useState(null);
  const [planet, setPlanet] = useState(null);

  // useLocation을 사용해 넘어온 상태에서 displayedChallenges를 받아옴
  const { displayedChallenges } = location.state || {};

  useEffect(() => {
    const fetchPlanetDetail = async () => {
      try {
        const response = await instance.get(`/planets/detail`, {
          params: { "planet-id": id },
        });

        if (response.data.isSuccess) {
          const data = response.data.data;

          setPlanet(data); // planet 데이터 설정
          setIsJoined(data.isJoined); // isJoined 설정
          setCurrentParticipants(data.currentParticipants); // currentParticipants 설정
        }
      } catch (error) {}
    };

    fetchPlanetDetail();
  }, [id]);

  // 행성이 없는 경우
  if (!planet) {
    return <div>행성을 찾을 수 없습니다.</div>;
  }

  //가입하는 경우
  const handleJoin = async () => {
    try {
      const response = await instance.post(`/planets/${planet.planetId}`, {});

      if (response.status === 200) {
        setIsJoined(true);
        setIsJoinSuccessModalOpen(true);
        setCurrentParticipants((prevParticipants) => prevParticipants + 1);
      } else {
        setIsJoinFailModalOpen(true);
      }
    } catch (error) {
      setIsJoinFailModalOpen(true);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await instance.delete(`/planets/${planet.planetId}`, {});

      if (response.status === 200) {
        setIsJoined(false);
        setIsExitModalOpen(true);
        setCurrentParticipants(currentParticipants - 1);
      } else {
        setIsJoinFailModalOpen(true);
      }
    } catch (error) {
      setIsJoinFailModalOpen(true);
    }
  };

  const handleButtonClick = () => {
    setImageUrl(planet.planetImg);

    // 1. 가입 인원이 전부 찬 경우
    if (currentParticipants === planet.maxParticipants && !isJoined) {
      setIsJoinFailModalOpen(true);
      return;
    }

    // 2. 이미 가입한 경우 / 가입을 아직 안 한 경우
    if (isJoined) {
      handleLeave();
    } else {
      handleJoin();
    }
  };

  const isFull = currentParticipants === planet.maxParticipants;

  const navigateToPlanet = (direction) => {
    const currentIndex = displayedChallenges.findIndex(
      (challenge) => challenge.planetId === parseInt(id)
    );

    let newIndex;

    if (direction === "prev") {
      newIndex =
        currentIndex > 0 ? currentIndex - 1 : displayedChallenges.length - 1;
    } else if (direction === "next") {
      newIndex =
        currentIndex < displayedChallenges.length - 1 ? currentIndex + 1 : 0;
    }

    const newPlanetId = displayedChallenges[newIndex].planetId;
    navigate(`/planet/${newPlanetId}`, { state: { displayedChallenges } });
  };

  return (
    <>
      <div>
        <div>{planet.category}</div>
        <div>{`${planet.startDate.join("-")} ~ ${planet.endDate.join(
          "-"
        )}`}</div>
      </div>
      <div>{planet.content}</div>
      <div>{currentParticipants}</div>
      <div>{planet.maxParticipants}</div>
      <img src={planet.planetImg} alt="행성사진" />
      <div>
        <button onClick={() => navigateToPlanet("prev")}> ← </button>
        <div>{planet.name}</div>
        <button onClick={() => navigateToPlanet("next")}> → </button>
      </div>
      <div>
        {isFull && !isJoined ? (
          <button onClick={handleButtonClick}>가입 불가</button>
        ) : (
          <button onClick={handleButtonClick}>
            {isJoined ? "떠나기" : "가입하기"}
          </button>
        )}
        <div>공유버튼</div>
      </div>
      {isJoinSuccessModalOpen && (
        <JoinSuccessModal
          setIsJoinSuccessModalOpen={setIsJoinSuccessModalOpen}
          imageUrl={imageUrl}
        />
      )}
      {isJoinFailModalOpen && (
        <JoinFailModal
          setIsJoinFailModalOpen={setIsJoinFailModalOpen}
          imageUrl={imageUrl}
        />
      )}
      {isExitModalOpen && (
        <ExitModal
          setIsExitModalOpen={setIsExitModalOpen}
          imageUrl={imageUrl}
        />
      )}
    </>
  );
};

export default PlanetDetailRecruiting;
