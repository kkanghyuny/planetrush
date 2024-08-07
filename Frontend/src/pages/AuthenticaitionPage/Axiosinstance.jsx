import axios from "axios";
import Cookies from "js-cookie";

import useURLStore from "./store/userStore";

// Axios 인스턴스 생성
const { SERVER_URL } = useURLStore();

const instance = axios.create({
  baseURL: SERVER_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그아웃 처리 함수
const handleLogout = () => {
  window.location.href = "/"; // 홈 페이지로 리디렉션
};

// 요청 인터셉터 설정
instance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access-token");

    if (accessToken) {
      config.headers["Authorization"] = `${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh-token");

      if (refreshToken) {
        try {
          // 토큰 재발급 요청
          const responseAgain = await axios.post(
            `${SERVER_URL}/members/auth/reissue`,
            {
              refreshToken: refreshToken,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const againData = responseAgain.data.data;
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            againData;

          // 새로운 토큰을 쿠키에 저장
          Cookies.set("access-token", newAccessToken);

          Cookies.set("refresh-token", newRefreshToken);

          // Axios 기본 헤더와 원래 요청 헤더에 새로운 토큰 설정
          instance.defaults.headers.common[
            "Authorization"
          ] = `${newAccessToken}`;
          originalRequest.headers["Authorization"] = `${newAccessToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    }
    return Promise.reject(error); // 다른 에러 발생 시 에러 반환
  }
);

export default instance; // 설정된 Axios 인스턴스 내보내기
