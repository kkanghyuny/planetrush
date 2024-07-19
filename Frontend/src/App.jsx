import "./App.css";
import { Router, Route, Routes, useLocation } from "react-router-dom";

import BackGround from "./components/BackGround/BackGround";

import StartPage from "./pages/StartPage/StartPage";
import MainPage from "./pages/MainPage/MainPage";

import Navigation from "./components/Nav/BottomNav";
import SearchBar from "./pages/SearchPage/SearchPlanet";

import PlanetDetailRecruiting from "./pages/PlanetDetailPage/PlanetDetailRecruting";
import PlanetDetailInProgress from "./pages/PlanetDetailPage/PlanetDetailInProgress";

import PlanetCreateImg from "./pages/PlanetCreatePage/PlanetCreateImg";
import PlanetCreateInfo from "./pages/PlanetCreatePage/PlanetCreateInfo";

import Auth from "./pages/AuthenticaitionPage/Kakaoauth";

function App() {
  const location = useLocation();
  const isStartPage = location.pathname === "/";
  return (
    <div className="App">
      <BackGround />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/main" element={<MainPage />} />

        <Route path="/create" element={<PlanetCreateImg />} />
        <Route path="/create-foam" element={<PlanetCreateInfo />} />

        <Route path="/search" element={<SearchBar />} />

        <Route path="/planet-recruit" element={<PlanetDetailRecruiting />} />
        <Route path="/planet-inProgress" element={<PlanetDetailInProgress />} />

        <Route path="/auth" element={<Auth />} />
      </Routes>
      {!isStartPage && <Navigation />}
    </div>
  );
}

export default App;
