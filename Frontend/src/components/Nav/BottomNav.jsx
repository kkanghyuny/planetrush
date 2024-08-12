import React from "react";
import { Link } from "react-router-dom";
import { BiPlusCircle, BiSolidUserCircle, BiWorld } from "react-icons/bi";
import "../../styles/Nav.css";

const Navigation = () => {
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-item-create">
          <Link to="/create" onClick={(e) => handleLinkClick(e, "/create")}>
            <BiPlusCircle />
          </Link>
        </div>
        <div className="navbar-item-main">
          <Link to="/main" onClick={(e) => handleLinkClick(e, "/main")}>
            <BiWorld />
          </Link>
        </div>
        <div className="navbar-item-mypage">
          <Link to="/mypage" onClick={(e) => handleLinkClick(e, "/mypage")}>
            <BiSolidUserCircle />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
