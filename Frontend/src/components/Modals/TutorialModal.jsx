import React, { useEffect } from 'react';
import useTutorialStore from '../../store/tutorialStore';

import TutorialList from '../Lists/TutorialList';

import tutorialButton from "../../assets/tutorial.png";
import "../../styles/Tutorial.css"

const Tutorial = () => {
  const { 
    currentPage, 
    showModal, 
    setCurrentPage, 
    setShowModal, 
    initialize, 
    closeModal 
  } = useTutorialStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 초기화
    initialize();

    // 로그인 이력 확인
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');

    if (!hasSeenTutorial) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [initialize, setShowModal]);

  const pages = TutorialList();  // pages 배열 가져오기

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

  const handleCloseModal = () => {
    closeModal();
    localStorage.setItem('hasSeenTutorial', 'true');  // 모달이 닫힐 때 로그인 이력을 localStorage에 저장
  };

  return (
    <div>
      <img
        className="tutorial-button" 
        src={tutorialButton} 
        alt="Open Tutorial" 
        onClick={() => setShowModal(true)} 
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-page">
              튜토리얼
              <img className="tutorial-img" src={pages[currentPage].image} alt={`Tutorial Page ${currentPage + 1}`} />
              <p>{pages[currentPage].description}</p>
            </div>
            <div className="arrow-area">
              <span
                onClick={handlePrev}
                className={`arrow ${currentPage === 0 ? 'hidden' : 'visible'}`}
              >
                &#9664;
              </span>
              <span
                onClick={handleNext}
                className={`arrow ${currentPage === pages.length - 1 ? 'hidden' : 'visible'}`}
              >
                &#9654;
              </span>
            </div>

            <div className="exit-button-container">
                <button onClick={handleCloseModal} className="close-button">
                닫기
                </button>
            </div>
            <div className="pagination">
              {pages.map((_, index) => (
                <span key={index} className={`dot ${index === currentPage ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tutorial;
