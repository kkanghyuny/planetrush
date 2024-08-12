import React, { useState } from 'react';
import './App.css'; // 스타일은 별도로 정의합니다.

const Tutorial = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    "Page 1: Welcome to the tutorial!",
    "Page 2: Here is some information.",
    "Page 3: Another step in the tutorial.",
    "Page 4: Keep going!",
    "Page 5: You're halfway there.",
    "Page 6: More useful info.",
    "Page 7: Almost done!",
    "Page 8: Final steps.",
    "Page 9: Getting ready to finish.",
    "Page 10: Tutorial complete!"
  ];

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="App">
      <button onClick={() => document.getElementById('tutorialModal').style.display = 'block'}>
        Open Tutorial
      </button>

      <div id="tutorialModal" className="modal">
        <div className="modal-content">
          <span onClick={handlePrev} className="arrow">&#9664;</span>
          <div className="modal-page">
            {pages[currentPage]}
          </div>
          <span onClick={handleNext} className="arrow">&#9654;</span>
        </div>
        <div className="pagination">
          {pages.map((_, index) => (
            <span key={index} className={`dot ${index === currentPage ? 'active' : ''}`}></span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
