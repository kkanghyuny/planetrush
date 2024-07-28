import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiSearchAlt } from "react-icons/bi";
import "../../App.css";
import "../../styles/Main.css";
import defaultPlanet from "../../assets/DefaultPlanet.png";
import fire from "../../assets/fire.png";
import ice from "../../assets/ice.png";
import dessert from "../../assets/dessert.png";
import rocket from "../../assets/Rocket.png";

// 더미 데이터
const planetData = [
  { id: 1, name: ".", image: dessert },
  { id: 2, name: ".", image: fire },
  { id: 3, name: ".", image: ice },
  { id: 4, name: ".", image: defaultPlanet },
  { id: 5, name: ".", image: ice },
  { id: 6, name: ".", image: defaultPlanet },
  { id: 7, name: ".", image: dessert },
  { id: 8, name: ".", image: fire },
  { id: 9, name: ".", image: defaultPlanet },
];

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

// 메인 페이지
function MainPage() {
  // 행성 정보 저장
  const [planets, setPlanets] = useState([]);

  // 처음으로 마운트될 때 planetData를 넣어준다.
  useEffect(() => {
    setPlanets(planetData);
  }, []);

  // 사이즈 조정 로직
  // 1. baseSize: 행성 개수에 따라 기본 사이즈가 정해진다.
  // 2. sizeAdjustment: 인덱스에 따라 크기를 다르게 한다.
  // 3. 1+2를 합쳐 size를 구성하여 이걸 기반으로 행성 사이즈를 결정한다.
  const getPlanetSize = (totalPlanets, index) => {
    const baseSize = 140 - (totalPlanets - 1) * 10;
    const sizeAdjustment = (9 - index) * 5;
    const size = baseSize + sizeAdjustment;
    return {
      width: `${size}px`,
      height: `${size}px`,
    };
  };

  // offset은 기본 위치로부터의 상대적인 이동 거리를 의미한다.
  // maxoffset -> 33.33은 그리드의 크기다
  // (size/600) * 100은 그리드의 상대적인 크기로 변환하는 식이다.
  // 이미지의 왼쪽 상단 기준을 넘겨준다.
  const getRandomOffset = (size) => {
    const maxOffset = 33.33 - (size / 600) * 100;
    const topOffset = Math.random() * maxOffset;
    const leftOffset = Math.random() * maxOffset;
    return { topOffset, leftOffset };
  };

  // Math.max(min, Math.min(max, value)) : value를 [min, max]에 있게 하기 위한 과정
  // 1. Math(min(max, value))를 통해 value가 max보다는 작게 한다.
  // 2. Math.max(min, Math.min)을 통해 value가 min보다는 크게 한다.
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // 랜덤 포지션 설정하기
  // 1. Math.floor(Math.random() * gridPositions.length);
  // 9개 기준 [0,1] * 9 이므로 랜덤한 index가 생성된다.
  // math.floor를 활용하여 정수로 만든다.
  // while을 통해 이미 그 index가 사용된 경우 다시 index를 설정하는 과정을 거친다.
  // index가 정해지면 usedPosition으로 push 한다.
  const getRandomPosition = (usedPositions) => {
    let index;
    do {
      index = Math.floor(Math.random() * gridPositions.length);
    } while (usedPositions.includes(index));
    usedPositions.push(index);
    return gridPositions[index];
  };

  // duration과 delay를 통해 각자 랜덤한 시간에 floating이 시작해서 랜덤하게 돌아오는 구간을 반복한다.
  const getRandomAnimationTiming = () => {
    const duration = (Math.random() * 3 + 3).toFixed(2); // 3초에서 6초 사이의 랜덤한 시간
    const delay = (Math.random() * 2).toFixed(2); // 0초에서 2초 사이의 랜덤한 시간
    return { duration, delay };
  };

  const usedPositions = [];

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
      {/* 행성이 없는 처음 상황인 경우 */}
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
            const sizeStyle = getPlanetSize(planets.length, index);
            const { topOffset, leftOffset } = getRandomOffset(
              parseInt(sizeStyle.width)
            );
            const position = getRandomPosition(usedPositions);
            const topValue = clamp(
              // parseFloat : 문자열을 부동 소수점으로 변환
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
            return (
              <div
                key={planet.id}
                className="planet"
                style={{
                  ...sizeStyle,
                  top: `${topValue}%`,
                  left: `${leftValue}%`,
                  backgroundImage: `url(${planet.image})`,
                  animation: `floating ${duration}s ease-in-out ${delay}s infinite`,
                }}
              >
                {planet.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MainPage;
