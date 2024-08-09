import "../../styles/PlanetRank.css";

const PlanetRank = ({ residents }) => {
  return (
    <div className="planet-rank-container">
      {residents.map((resident, index) => {
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
              <span className="verification-info">
                {resident.verificationCnt} / {total}
              </span>
            </div>
            <div className="progress-info">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: "cyan",
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanetRank;
