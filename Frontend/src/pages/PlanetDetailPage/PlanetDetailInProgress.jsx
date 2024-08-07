import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";

import PlanetDetailInfo from "../../components/PlanetDetail/PlanetDetailInfo";
import PlanetRank from "../../components/PlanetDetail/PlanetRank";
import PlanetChat from "../../components/PlanetDetail/PlanetChat";

const PlanetDetailInProgress = () => {
  const location = useLocation();

  const [view, setView] = useState("rank");
  const planetId = location.state;

  const [planetInfo, setPlanetInfo] = useState({
    name: "",
    category: "",
    content: "",
    startDate: "",
    endDate: "",
    totalVerificationCnt: "",
    imgUrl: "",
    verifiedToday: false,
  });

  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const planetInProgress = async () => {
      try {
        const response = await instance.get("/planets/ongoing", {
          params: {
            "planet-id": planetId,
          },
        });
        const data = response.data.data;

        setPlanetInfo({
          name: data.name,
          category: data.category,
          content: data.content,
          startDate: data.startDate,
          endDate: data.endDate,
          totalVerificationCnt: data.totalVerificationCnt,
          imgUrl: data.planetImg,
          verifiedToday: data.verifiedToday,
        });

        setResidents(data.residents);
      } catch (error) {
        console.error("Error fetching images:", error.code);
      }
    };

    planetInProgress();
  }, [planetId]);

  //채팅화면 변환
  const handleChatClick = () => {
    setView("chat");
  };

  //랭킹화면 변환
  const handleRankClick = () => {
    setView("rank");
  };

  return (
    <>
      <div>
        {planetInfo && (
          <PlanetDetailInfo
            planetId={planetId}
            planetInfo={planetInfo}
            residents={residents}
          />
        )}
      </div>
      <div>
        <div>
          <button onClick={handleRankClick}>랭킹</button>
          <button onClick={handleChatClick}>채팅</button>
        </div>
        {view === "rank" ? (
          <PlanetRank residents={residents} />
        ) : (
          <PlanetChat
            planetId={planetId}
            planetInfo={planetInfo}
            residents={residents}
          />
        )}
      </div>
    </>
  );
};

export default PlanetDetailInProgress;
