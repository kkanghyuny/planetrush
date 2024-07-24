import { Navigate } from "react-router-dom";
import PlanetCreateFoam from "../../components/Foam/PlanetCreateFoam";

function PlanteCreateInfo() {
  return (
    <>
      <button onClick={() => Navigate(-1)} className="back-button">
        뒤로가기버튼
      </button>
      <PlanetCreateFoam />
    </>
  );
}

export default PlanteCreateInfo;
