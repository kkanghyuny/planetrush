import React from "react";

import inProgressPlanet from "../../assets/inprogressplanet.png";
import readyPlanet from "../../assets/readyplanet.png";
import mainPageButton from "../../assets/mainpagebutton.png";
import myPageButton from "../../assets/mypagebutton.png";
import createPageButton from "../../assets/createpagebutton.png";
import searchPageButton from "../../assets/searchpagebutton.png";
import tutorialButton from "../../assets/tutorialbutton.png";

const TutorialList = () => {
  return [
    {
      image: mainPageButton,
      description: "① 메인 페이지 버튼",
    },
    {
      image: myPageButton,
      description: "② 마이 페이지 버튼",
    },
    {
      image: createPageButton,
      description: "③ 생성 페이지 버튼",
    },
    {
      image: searchPageButton,
      description: "④ 검색 페이지 버튼",
    },
    {
      image: readyPlanet,
      description: "⑤ 챌린지 시작 전",
    },
    {
      image: inProgressPlanet,
      description: "⑥ 챌린지 진행 중",
    },
    {
      image: tutorialButton,
      description: "⑦ 튜토리얼 다시 보기",
    },
  ];
};

export default TutorialList;
