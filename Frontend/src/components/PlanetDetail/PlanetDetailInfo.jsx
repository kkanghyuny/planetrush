import { useNavigate } from "react-router-dom";

import "../../styles/PlanetDetailInfo.css";

const PlanetDetailInfo = ({ planetId, isLastDay, planetInfo, residents }) => {
  const navigate = useNavigate();

  const nowDate = new Date();
  const endDate = new Date(
    planetInfo.endDate[0],
    planetInfo.endDate[1] - 1,
    planetInfo.endDate[2]
  );

  const standardVerificationImg = planetInfo.standardVerificationImg;

  //날짜 차이 계산
  const calculateDaysLeft = () => {
    const timeDiff = endDate - nowDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysLeft;
  };

  const daysLeft = calculateDaysLeft(planetInfo.endDate);

  console.log(residents);

  //행성 유지율 판단
  const calculateRetentionRate = () => {
    const nowDate = new Date();

    const startDate = new Date(
      planetInfo.startDate[0],
      planetInfo.startDate[1] - 1,
      planetInfo.startDate[2]
    );

    // 경과된 일수 계산
    const daysElapsed = Math.ceil((nowDate - startDate) / (1000 * 3600 * 24));

    // resident가 총 인증한 횟수 계산
    const totalVerifications = residents.reduce(
      (sum, resident) => sum + resident.verificationCnt,
      0
    );

    // 기대되는 총 인증 횟수 = resident 수 * 경과된 일수
    const expectedVerifications = residents.length * daysElapsed;

    // 유지율 계산 (퍼센트로 변환)
    const retentionRate = (totalVerifications / expectedVerifications) * 100;

    return Math.floor(retentionRate);
  };

  const retentionRate = calculateRetentionRate();

  const getBarColor = (index) => {
    const filledBars = Math.ceil((retentionRate / 100) * 10);
    if (index < filledBars) {
      if (retentionRate >= 70) return "cyan";
      if (retentionRate >= 30) return "lightgreen";
      return "red";
    }
    return "gray";
  };

  const getStatusMessage = () => {
    if (retentionRate >= 70) return "잘 하고 있어요!";
    if (retentionRate >= 30) return "조금 더 노력해봐요!";
    return "매일매일 열심히!";
  };

  const handleVerification = () => {
    navigate("/verificate", {
      state: {
        content: planetInfo.content,
        id: planetId,
        standardVerificationImg: standardVerificationImg,
      },
    });
  };

  return (
    <div className="progress-container">
      <p className="planet-content">{planetInfo.content}</p>
      <div className="progress-planet-info">
        <img
          src={planetInfo.imgUrl}
          alt="Burning Planet"
          className={`image ${isLastDay ? "burning" : ""}`}
        />
        <div className="text-container">
          <p className="planet-title">{planetInfo.name}</p>
          <p className="days-left">{daysLeft}일 남았습니다!</p>
          <div className="progress-verificate-bar">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="progress-bar-segment"
                style={{ backgroundColor: getBarColor(index) }}
              />
            ))}
          </div>
          <p className="planet-message">{getStatusMessage()}</p>
          <button
            className="verificate-info-button"
            onClick={handleVerification}
            disabled={planetInfo.verifiedToday}
          >
            {planetInfo.verifiedToday ? "인증완료" : "인증하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanetDetailInfo;
