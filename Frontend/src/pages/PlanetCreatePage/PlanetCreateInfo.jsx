import { useNavigate } from "react-router-dom";
import PlanetCreateFoam from "../../components/Foam/PlanetCreateFoam";

function PlanteCreateInfo() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate(-1)} className="back-button">
        뒤로가기버튼
      </button>
      <PlanetCreateFoam />
    </>
  );
}

export default PlanteCreateInfo;
