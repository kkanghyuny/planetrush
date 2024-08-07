import { create } from "zustand";

const DEV_URL = "http://i11a509.p.ssafy.io/api/v1";
const SERVER_URL = "http://planetrush_api:8080/api/v1";

const useURLStore = create((set) => ({
  SERVER_URL: SERVER_URL,
  setSERVERURL: (newURL) => set({ SERVER_URL: newURL }),
}));

export default useURLStore;
