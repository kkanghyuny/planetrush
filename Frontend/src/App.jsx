import "./App.css";
import { Router, Route, Routes } from "react-router-dom";

import MainPage from "./pages/MainPage/MainPage";
import PlanetCreate from "./pages/PlanetCreatePage/PlanetCreate";
import MyPlanetDoing from "./pages/MyPage/MyPlanetDoing";
import Navigation from "./components/Nav/BottomNav";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<PlanetCreate />} />
        <Route path="/mypage" element={<MyPlanetDoing />} />
      </Routes>
    </>
  );
}

export default App;
