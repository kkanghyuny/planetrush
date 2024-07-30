import React, { useState } from "react";
import "./App.css";
import { Router, Route, Routes, useLocation } from "react-router-dom";

import BackGround from "./components/BackGround/BackGround";

import StartPage from "./pages/StartPage/StartPage";
import MainPage from "./pages/MainPage/MainPage";
import MyPage from "./pages/MyPage/MyPage";

import Navigation from "./components/Nav/BottomNav";
import SearchBar from "./pages/SearchPage/SearchPlanet";
import PlanetDetailRecruiting from "./pages/PlanetDetailPage/PlanetDetailRecruiting";
import PlanetDetailInProgress from "./pages/PlanetDetailPage/PlanetDetailInProgress";

import PlanetCreateImg from "./pages/PlanetCreatePage/PlanetCreateImg";
import PlanetCreateInfo from "./pages/PlanetCreatePage/PlanetCreateInfo";
import PlanetResult from "./pages/PlanetCreatePage/PlanetResult";

import Auth from "./pages/AuthenticaitionPage/Kakaoauth";

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
          <Route path="/mypage" element={<MyPage />} />

          <Route path="/create" element={<PlanetCreateImg />} />
          <Route path="/create-foam" element={<PlanetCreateInfo />} />
          <Route path="/result" element={<PlanetResult />} />

          <Route path="/search" element={<SearchBar />} />

          <Route path="/planet/:id" element={<PlanetDetailRecruiting />} />
          <Route path="/planet-progress" element={<PlanetDetailInProgress />} />

          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
      {!isStartPage && <Navigation />}
    </div>
  );
}

export default App;
