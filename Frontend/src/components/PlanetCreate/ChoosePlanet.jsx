import { useEffect, useState } from "react";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

import "../../styles/ChoosePlanet.css";

const ChoosePlanet = ({ selectImage }) => {
  const [imgList, setImgList] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);

  //마운트 시 불러올 데이터
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await instance.get("/planets/images");
        const data = response.data;

        if (response.status === 200) {
          setImgList(data.data);

          //default
          if (initialLoad && data.data.length > 0) {
            selectImage(data.data[0]);
            setInitialLoad(false);
          }
        }
      } catch (error) {
        throw error
      }
    };

    fetchImages();
  }, [initialLoad, selectImage]);

  return (
    <div className="grid-container">
      {imgList.map((img, index) => (
        <img
          key={index}
          src={img.imgUrl}
          alt={`행성 ${index + 1}`}
          className="grid-Item"
          onClick={() => selectImage(img)}
        />
      ))}
    </div>
  );
};

export default ChoosePlanet;
