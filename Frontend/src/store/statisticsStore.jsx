import { create } from "zustand";

const useStatisticsStore = create((set) => ({
  challengeCnt: 0,
  completionCnt: 0,
  setStatistics: (challengeCnt, completionCnt) =>
    set({ challengeCnt, completionCnt }),
}));

export default useStatisticsStore;
