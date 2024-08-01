import { useEffect, useState } from "react";
import instance from "../AuthenticaitionPage/Axiosinstance";

import PlanetDetailInfo from "../../components/PlanetDetail/PlanetDetailInfo";
import PlanetRank from "../../components/PlanetDetail/PlanetRank";
import PlanetChat from "../../components/PlanetDetail/PlanetChat";
import { useLocation } from "react-router-dom";

const PlanetDetailInProgress = () => {
  const [view, setView] = useState("rank");
  const location = useLocation();

  const planetId = location.state;

  useEffect(() => {
    const planetInProgress = async () => {
      try {
        const response = await instance.get("/planets/ongoing", {
          query: "",
        });
        const data = response.data;
      } catch (error) {
        console.error("Error fetching images:", error.code);
      }
    };
  }, []);

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
      <h1>진행중 상세조회</h1>
      <div>
        <PlanetDetailInfo daysLeft={5} progress={3} />
      </div>
      <div>
        <div>
          <button onClick={handleRankClick}>랭킹</button>
          <button onClick={handleChatClick}>채팅</button>
        </div>
        {view === "rank" ? <PlanetRank /> : <PlanetChat />}
      </div>
    </>
  );
};

export default PlanetDetailInProgress;
