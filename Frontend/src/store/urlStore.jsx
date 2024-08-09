import { create } from "zustand";

const SERVER_URL = "https://i11a509.p.ssafy.io/api/v1";
const LOCAL_URL = "http://70.12.247.69:8080/api/v1";

const useURLStore = create((set) => ({
  SERVER_URL: SERVER_URL,
  setSERVERURL: (newURL) => set({ SERVER_URL: newURL }),
}));

export default useURLStore;
