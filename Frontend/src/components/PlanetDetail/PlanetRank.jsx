import "../../styles/PlanetRank.css";

const PlanetRank = ({ residents }) => {
  //랭킹 정렬
  const sortedResidents = [...residents].sort((a, b) => {
    if (a.isQuerriedMember && !b.isQuerriedMember) {
      return -1;
    }
    if (!a.isQuerriedMember && b.isQuerriedMember) {
      return 1;
    }
    if (!a.isQuerriedMember && !b.isQuerriedMember) {
      const percentageA = (a.verificationCnt / 10) * 100;
      const percentageB = (b.verificationCnt / 10) * 100;
      return percentageB - percentageA;
    }
    return 0;
  });

  return (
    <div className="planet-rank-container">
      {sortedResidents.map((resident, index) => {
        const total = 10;
        const percentage = (resident.verificationCnt / total) * 100;

        return (
          <div
            key={index}
            className={`resident-container ${
              resident.isQuerriedMember ? "highlight" : ""
            }`}
          >
            <div className="user-verificate">
              <p className="nickname">{resident.nickname}</p>
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
