import React from "react";
import { Link } from "react-router-dom";

function MainPage() {
  return (
    <div>
      <h1>메인페이지임</h1>
      <div>
        <Link to="/search">검색</Link>
      </div>

      <div>
        <Link to="/planet">모집 중 플래닛</Link>
      </div>
    </div>
  );
}

export default MainPage;
