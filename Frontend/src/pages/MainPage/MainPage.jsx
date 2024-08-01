import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { BiSearchAlt } from "react-icons/bi";
import "../../App.css";
import "../../styles/Main.css";


const MainPage = () => {

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
    </div>
  );
};

export default MainPage;
