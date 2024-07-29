import { useEffect, useState } from "react";
import "../../styles/ChoosePlanet.css";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

function ChoosePlanet({ onSelectImage }) {
  const [imgList, setImgList] = useState([]);

  //마운트 시 불러올 데이터
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await instance.get("/planets/images");
        if (response.status === 200) {
          setImgList(response.data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="grid-container">
      {imgList.map((img, index) => (
        <img
          key={index}
          src={img.imageUrl}
          alt={`행성 ${index + 1}`}
          className="grid-Item"
          onClick={() => onSelectImage(img.imageUrl)}
        />
      ))}
    </div>
  );
}

export default ChoosePlanet;
