import { useState } from "react";

import { BiSolidImageAlt } from "react-icons/bi";
import { BiSolidLeftArrowCircle } from "react-icons/bi";
import "../../styles/PlanetVerification.css";
import { useLocation, useNavigate } from "react-router-dom";

const PlanetVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const content = location.state;

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div>
      <div>
        <BiSolidLeftArrowCircle
          onClick={() => navigate(-1)}
          className="back-button"
        />
        <h2>{content}</h2>
        <div>
          {!selectedImage ? (
            <label htmlFor="upload-input" className="upload-label">
              <BiSolidImageAlt size={50} />
              <span>인증 기준 사진 올리기</span>
              <input
                id="upload-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="upload-input"
              />
            </label>
          ) : (
            <img
              src={selectedImage}
              alt="Uploaded"
              className="uploaded-image"
            />
          )}
        </div>
        {selectedImage && (
          <div className="buttons">
            <button className="button">업로드하기</button>
            <button className="button" onClick={() => setSelectedImage(null)}>
              다시 찍기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanetVerification;
