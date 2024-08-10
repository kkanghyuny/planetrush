import React from "react";
import { Link } from "react-router-dom";

import { BiPlusCircle } from "react-icons/bi";
import { BiSolidUserCircle } from "react-icons/bi";
import { BiWorld } from "react-icons/bi";
import "../../styles/Nav.css";

const Navigation = () => {
  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-item-create">
          <Link to="/create">
            <BiPlusCircle />
          </Link>
        </div>
        <div className="navbar-item-main">
          <Link to="/main">
            <BiWorld />
          </Link>
        </div>
        <div className="navbar-item-mypage">
          <Link to="/mypage">
            <BiSolidUserCircle />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
