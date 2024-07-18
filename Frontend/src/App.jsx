import "./App.css";
import { Router, Route, Routes } from "react-router-dom";

import BackGround from "./components/BackGround/BackGround";

import MainPage from "./pages/MainPage/MainPage";
import PlanetCreate from "./pages/PlanetCreatePage/PlanetCreate";
import MyPlanetDoing from "./pages/MyPage/MyPlanetDoing";
import Navigation from "./components/Nav/BottomNav";
import SearchBar from "./pages/SearchPage/SearchPlanet";
import PlanetDetailRecruiting from "./pages/PlanetDetailPage/PlanetDetailRecruting";
import Kakaoauth from "./pages/AuthenticaitionPage/Kakaoauth";

function App() {
  return (
    <div className="App">
      <BackGround />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<PlanetCreate />} />
        <Route path="/mypage" element={<MyPlanetDoing />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/planet" element={<PlanetDetailRecruiting />} />
        <Route path="/auth" element={<Kakaoauth />} />
      </Routes>
      <Navigation />
    </div>
  );
}

export default App;
