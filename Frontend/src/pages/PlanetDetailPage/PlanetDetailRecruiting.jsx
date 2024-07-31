import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import JoinSuccessModal from "../../components/Modals/JoinSuccessModal";
import JoinFailModal from "../../components/Modals/JoinFailModal";
import ExitModal from "../../components/Modals/ExitModal";
import "../../styles/Modal.css";
import instance from "../AuthenticaitionPage/Axiosinstance";

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
  const [imageUrl, setImageUrl] = useState("");
  const [currentParticipants, setCurrentParticipants] = useState(null);
  const [planet, setPlanet] = useState(null);

  const accessToken = Cookies.get("access-token");
  // useLocation을 사용해 넘어온 상태에서 displayedChallenges를 받아옴
  const { displayedChallenges } = location.state || {};

  useEffect(() => {
    const fetchPlanetDetail = async () => {
      try {
        console.log(location);
        const response = await instance.get(`/planets/detail`, {
          params: { "planet-id": id },
        });
        if (response.data.isSuccess) {
          const planetData = response.data.data;
          setPlanet(planetData); // planet 데이터 설정
          setIsJoined(planetData.isJoined); // isJoined 설정
          setCurrentParticipants(planetData.currentParticipants); // currentParticipants 설정
          console.log(planetData);
        }
      } catch (error) {
        console.error("Error fetching planet details:", error);
      }
    };
    fetchPlanetDetail();
  }, [id, accessToken]);

  // 행성이 없는 경우
  if (!planet) {
    return <div>행성을 찾을 수 없습니다.</div>;
  }

  const handleJoin = async () => {
    try {
      console.log("Joining planet:", planet.planetId);
      const responseJoin = await instance.post(
        `/planets/${planet.planetId}`,
        {} // 빈 객체를 요청 본문으로 보냄
      );

      if (responseJoin.status === 200) {
        setIsJoined(true);
        setIsJoinSuccessModalOpen(true);
        setCurrentParticipants((prevParticipants) => prevParticipants + 1);
      } else {
        console.error(
          "Failed to join planet, status code:",
          responseJoin.status
        );
        setIsJoinFailModalOpen(true);
      }
    } catch (error) {
      if (error.response) {
        // 서버가 2xx 외의 상태 코드를 반환한 경우
        console.error("Error response:", error.response);
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 만들어졌지만 응답을 받지 못한 경우
        console.error("Error request:", error.request);
      } else {
        // 요청을 설정하는 중에 문제가 발생한 경우
        console.error("Error message:", error.message);
      }
      setIsJoinFailModalOpen(true);
    }
  };

  const handleLeave = async () => {
    try {
      const responseLeave = await instance.delete(
        `/planets/${planet.planetId}`,
        {}
      );
      if (responseLeave.status === 200) {
        setIsJoined(false);
        setIsExitModalOpen(true);
        setCurrentParticipants(currentParticipants - 1);
      } else {
        console.error(
          "Failed to join planet, status code:",
          responseLeave.status
        );
        setIsJoinFailModalOpen(true);
      }
    } catch (error) {
      if (error.response) {
        // 서버가 2xx 외의 상태 코드를 반환한 경우
        console.error("Error response:", error.response);
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        // 요청이 만들어졌지만 응답을 받지 못한 경우
        console.error("Error request:", error.request);
      } else {
        // 요청을 설정하는 중에 문제가 발생한 경우
        console.error("Error message:", error.message);
      }
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

  // displayChallenges를 기준으로 받아왔기 때문에 이미 기준에 의해 필터링된 데이터들이 객체로 묶여있을거다.
  // 그래서 주소를 planet/:id로 해도 prev / next 실행 시 객체 내 다음 배열로 넘어가게 할 수 있었던 것
  const navigateToPlanet = (direction) => {
    // url 매개변수 id를 정수형으로 변환하여 비교하려고 parseInt 사용
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
}

export default PlanetDetailRecruiting;
