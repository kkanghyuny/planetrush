import { useState } from "react";
import "../../styles/ChoosePlanet.css";

function ChoosePlanet({ onSelectImage }) {
  const [photoToAddList, setPhotoToAddList] = useState([
    { imageUrl: "https://placehold.co/150x150" },
    { imageUrl: "https://placehold.co/150x140" },
    { imageUrl: "https://placehold.co/150x130" },
    { imageUrl: "https://placehold.co/150x120" },
    { imageUrl: "https://placehold.co/150x110" },
    { imageUrl: "https://placehold.co/150x100" },
    { imageUrl: "https://placehold.co/150x90" },
    { imageUrl: "https://placehold.co/150x80" },
    { imageUrl: "https://placehold.co/150x70" },
    { imageUrl: "https://placehold.co/150x60" },
    { imageUrl: "https://placehold.co/150x50" },
    { imageUrl: "https://placehold.co/150x40" },
    { imageUrl: "https://placehold.co/150x30" },
  ]);

  return (
    <div className="grid-container">
      {photoToAddList.map((photo, index) => (
        <img
          key={index}
          src={photo.imageUrl}
          alt={`행성 ${index + 1}`}
          className="grid-Item"
          onClick={() => onSelectImage(photo.imageUrl)}
        />
      ))}
    </div>
  );
}

export default ChoosePlanet;
