import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../AuthenticaitionPage/Axiosinstance";

import Cookies from "js-cookie";

import "../../App.css";
import "../../styles/Main.css";
import rocket from "../../assets/Rocket.png";
import gift from "../../assets/gift.png";
import search from "../../assets/searchbutton.png";

const gridPositions = [
  { top: "0%", left: "0%" },
  { top: "0%", left: "33.33%" },
  { top: "0%", left: "66.66%" },
  { top: "33.33%", left: "0%" },
  { top: "33.33%", left: "33.33%" },
  { top: "33.33%", left: "66.66%" },
  { top: "66.66%", left: "0%" },
  { top: "66.66%", left: "33.33%" },
  { top: "66.66%", left: "66.66%" },
];

const PADDING = 30; // 패딩 값을 정의합니다. (px 단위)

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const MainPage = () => {
  const navigate = useNavigate();

  const [planets, setPlanets] = useState(null);
  const [shuffledPositions, setShuffledPositions] = useState([]);
  const nickname = Cookies.get("nickname");

  useEffect(() => {
    setShuffledPositions(shuffleArray([...gridPositions]));
  }, []);

  useEffect(() => {
    const joinPlanetList = async () => {
      try {
        const response = await instance.get(`/planets/main/list`);
        if (response.data.isSuccess) {
          const data = response.data.data;
          setPlanets(data);
        } else {
          setPlanets([]);
        }
      } catch (error) {
        setPlanets([]);
      }
    };
    joinPlanetList();
  }, []);

  const getPlanetSize = (totalPlanets, index) => {
    const baseSize = 83 - (totalPlanets - 1) * 5;
    const sizeAdjustment = (9 - index) * 3;
    const size = baseSize + sizeAdjustment;

    return {
      width: `${size}px`,
      height: `${size}px`,
    };
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const getPlanetStyle = (planet, index, usedPositions) => {
    const sizeStyle = getPlanetSize(planets.length, index);
    const position = shuffledPositions[index % shuffledPositions.length];
    const randomTopOffset =
      Math.random() * (33.33 - parseFloat(sizeStyle.height) / 6);
    const randomLeftOffset =
      Math.random() * (33.33 - parseFloat(sizeStyle.width) / 6);

    // 패딩을 고려하여 위치를 조정합니다.
    const gridWidth = 100 - ((2 * PADDING) / 600) * 100;
    const gridHeight = 100 - ((2 * PADDING) / 600) * 100;

    const topValue = clamp(
      parseFloat(position.top) + randomTopOffset + 5,
      0,
      gridHeight - parseFloat(sizeStyle.height) / 6
    );
    const leftValue = clamp(
      parseFloat(position.left) + randomLeftOffset + 5,
      0,
      gridWidth - parseFloat(sizeStyle.width) / 6
    );

    const duration = (Math.random() * 3 + 3).toFixed(2);
    const delay = (Math.random() * 2).toFixed(2);

    return {
      ...sizeStyle,
      top: `${topValue}%`,
      left: `${leftValue}%`,
      animation: `floating ${duration}s ease-in-out ${delay}s infinite`,
    };
  };

  const handleToDetail = (planetStatus, planetId, isLastDay) => {
    return () => {
      if (planetStatus === "READY") {
        navigate(`/planet/${planetId}`, { state: { from: "/main" } });
      } else {
        navigate("/planet-progress", {
          state: {
            planetId: planetId,
            isLastDay: isLastDay,
          },
        });
      }
    };
  };

  if (planets === null) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="search-container">
        <span className="title-container">
          <span className="text-color">{nickname}</span>님의 은하
        </span>
        <Link to="/search" className="link-icon">
          <img className="search-icon" src={search} alt="Search Icon" />
        </Link>
      </div>
      {planets.length === 0 ? (
        <div className="rocket-center-container">
          <Link to="/search">
            <img src={rocket} alt="Rocket" className="rocket" />
          </Link>
          <div className="rocket-text">행성을 찾으러 가봐요!</div>
        </div>
      ) : (
        <div className="main-grid-container">
          {planets.map((planet, index) => {
            const planetStyle = getPlanetStyle(planet, index, []);
            const planetImgUrl =
              planet.status === "READY" ? gift : planet.planetImgUrl;
            const imgClass = planet.isLastDay
              ? "planet-img burning"
              : "planet-img";

            return (
              <div
                key={planet.planetId}
                className={`planet-wrapper ${
                  planet.isLastDay ? "burning" : ""
                }`}
                style={planetStyle}
                onClick={handleToDetail(
                  planet.status,
                  planet.planetId,
                  planet.isLastDay
                )}
              >
                <img
                  src={planetImgUrl}
                  alt={planet.name}
                  className={imgClass}
                />
                <div className="planet-name-container">
                  <div className="planet-name" data-text={planet.name}>
                    {planet.name}
                  </div>
                </div>
              </div>
            );
          })}
        
        </div>
      )}
    </div>
  );
};

export default MainPage;
