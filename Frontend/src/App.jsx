import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import BackGround from "./components/BackGround/BackGround";

import StartPage from "./pages/StartPage/StartPage";
import MainPage from "./pages/MainPage/MainPage";
import Auth from "./pages/AuthenticaitionPage/Kakaoauth";

import Navigation from "./components/Nav/BottomNav";
import SearchBar from "./pages/SearchPage/SearchPlanet";

import PlanetDetailRecruiting from "./pages/PlanetDetailPage/PlanetDetailRecruiting";
import PlanetDetailInProgress from "./pages/PlanetDetailPage/PlanetDetailInProgress";

import PlanetCreateImg from "./pages/PlanetCreatePage/PlanetCreateImg";
import PlanetCreateInfo from "./pages/PlanetCreatePage/PlanetCreateInfo";
import PlanetResult from "./pages/PlanetCreatePage/PlanetResult";

import MyPage from "./pages/MyPage/MyPage";

import "./App.css";

function App() {
  const location = useLocation();
  const isStartPage = location.pathname === "/";

  return (
    <div className="App">
      <BackGround />
      <div className="route-wrapper">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/auth" element={<Auth />} />

          <Route path="/search" element={<SearchBar />} />

          <Route path="/create" element={<PlanetCreateImg />} />
          <Route path="/create-foam" element={<PlanetCreateInfo />} />
          <Route path="/result" element={<PlanetResult />} />

          <Route path="/planet/:id" element={<PlanetDetailRecruiting />} />
          <Route path="/planet-progress" element={<PlanetDetailInProgress />} />

          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
      {!isStartPage && <Navigation />}
    </div>
  );
}

export default App;
