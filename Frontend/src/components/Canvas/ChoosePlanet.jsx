import { useEffect, useState } from "react";
import "../../styles/ChoosePlanet.css";
import instance from "../../pages/AuthenticaitionPage/Axiosinstance";

function ChoosePlanet({ onSelectImage }) {
  const [imgList, setImgList] = useState([]);

  const [initialLoad, setInitialLoad] = useState(true); // 이미지가 처음 로드되었는지 여부를 추적하는 상태 추가

  //마운트 시 불러올 데이터
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await instance.get("/planets/images");
        if (response.status === 200) {
          const data = response.data;
          setImgList(data.data);

          //default
          if (initialLoad && data.data.length > 0) {
            onSelectImage(data.data[0]); // Select the first image by default
            setInitialLoad(false); // 첫 로드 이후에는 false로 변경
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error.code);
      }
    };

    fetchImages();
  }, [initialLoad, onSelectImage]);

  return (
    <div className="grid-container">
      {imgList.map((img, index) => (
        <img
          key={index}
          src={img.imgUrl}
          alt={`행성 ${index + 1}`}
          className="grid-Item"
          onClick={() => onSelectImage(img)}
        />
      ))}
    </div>
  );
}

export default ChoosePlanet;
