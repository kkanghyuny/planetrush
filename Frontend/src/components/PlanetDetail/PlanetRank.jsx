import Crown from "../../assets/Crown.png";
import "../../styles/PlanetRank.css";

const PlanetRank = ({ planetInfo, residents }) => {
  // 최고 verificationContinuityPoint 값을 찾음
  const maxPoint = residents.reduce((max, resident) => {
    return Math.max(max, resident.verificationContinuityPoint);
  }, 0);

  // 점수 기준으로 1등 결정
  const topRanker = residents.reduce((top, resident) => {
    if (
      !top ||
      resident.verificationContinuityPoint > top.verificationContinuityPoint ||
      (resident.verificationContinuityPoint ===
        top.verificationContinuityPoint &&
        resident.verificationCnt > top.verificationCnt)
    ) {
      return resident;
    }
    return top;
  }, null);

  // 정렬은 isQuerriedMember 기준으로 진행
  const sortedResidents = [...residents].sort((a, b) => {
    if (a.isQuerriedMember && !b.isQuerriedMember) {
      return -1;
    }
    if (!a.isQuerriedMember && b.isQuerriedMember) {
      return 1;
    }

    if (a.verificationContinuityPoint !== b.verificationContinuityPoint) {
      return b.verificationContinuityPoint - a.verificationContinuityPoint;
    } else {
      return b.verificationCnt - a.verificationCnt;
    }
  });

  return (
    <div className="planet-rank-container">
      {sortedResidents.map((resident, index) => {
        const total = planetInfo.totalVerificationCnt;
        const percentage = (resident.verificationCnt / total) * 100;

        // 왕관은 topRanker에만 표시
        const isTopRanker = resident.verificationContinuityPoint === maxPoint;

        return (
          <div
            key={index}
            className={`resident-container ${
              resident.isQuerriedMember ? "highlight" : ""
            }`}
          >
            <div className="user-verificate">
              <p className="nickname">
                {isTopRanker && (
                  <img src={Crown} alt="1등" className="crown-icon" />
                )}
                {resident.nickname}
              </p>
            </div>
            <div className="progress-info">
              <div className="progress-rank-bar">
                <div
                  className="progress-rank-bar-fill"
                  style={{
                    width: `${percentage}%`,
                  }}
                ></div>
              </div>
              <span className="verification-info">
                {resident.verificationCnt} / {total}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanetRank;
