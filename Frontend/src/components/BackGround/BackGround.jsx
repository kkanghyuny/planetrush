import React, { useEffect, useState } from "react";
import "../../styles/BackGround.css";

const Background = () => {
  const [timeOfDay, setTimeOfDay] = useState("");

  //시간에 따른 색깔 변경
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setTimeOfDay("morning");
    } else {
      setTimeOfDay("night");
    }
  }, []);

  return (
    <div className={timeOfDay}>
      <div className="gradient"></div>
      <div className="stars"></div>
    </div>
  );
};

export default Background;
