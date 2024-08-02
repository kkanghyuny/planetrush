import { useNavigate } from "react-router-dom";

import "../../styles/PlanetDetailInfo.css";

const PlanetDetailInfo = ({ planetInfo, residents }) => {
  const navigate = useNavigate();

  console.log(planetInfo);

  //날짜 차이 계산
  const calculateDaysLeft = (endDateArr) => {
    const nowDate = new Date();
    const endDate = new Date(endDateArr[0], endDateArr[1] - 1, endDateArr[2]);

    const timeDiff = endDate - nowDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysLeft;
  };

  const daysLeft = calculateDaysLeft(planetInfo.endDate);

  //행성 유지율 판단
  const calculateRetentionRate = () => {
    const nowDate = new Date();
    const startDate = new Date(
      planetInfo.startDate[0],
      planetInfo.startDate[1] - 1,
      planetInfo.startDate[2]
    );

    const daysElapsed = (nowDate - startDate) / (1000 * 3600 * 24);

    let sum = 0;

    for (let resident of residents) {
      sum += resident.verificationCnt / daysElapsed;
    }

    const average = sum / residents.length;

    return Math.floor(average * 100);
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
    return "모두 분발해주세요!";
  };

  const handleVerification = () => {
    navigate("/verificate", { state: planetInfo.content });
  };

  return (
    <div className="progress-container">
      <h3>{planetInfo.content}</h3>
      <div className="progress-planet-info">
        <img src={planetInfo.imgUrl} alt="Burning Planet" className="image" />
        <div className="text-container">
          <p>{planetInfo.name}</p>
          <p className="days-left">{daysLeft}일 남았습니다!</p>
          <div className="progress-bar">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="progress-bar-segment"
                style={{ backgroundColor: getBarColor(index) }}
              />
            ))}
          </div>
          <p>{getStatusMessage()}</p>
          <button className="button" onClick={handleVerification}>
            인증하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanetDetailInfo;
