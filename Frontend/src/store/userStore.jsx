// store/userStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      nickname: '',
      setNickname: (newNickname) => set({ nickname: newNickname }),
    }),
    {
      name: 'userStorage',
    }
  )
);

export default useUserStore;
