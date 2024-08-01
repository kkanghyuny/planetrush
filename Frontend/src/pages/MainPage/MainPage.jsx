import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import instance from "../AuthenticaitionPage/Axiosinstance";

import { BiSearchAlt } from "react-icons/bi";
import "../../App.css";
import "../../styles/Main.css";

import rocket from "../../assets/Rocket.png";
import present from "../../assets/present.png";

// 전체 화면을 3 by 3으로 나누었다.
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

const MainPage = () => {
  const navigate = useNavigate();

  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    const joinPlanetList = async () => {
      try {
        const response = await instance.get(
          `/planets/main/list`,
          {},
          {
            headers: { "Content-type": "application/json" },
          }
        );
        if (response.data.isSuccess) {
          const data = response.data.data;
          setPlanets(data);
        } else {
        }
      } catch (error) {}
    };
    joinPlanetList();
  }, []);

  const getPlanetSize = (totalPlanets, index) => {
    const baseSize = 120 - (totalPlanets - 1) * 10;
    const sizeAdjustment = (9 - index) * 5;
    const size = baseSize + sizeAdjustment;

    return {
      width: `${size}px`,
      height: `${size}px`,
    };
  };

  const getRandomOffset = (size) => {
    const maxOffset = 33.33 - (size / 600) * 100;
    const topOffset = Math.random() * maxOffset;
    const leftOffset = Math.random() * maxOffset;

    return { topOffset, leftOffset };
  };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const getRandomPosition = (usedPositions) => {
    let index;
    do {
      index = Math.floor(Math.random() * gridPositions.length);
    } while (usedPositions.includes(index));
    usedPositions.push(index);

    return gridPositions[index];
  };

  const getRandomAnimationTiming = () => {
    const duration = (Math.random() * 3 + 3).toFixed(2);
    const delay = (Math.random() * 2).toFixed(2);

    return { duration, delay };
  };

  const getPlanetStyle = (planet, index, usedPositions) => {
    const sizeStyle = getPlanetSize(planets.length, index);
    const { topOffset, leftOffset } = getRandomOffset(
      parseInt(sizeStyle.width)
    );
    const position = getRandomPosition(usedPositions);
    const topValue = clamp(
      parseFloat(position.top) + topOffset,
      0,
      100 - parseFloat(sizeStyle.height) / 6
    );
    const leftValue = clamp(
      parseFloat(position.left) + leftOffset,
      0,
      100 - parseFloat(sizeStyle.width) / 6
    );
    const { duration, delay } = getRandomAnimationTiming();

    return {
      ...sizeStyle,
      top: `${topValue}%`,
      left: `${leftValue}%`,
      animation: `floating ${duration}s ease-in-out ${delay}s infinite`,
    };
  };

  const usedPositions = [];

  const handleToDetail = (planetStatus, planetId) => {
    return () => {
      if (planetStatus === "READY") {
        navigate(`/planet/${planetId}`);
      } else {
        navigate("/planet-progress", { state: planetId });
      }
    };
  };

  return (
    <div className="page-container">
      <div className="gradient"></div>
      <div className="stars"></div>
      <h1>메인페이지</h1>
      <div className="search-container">
        <Link to="/search" className="link-icon">
          검색
          <BiSearchAlt />
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
        <div className="grid-container">
          {planets.map((planet, index) => {
            const planetStyle = getPlanetStyle(planet, index, usedPositions);
            const planetImgUrl =
              planet.status === "READY" ? present : planet.planetImgUrl;

            return (
              <div
                key={planet.planetId}
                className="planet-wrapper"
                style={planetStyle}
                onClick={handleToDetail(planet.status, planet.planetId)}
              >
                <img
                  src={planetImgUrl}
                  alt={planet.name}
                  className="planet-img"
                />
                <div className="planet-name">{planet.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MainPage;
