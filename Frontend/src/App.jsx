import "./App.css";
import { Router, Route, Routes } from "react-router-dom";

import MainPage from "./pages/MainPage/MainPage";
import PlanetCreate from "./pages/PlanetCreatePage/PlanetCreate";
import MyPlanetDoing from "./pages/MyPage/MyPlanetDoing";
import Navigation from "./components/Nav/BottomNav";
import SearchBar from "./pages/SearchPage/SearchPlanet";
import PlanetDetailRecruiting from "./pages/PlanetDetailPage/PlanetDetailRecruting";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<PlanetCreate />} />
        <Route path="/mypage" element={<MyPlanetDoing />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/planet" element={<PlanetDetailRecruiting />} />
      </Routes>
      <Navigation />
    </>
  );
}

export default App;
