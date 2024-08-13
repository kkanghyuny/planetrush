import Crown from "../../assets/Crown.png";
import "../../styles/PlanetRank.css";

const PlanetRank = ({ planetInfo, residents }) => {
  //랭킹 정렬
  const sortedResidents = [...residents].sort((a, b) => {
    if (a.isQuerriedMember && !b.isQuerriedMember) {
      return -1;
    }
    if (!a.isQuerriedMember && b.isQuerriedMember) {
      return 1;
    }

    // isQuerriedMember가 둘 다 false 또는 true인 경우
    if (a.verificationContinuityPoint !== b.verificationContinuityPoint) {
      return b.verificationContinuityPoint - a.verificationContinuityPoint;
    } else {
      return b.verificationCnt - a.verificationCnt;
    }
  });

  // 1등 점수 확인 (동점자 체크)
  const highestPoint =
    sortedResidents.length > 0
      ? sortedResidents[0].verificationContinuityPoint
      : null;

  return (
    <div className="planet-rank-container">
      {sortedResidents.map((resident, index) => {
        const total = planetInfo.totalVerificationCnt;
        const percentage = (resident.verificationCnt / total) * 100;
        const isTopRanker =
          resident.verificationContinuityPoint === highestPoint;

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
