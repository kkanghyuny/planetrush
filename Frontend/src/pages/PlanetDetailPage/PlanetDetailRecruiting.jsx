import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";
import JoinSuccessModal from "../../components/Modals/JoinSuccessModal";
import JoinFailModal from "../../components/Modals/JoinFailModal";
import ExitModal from "../../components/Modals/ExitModal";
import NoMorePlanetModal from "../../components/Modals/NoMorePlanetModal";
import UseCategoryStore from "../../store/categoryLabelStore";
import ParticipantAlert from "../../components/Foam/ParticipantAlertFoam";
import UsechallengeCountStore from "../../store/challengeCountStore";

import "../../styles/Modal.css";
import "../../styles/PlanetDetailReady.css";
import { BiSolidLeftArrowCircle } from "react-icons/bi";

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
  const [noMorePlanetModalOpen, setNoMorePlanetModalOpen] = useState(false);
  const [isOpenVerificateImg, setIsOpenVerificateImg] = useState(false);

  // 챌린지 카운트 관련 함수 불러오기
  const { incrementChallengeCount, decrementChallengeCount } =
    UsechallengeCountStore();

  const getCategoryLabel = UseCategoryStore((state) => state.getCategoryLabel);

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
    } catch (error) {}
  };

  useEffect(() => {
    fetchPlanetDetail();
  }, [id]);

  if (!planet) {
    return <div>행성을 찾을 수 없습니다.</div>;
  }

  // 챌린지에 가입하는 경우
  const handleJoin = async () => {
    try {
      const response = await instance.post(`/planets/${planet.planetId}`, {});

      if (response.status === 200) {
        setIsJoinSuccessModalOpen(true);
        incrementChallengeCount(); // 챌린지 개수 증가
        await fetchPlanetDetail();
      } else {
        setIsJoinFailModalOpen(true);
      }
    } catch (error) {
      if (error.response.data.code === "6004") {
        setNoMorePlanetModalOpen(true);
      } else {
        setIsJoinFailModalOpen(true);
      }
    }
  };

  // 챌린지에서 떠나는 경우
  const handleLeave = async () => {
    try {
      const response = await instance.delete(`/planets/${planet.planetId}`, {});

      if (response.status === 200) {
        setIsExitModalOpen(true);
        decrementChallengeCount(); // 챌린지 개수 감소
        await fetchPlanetDetail();
      } else {
        setIsJoinFailModalOpen(true);
      }
    } catch (error) {
      setIsJoinFailModalOpen(true);
    }
  };

  const handleButtonClick = () => {
    setImageUrl(planet.planetImg);

    if (currentParticipants === planet.maxParticipants && !isJoined) {
      setIsJoinFailModalOpen(true);
      return;
    }

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

  //인증사진보기
  const handleVerificateImg = () => {
    setIsOpenVerificateImg(!isOpenVerificateImg);
  };

  return (
    <>
      <div onClick={handleClick} className="back-button">
        <BiSolidLeftArrowCircle />
      </div>
      <div className="detail-info-container">
        <div className="planet-category">
          {getCategoryLabel(planet.category)}
        </div>
        <div>{`${planet.startDate.join("-")} ~ ${planet.endDate.join(
          "-"
        )}`}</div>
      </div>
      <div className="planet-detail-content">{planet.content}</div>
      <div className="detail-participant-ratio">
        {planet.currentParticipants} / {planet.maxParticipants}
      </div>
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
            <button
              className="direction-button"
              onClick={() => navigateToPlanet("prev")}
            >
              <div className="triangle triangle-right"></div>
            </button>
            <div>{planet.name}</div>
            <button
              className="direction-button"
              onClick={() => navigateToPlanet("next")}
            >
              <div className="triangle triangle-left"></div>
            </button>
          </div>
        ) : (
          <div className="direction-button-container">{planet.name}</div>
        )}
      </div>
      <div className="isjoined-button-container">
        {isFull && !isJoined ? (
          <button className="isjoined-button" onClick={handleButtonClick}>
            가입 불가
          </button>
        ) : (
          <button className="isjoined-button" onClick={handleButtonClick}>
            {isJoined ? "떠나기" : "가입하기"}
          </button>
        )}
      </div>
      <p className="open-verificate-img" onClick={handleVerificateImg}>
        대표 사진 보기
      </p>
      {isOpenVerificateImg ? (
        <div className="recruit-verificate-info">
          <p className="recruit-verificate-content">
            미션 : <br /> {planet.verificationCond}
          </p>
          <img
            src={planet.standardVerificationImg}
            alt="인증 미션 사진"
            className="recruit-verificate-img"
          />
        </div>
      ) : (
        <></>
      )}
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
      {noMorePlanetModalOpen && (
        <NoMorePlanetModal
          setNoMorePlanetModalOpen={setNoMorePlanetModalOpen}
        />
      )}
    </>
  );
};

export default PlanetDetailRecruiting;
