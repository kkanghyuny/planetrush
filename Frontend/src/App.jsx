import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Cookies from "js-cookie";

import BackGround from "./components/BackGround/BackGround";

import StartPage from "./pages/StartPage/StartPage";
import MainPage from "./pages/MainPage/MainPage";
import Auth from "./pages/AuthenticaitionPage/Kakaoauth";

import Navigation from "./components/Nav/BottomNav";
import SearchBar from "./pages/SearchPage/SearchPlanet";
import Tutorial from "./components/Modals/TutorialModal";

import PlanetDetailRecruiting from "./pages/PlanetDetailPage/PlanetDetailRecruiting";
import PlanetDetailInProgress from "./pages/PlanetDetailPage/PlanetDetailInProgress";

import PlanetVerification from "./pages/VerificationPage/PlanetVerification";

import PlanetCreateImg from "./pages/PlanetCreatePage/PlanetCreateImg";
import PlanetCreateInfo from "./pages/PlanetCreatePage/PlanetCreateInfo";
import PlanetResult from "./pages/PlanetCreatePage/PlanetResult";

import MyPage from "./pages/MyPage/MyPage";

import "./App.css";

const PrivateRoute = ({ element }) => {
  const accessToken = Cookies.get("access-token");
  const isValidToken = accessToken && accessToken.startsWith("Bearer");

  return isValidToken ? element : <Navigate to="/" />;
};

function App() {
  const location = useLocation();
  const isStartPage = location.pathname === "/";
  const isMainPage = location.pathname === "/main";

  return (
    <div className="App">
      <BackGround />

      <div
        className={`route-wrapper ${isStartPage ? "start-page-wrapper" : ""}`}
      >
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/main"
            element={<PrivateRoute element={<MainPage />} />}
          />
          <Route
            path="/search"
            element={<PrivateRoute element={<SearchBar />} />}
          />
          <Route
            path="/create"
            element={<PrivateRoute element={<PlanetCreateImg />} />}
          />
          <Route
            path="/create-foam"
            element={<PrivateRoute element={<PlanetCreateInfo />} />}
          />
          <Route
            path="/result"
            element={<PrivateRoute element={<PlanetResult />} />}
          />
          <Route
            path="/planet/:id"
            element={<PrivateRoute element={<PlanetDetailRecruiting />} />}
          />
          <Route
            path="/planet-progress"
            element={<PrivateRoute element={<PlanetDetailInProgress />} />}
          />
          <Route
            path="/verificate"
            element={<PrivateRoute element={<PlanetVerification />} />}
          />
          <Route
            path="/mypage"
            element={<PrivateRoute element={<MyPage />} />}
          />
        </Routes>
      </div>
      {!isStartPage && <Navigation />}
      {isMainPage && <Tutorial />}
    </div>
  );
}

export default App;
