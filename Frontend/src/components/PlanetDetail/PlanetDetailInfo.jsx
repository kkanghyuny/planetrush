import "../../styles/PlanetDetailInfo.css";

const PlanetDetailInfo = ({ daysLeft, progress }) => {
  const totalSegments = 10;
  const filledSegments = progress;
  const emptySegments = totalSegments - filledSegments;

  return (
    <div className="container">
      <img
        src="path/to/planet-image.png" // 이미지 경로 설정
        alt="Burning Planet"
        className="image"
      />
      <div className="text-container">
        <p>허벅지 불타는 행성</p>
        <p className="days-left">{daysLeft}일 남았습니다!</p>
        <div className="progress-bar">
          {Array.from({ length: filledSegments }).map((_, index) => (
            <div key={index} className="segment filled-segment" />
          ))}
          {Array.from({ length: emptySegments }).map((_, index) => (
            <div key={index} className="segment" />
          ))}
        </div>
        <p>모두 분발해주세요!</p>
        <button className="button">인증하기</button>
      </div>
    </div>
  );
};

export default PlanetDetailInfo;
