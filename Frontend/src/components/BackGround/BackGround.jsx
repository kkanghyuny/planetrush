import React, { useEffect, useState } from "react";
import "../../styles/BackGround.css";

const Background = () => {
  const [timeOfDay, setTimeOfDay] = useState("");

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
