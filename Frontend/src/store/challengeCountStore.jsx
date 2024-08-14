import { create } from 'zustand';

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key) => {
  const savedValue = localStorage.getItem(key);
  return savedValue ? JSON.parse(savedValue) : null;
};

const useChallengeCountStore = create((set) => ({
  challengeCount: loadFromLocalStorage('challengeCount') || 0,
  
  resetChallengeCount: (count) => {
    set({ challengeCount: count });
    saveToLocalStorage('challengeCount', count);
  },

  incrementChallengeCount: () => {
    set((state) => {
      const newCount = state.challengeCount + 1;
      saveToLocalStorage('challengeCount', newCount);
      return { challengeCount: newCount };
    });
  },

  decrementChallengeCount: () => {
    set((state) => {
      const newCount = state.challengeCount - 1;
      saveToLocalStorage('challengeCount', newCount);
      return { challengeCount: newCount };
    });
  },
}));

export default useChallengeCountStore;
