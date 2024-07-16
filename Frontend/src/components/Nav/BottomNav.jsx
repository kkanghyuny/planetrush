import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">메인페이지</Link>
        </li>
        <li>
          <Link to="/create">생성하기</Link>
        </li>
        <li>
          <Link to="/mypage">마이페이지</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
