import { useNavigate } from "react-router-dom";
import PlanetCreateFoam from "../../components/Foam/PlanetCreateFoam";
import { BiSolidLeftArrowCircle } from "react-icons/bi";

function PlanteCreateInfo() {
  const navigate = useNavigate();

  return (
    <>
      <BiSolidLeftArrowCircle
        onClick={() => navigate(-1)}
        className="back-button"
      />
      <PlanetCreateFoam />
    </>
  );
}

export default PlanteCreateInfo;
