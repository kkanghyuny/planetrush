import "./App.css";
import { Router, Route, Routes, useLocation } from "react-router-dom";

import BackGround from "./components/BackGround/BackGround";

import StartPage from "./pages/StartPage/StartPage";
import MainPage from "./pages/MainPage/MainPage";
import MyPlanetDoing from "./pages/MyPage/MyPlanetDoing";
import Navigation from "./components/Nav/BottomNav";
import SearchBar from "./pages/SearchPage/SearchPlanet";
import PlanetDetailRecruiting from "./pages/PlanetDetailPage/PlanetDetailRecruting";
import PlanetCreateImg from "./pages/PlanetCreatePage/PlanetCreateImg";
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
        <Route path="/mypage" element={<MyPlanetDoing />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/planet" element={<PlanetDetailRecruiting />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      {!isStartPage && <Navigation />}
    </div>
  );
}

export default App;
