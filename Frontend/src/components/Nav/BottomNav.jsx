import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav>
      <div>
        <Link to="/main">메인페이지</Link>
      </div>
      <div>
        <Link to="/create">생성하기</Link>
      </div>
      <div>
        <Link to="/mypage">마이페이지</Link>
      </div>
    </nav>
  );
}

export default Navigation;
