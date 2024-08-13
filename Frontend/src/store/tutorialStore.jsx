import { create } from 'zustand';

const useTutorialStore = create((set) => ({
  currentPage: 0,
  showModal: false,
  dontShowAgain: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  setShowModal: (show) => set({ 
    showModal: show, 
    currentPage: 0  // 모달을 열 때마다 1페이지로 초기화
  }),
  setDontShowAgain: (dontShow) => {
    localStorage.setItem('dontShowTutorial', JSON.stringify(dontShow));
    set({ dontShowAgain: dontShow });
  },
  initialize: () => {
    const dontShow = JSON.parse(localStorage.getItem('dontShowTutorial'));
    set({ dontShowAgain: dontShow });
    if (!dontShow) {
      set({ showModal: true });
    }
  },
  closeModal: () => set((state) => {
    if (state.dontShowAgain) {
      localStorage.setItem('dontShowTutorial', 'true');
    }
    return { showModal: false };
  }),
}));

export default useTutorialStore;
