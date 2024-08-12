import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";

import JoinSuccessModal from "../../components/Modals/JoinSuccessModal";
import JoinFailModal from "../../components/Modals/JoinFailModal";
import ExitModal from "../../components/Modals/ExitModal";
import useCategoryStore from "../../store/categoryLabelStore";
import ParticipantAlert from "../../components/Foam/ParticipantAlertFoam";

import "../../styles/Modal.css";
import "../../styles/PlanetDetailReady.css"
import { BiSolidLeftArrowCircle } from "react-icons/bi";

// 모집 중인 행성의 세부 정보를 표시하고 관리하는 메인 컴포넌트
const PlanetDetailRecruiting = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const location = useLocation();
  const [isJoined, setIsJoined] = useState(false);

  // 모달 3세트: 가입 성공, 가입 탈퇴, 가입 불가
  const [isJoinSuccessModalOpen, setIsJoinSuccessModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isJoinFailModalOpen, setIsJoinFailModalOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [currentParticipants, setCurrentParticipants] = useState(null);
  const [planet, setPlanet] = useState(null);

  const getCategoryLabel = useCategoryStore((state) => state.getCategoryLabel);

  // useLocation을 사용해 넘어온 상태에서 displayedChallenges를 받아옴
  const displayedChallenges = location.state?.displayedChallenges || [];

  const handleClick = () => {
    const previousPath = location.state?.from || "/main"; 
    navigate(previousPath);
  };

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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
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
        setIsJoinSuccessModalOpen(true);
        await fetchPlanetDetail(); // Fetch updated planet details
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
        setIsExitModalOpen(true);
        await fetchPlanetDetail(); // Fetch updated planet details
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
      <div onClick={handleClick} className="back-button">
        <BiSolidLeftArrowCircle />
      </div>
      <div className="detail-info-container">
        <div className="planet-category">{getCategoryLabel(planet.category)}</div>
        <div>{`${planet.startDate.join("-")} ~ ${planet.endDate.join("-")}`}</div>
      </div>
      <div className="planet-detail-content">{planet.content}</div>
      <div className="detail-participant-ratio">{planet.currentParticipants} / {planet.maxParticipants}</div>
      <div className="alert-container">
        <ParticipantAlert 
          currentParticipants={planet.currentParticipants}
          maxParticipants={planet.maxParticipants}
        />
      </div>
      <div className="detail-img-container">
        <img className="detail-img" src={planet.planetImg} alt="행성사진" />
      </div>
      <div>
        {displayedChallenges.length > 1 ? (
          <div className="direction-button-container">
            <button className="direction-button" onClick={() => navigateToPlanet("prev")}>
                <div className="triangle triangle-right"></div> 
            </button>
            <div>{planet.name}</div>
            <button className="direction-button" onClick={() => navigateToPlanet("next")}>
                <div className="triangle triangle-left"></div>
            </button>
          </div>

      
        ) : ( <div className="direction-button-container">{planet.name}</div>)}
      </div>
      <div className = "isjoined-button-container">
        {isFull && !isJoined ? (
          <button className = "isjoined-button" onClick={handleButtonClick}>가입 불가</button>
        ) : (
          <button className = "isjoined-button" onClick={handleButtonClick}>
            {isJoined ? "떠나기" : "가입하기"}
          </button>
        )}
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
